import * as React from 'react';
import { IPurchaseRequisitionFormProps, IPurchaseRequisitionFormState } from './IPurchaseRequisitionFormProps';
import styles from './PurchaseRequisitionForm.module.scss';
import {
    MessageBar, MessageBarType, IPersonaProps, assign, autobind, css, CompactPeoplePicker,
    IBasePickerSuggestionsProps, NormalPeoplePicker, Button, Checkbox, ChoiceGroup, Breadcrumb, ComboBox, DatePicker,
    Dialog, Dropdown, Persona, TextField, Toggle, Tooltip, IContextualMenuItem, Label, format
} from 'office-ui-fabric-react';
import { IPersonaWithMenu } from 'office-ui-fabric-react/lib/components/pickers/PeoplePicker/PeoplePickerItems/PeoplePickerItem.Props';
import {
    IClientPeoplePickerSearchUser,
    IEnsurableSharePointUser,
    IEnsureUser,
    SharePointUserPersona
} from '../../models/IPeoplePicker';
//import { PurchaseRequisitionActionhandler } from '../Container/PurchaseRequisitionActionHandler';
import "../../../../../node_modules/office-ui-fabric-core/dist/css/fabric.min.css";
import {
    SPHttpClient,
    SPHttpClientBatch,
    SPHttpClientResponse
} from '@microsoft/sp-http';
import * as lodash from 'lodash';
import { Environment, EnvironmentType } from '@microsoft/sp-core-library';
import * as pnp from 'sp-pnp-js';
import IPurchaseRequisition from '../../models/IPurchaseRequisition';
import IItemResult from '../../models/IItemResult';
const suggestionProps: IBasePickerSuggestionsProps = {
    suggestionsHeaderText: 'Suggested People',
    noResultsFoundText: 'No results found',
    loadingText: 'Loading'
};
import IPurchaseDetails from '../../models/IPurchaseDetails';
import { Repeatable } from './Repeatable';

export class PurchaseRequisitionForm extends React.Component<IPurchaseRequisitionFormProps, IPurchaseRequisitionFormState> {
    //private actionHandler: PurchaseRequisitionActionhandler;
    private _peopleList;
    private siteUrl = "https://campress.sharepoint.com/sites/IntranetDevelopment/ManilaProcurement/";
    //private purchDet = []

    private contextualMenuItems: IContextualMenuItem[] = [
        {
            key: 'newItem',
            icon: 'circlePlus',
            name: 'New'
        },
        {
            key: 'upload',
            icon: 'upload',
            name: 'Upload'
        },
        {
            key: 'divider_1',
            name: '-',
        },
        {
            key: 'rename',
            name: 'Rename'
        },
        {
            key: 'properties',
            name: 'Properties'
        },
        {
            key: 'disabled',
            name: 'Disabled item',
            disabled: true
        }
    ];


    constructor(props: IPurchaseRequisitionFormProps) {
        super(props);
        this._peopleList = [];
        this.onSaveClick = this.onSaveClick.bind(this);
        this.state = {
            Title: "",
            To: "",
            Department: "",
            PurchaseDetails: [],
            TotalCost: "",
            SAPCostCentre: "",
            AccountCode: "",
            RequestedBy: "",
            BudgetMonth: "",
            BudgetBalance: "",

            PurchaseOrder: "",

            Errors: [],
            isLoading: false,
            selectedUsers: [],
            currentPicker: "",
            delayResults: false
        };


    }

    public perRow() {
        return this.state.PurchaseDetails.map((pd, i) =>

            <fieldset key={i}>

                <input type="text" name='ProjectCode' className="form-control" placeholder="Project Code" value={pd.ProjectCode} onChange={(evt) => this._handleChange(evt, i)} />
                <input type="text" name='BudgetCode' className="form-control" placeholder="Budge Code" value={pd.BudgetCode} onChange={(evt) => this._handleChange(evt, i)} />
                <input type="text" name='Details' className="form-control" placeholder="Details" value={pd.Details} onChange={(evt) => this._handleChange(evt, i)} />
                <input type="text" name='Quantity' className="form-control" placeholder="Quantity" value={pd.Quantity} onChange={(evt) => this._handleChange(evt, i)} />
                <input type="text" name='Cost' className="form-control" placeholder="Cost" value={pd.Cost} onChange={(evt) => this._handleChange(evt, i)} />
                <input type="text" name='SubTotal' className="form-control" placeholder="SubTotal" value={pd.SubTotal} onChange={(evt) => this._handleChange(evt, i)} readOnly />
                <Button onClick={this.removeClick.bind(this, i)} text='Remove' />
            </fieldset>
        )
    }

    @autobind
    private _handleChange(event, rowCount) {
        const { value, name  } = event.target
        this.setState(prevState => {
            console.log('tfs')
            if (prevState.PurchaseDetails[rowCount]) {
                return {
                    PurchaseDetails: prevState.PurchaseDetails.map((detail,index) => {
                        if(index === rowCount){
                            
                            return {
                                ...detail,
                                [name]: value
                            }
                        }else{
                            return detail
                        }
                    }) 
                }
            }
        });
    }

    public addClick() {
        this.setState(prevState => {
            if (prevState.PurchaseDetails.length < 1) {
                return {
                    PurchaseDetails: [{
                        ProjectCode: "",
                        BudgetCode: "",
                        Details: "",
                        Quantity: 0,
                        Cost: 0,
                        SubTotal: 0
                    }]
                }
            } else {
                return {
                    PurchaseDetails: [...prevState.PurchaseDetails, {
                        ProjectCode: "",
                        BudgetCode: "",
                        Details: "",
                        Quantity: 0,
                        Cost: 0,
                        SubTotal: 0
                    }]
                }
            }
        })
        console.log(this.state);
    }

    public removeClick(i) {
        let values = [...this.state.PurchaseDetails];
        values.splice(i, 1);
        this.setState({ PurchaseDetails: values });
    }


    public render() {
        // Render nothing if the "show" prop is false
        if (!this.props.show) {
            return null;
        }
        const spinner = (
            <div className='loading'>Processing...</div>
        );
        return (
            <div>
                <div className={styles.backdrop}>
                    <div className={styles.modal}>
                        Fixed some form fields Purchase Details still not working    <div className={styles.modalBody}>
                            {this.state.isLoading ? spinner : ''}

                            {/* Display Messages */}
                            {this.state.Errors.length > 0 ?

                                <div className={css("ms-Grid-row")} >
                                    <MessageBar
                                        messageBarType={MessageBarType.error}
                                        isMultiline={true}
                                        onDismiss={() => this.setState({ Errors: [] })}
                                    >
                                        <div className={css("ms-font-m-plus")}>
                                            {this.state.Errors.map((msg, index) => (
                                                <div key={index}>
                                                    {msg}
                                                </div>
                                            ))}
                                        </div>
                                    </MessageBar>
                                    <br />
                                </div>
                                : ''
                            }

                            <ChoiceGroup
                                label='Department'
                                required={true}
                                options={[
                                    { key: 'CUP', text: 'CUP' },
                                    { key: 'CA', text: 'CA' }
                                ]}
                            />

                            <TextField
                                label='Vendor'
                                required={true}
                                placeholder='Enter vendor here'
                                value={this.state.To}
                                onBlur={(evt) => this._updateFormDataState('To', evt)}
                            />

                            <Label> Requesting Manager </Label>
                            <NormalPeoplePicker
                                onChange={this._onChange.bind(this)}
                                onResolveSuggestions={this._onFilterChanged}
                                getTextFromItem={(persona: IPersonaProps) => persona.primaryText}
                                pickerSuggestionsProps={suggestionProps}
                                className={'ms-PeoplePicker'}
                                key={'normal'}
                                onBlur={(evt) => this._updateFormDataState('RequestedBy', evt)}
                            />



                            <div>
                                <Label> Purchase Details </Label>
                                {this.perRow()}
                                <Button onClick={this.addClick.bind(this)} text='Add' />
                            </div>

                            <TextField
                                label='Total Cost'
                                required={true}
                                placeholder='Total Cost'
                                value={this.state.TotalCost}

                                onBlur={(evt) => this._updateFormDataState('TotalCost', evt)}
                            />

                            <Dropdown
                                placeHolder="SAP Cost Centre"
                                required={true}
                                label="SAP Cost Centre"
                                onChanged={(item) => this._updateDropdownState('SAPCostCentre', item.key)}
                                options={[
                                    { key: 'F', text: 'Option f', data: { icon: 'Running' } },
                                    { key: 'G', text: 'Option g', data: { icon: 'EmojiNeutral' } },
                                    { key: 'H', text: 'Option h', data: { icon: 'ChatInviteFriend' } },
                                    { key: 'I', text: 'Option i', data: { icon: 'SecurityGroup' } },
                                    { key: 'J', text: 'Option j', data: { icon: 'AddGroup' } }
                                ]}
                            />

                            <Dropdown
                                placeHolder="Account Code"
                                required={true}
                                label="Account Code"
                                onChanged={(item) => this._updateDropdownState('AccountCode', item.key)}
                                options={[
                                    { key: 'F', text: 'Option f', data: { icon: 'Running' } },
                                    { key: 'G', text: 'Option g', data: { icon: 'EmojiNeutral' } },
                                    { key: 'H', text: 'Option h', data: { icon: 'ChatInviteFriend' } },
                                    { key: 'I', text: 'Option i', data: { icon: 'SecurityGroup' } },
                                    { key: 'J', text: 'Option j', data: { icon: 'AddGroup' } }
                                ]}
                            />

                            <TextField
                                label='Budget (Month)'
                                required={true}
                                placeholder='Budget (Month)'
                                value={this.state.BudgetMonth}
                                onBlur={(evt) => this._updateFormDataState('BudgetMonth', evt)}
                            />

                            <TextField
                                label='Budget (Balance)'
                                required={true}
                                placeholder='Budget (Balance)'
                                value={this.state.BudgetBalance}
                                onBlur={(evt) => this._updateFormDataState('BudgetBalance', evt)}
                            />

                            <TextField
                                label='Purchase Order'
                                required={true}
                                placeholder='Purchase Order'
                                value={this.state.PurchaseOrder}
                                onBlur={(evt) => this._updateFormDataState('PurchaseOrder', evt)}
                            />

                            <div className="footer">
                                <Button
                                    onClick={this.onSaveClick}
                                    text='Save'
                                />

                                <Button
                                    onClick={this.props.onClose}
                                    text='Close'
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    }

    private async onSaveClick(): Promise<void> {
        console.log("save data");
        // if (this.validateFormData() === false) {
        //     return;
        // }
        this.setLoading(true);
        const formData: IPurchaseRequisition = {
            Id: '',
            To: this.state.To,
            Department: this.state.Department,
            PurchaseDet: this.state.PurchaseDetails,
            TotalCost: this.state.TotalCost,
            SAPCostCentre: this.state.SAPCostCentre,
            AccountCode: this.state.AccountCode,
            RequestedBy: this.state.RequestedBy,
            BudgetBalance: this.state.BudgetBalance,
            BudgetMonth: this.state.BudgetMonth,
            PurchaseOrder: this.state.PurchaseOrder
        };
        console.log(formData);
        const result: IItemResult = await this.props.actionHandler.createPurchaseRequisition(formData);
        if (result.status === false) {
            this.setState({ Errors: [result.message] });
        }

        this.setLoading(false);
    }

    @autobind
    private setLoading(status: boolean): void {
        this.setState({ isLoading: status });
    }

    @autobind
    private _updateFormDataState(prop: any, evt) {
        console.log(prop, evt.target);
        this.setState({
            [prop]: evt.target.value
        });
    }

    @autobind
    private _updateDropdownState(prop: any, evt) {
        console.log(prop, evt);
        this.setState({
            [prop]: evt
        });
    }

    private _onChange(items: any[]) {
        this.setState({
            selectedUsers: items
        });
        if (this.props.onChange) {
            this.props.onChange(items);
        }
    }

    @autobind
    private async _onFilterChanged(filterText: string, currentPersonas: IPersonaProps[], limitResults?: number) {
        if (filterText) {
            if (filterText.length > 2) {
                //comment out muna

                return this._searchPeople(filterText, this._peopleList);
            }
        } else {
            return [];
        }
    }

    /**
   * @function
   * Returns fake people results for the Mock mode
   */
    private searchPeopleFromMock(): IPersonaProps[] {
        return this._peopleList = [
            {
                imageUrl: './images/persona-female.png',
                imageInitials: 'PV',
                primaryText: 'Annie Lindqvist',
                secondaryText: 'Designer',
                tertiaryText: 'In a meeting',
                optionalText: 'Available at 4:00pm'
            },
            {
                imageUrl: './images/persona-male.png',
                imageInitials: 'AR',
                primaryText: 'Aaron Reid',
                secondaryText: 'Designer',
                tertiaryText: 'In a meeting',
                optionalText: 'Available at 4:00pm'
            },
            {
                imageUrl: './images/persona-male.png',
                imageInitials: 'AL',
                primaryText: 'Alex Lundberg',
                secondaryText: 'Software Developer',
                tertiaryText: 'In a meeting',
                optionalText: 'Available at 4:00pm'
            },
            {
                imageUrl: './images/persona-male.png',
                imageInitials: 'RK',
                primaryText: 'Roko Kolar',
                secondaryText: 'Financial Analyst',
                tertiaryText: 'In a meeting',
                optionalText: 'Available at 4:00pm'
            },
        ];
    }

    /**
     * @function
     * Returns people results after a REST API call
     */
    private _searchPeople(terms: string, results: IPersonaProps[]): IPersonaProps[] | Promise<IPersonaProps[]> {

        if (DEBUG && Environment.type === EnvironmentType.Local) {
            // If the running environment is local, load the data from the mock
            return this.searchPeopleFromMock();
        } else {
            const userRequestUrl: string = `${this.siteUrl}/_api/SP.UI.ApplicationPages.ClientPeoplePickerWebServiceInterface.clientPeoplePickerSearchUser`;
            let principalType: number = 0;
            if (this.props.principalTypeUser === true) {
                principalType += 1;
            }
            if (this.props.principalTypeSharePointGroup === true) {
                principalType += 8;
            }
            if (this.props.principalTypeSecurityGroup === true) {
                principalType += 4;
            }
            if (this.props.principalTypeDistributionList === true) {
                principalType += 2;
            }
            const userQueryParams = {
                'queryParams': {
                    'AllowEmailAddresses': true,
                    'AllowMultipleEntities': false,
                    'AllUrlZones': false,
                    'MaximumEntitySuggestions': this.props.numberOfItems,
                    'PrincipalSource': 15,
                    // PrincipalType controls the type of entities that are returned in the results.
                    // Choices are All - 15, Distribution List - 2 , Security Groups - 4, SharePoint Groups - 8, User - 1.
                    // These values can be combined (example: 13 is security + SP groups + users)
                    'PrincipalType': principalType,
                    'QueryString': terms
                }
            };

            return new Promise<SharePointUserPersona[]>((resolve, reject) =>
                this.props.spHttpClient.post(userRequestUrl,
                    SPHttpClient.configurations.v1, { body: JSON.stringify(userQueryParams) })
                    .then((response: SPHttpClientResponse) => {
                        return response.json();
                    })
                    .then((response: { value: string }) => {
                        let userQueryResults: IClientPeoplePickerSearchUser[] = JSON.parse(response.value);
                        let persons = userQueryResults.map(p => new SharePointUserPersona(p as IEnsurableSharePointUser));
                        return persons;
                    })
                    .then((persons) => {
                        const batch = this.props.spHttpClient.beginBatch();
                        const ensureUserUrl = `${this.siteUrl}/_api/web/ensureUser`;
                        const batchPromises: Promise<IEnsureUser>[] = persons.map(p => {
                            var userQuery = JSON.stringify({ logonName: p.User.Key });
                            return batch.post(ensureUserUrl, SPHttpClientBatch.configurations.v1, {
                                body: userQuery
                            })
                                .then((response: SPHttpClientResponse) => response.json())
                                .then((json: IEnsureUser) => json);
                        });

                        var users = batch.execute().then(() => Promise.all(batchPromises).then(values => {
                            values.forEach(v => {
                                let userPersona = lodash.find(persons, o => o.User.Key == v.LoginName);
                                if (userPersona && userPersona.User) {
                                    let user = userPersona.User;
                                    lodash.assign(user, v);
                                    userPersona.User = user;
                                }
                            });

                            resolve(persons);
                        }));
                    }, (error: any): void => {
                        reject(this._peopleList = []);
                    }));
        }
    }

    private _filterPersonasByText(filterText: string): IPersonaProps[] {
        return this._peopleList.filter(item => this._doesTextStartWith(item.primaryText, filterText));
    }

    private _removeDuplicates(personas: IPersonaProps[], possibleDupes: IPersonaProps[]) {
        return personas.filter(persona => !this._listContainsPersona(persona, possibleDupes));
    }
    private _listContainsPersona(persona: IPersonaProps, personas: IPersonaProps[]) {
        if (!personas || !personas.length || personas.length === 0) {
            return false;
        }
        return personas.filter(item => item.primaryText === persona.primaryText).length > 0;
    }
    private _filterPromise(personasToReturn: IPersonaProps[]): IPersonaProps[] | Promise<IPersonaProps[]> {
        if (this.state.delayResults) {
            return this._convertResultsToPromise(personasToReturn);
        } else {
            return personasToReturn;
        }
    }
    private _convertResultsToPromise(results: IPersonaProps[]): Promise<IPersonaProps[]> {
        return new Promise<IPersonaProps[]>((resolve, reject) => setTimeout(() => resolve(results), 2000));
    }
    private _doesTextStartWith(text: string, filterText: string): boolean {
        return text.toLowerCase().indexOf(filterText.toLowerCase()) === 0;
    }


}