import * as React from 'react';
import { IPurchaseRequisitionFormProps, IPurchaseRequisitionFormState } from './IPurchaseRequisitionFormProps';
import styles from './PurchaseRequisitionForm.module.scss';
import {MessageBar, MessageBarType, IPersonaProps,  assign,autobind,css, CompactPeoplePicker,
    IBasePickerSuggestionsProps, NormalPeoplePicker, Button, Checkbox, ChoiceGroup, Breadcrumb, ComboBox, DatePicker,
    Dialog, Dropdown, Persona, TextField, Toggle,Tooltip, IContextualMenuItem } from 'office-ui-fabric-react';
import { IPersonaWithMenu } from 'office-ui-fabric-react/lib/components/pickers/PeoplePicker/PeoplePickerItems/PeoplePickerItem.Props';
import {
    IClientPeoplePickerSearchUser,
    IEnsurableSharePointUser,
    IEnsureUser,
    SharePointUserPersona } from '../../models/IPeoplePicker';
import { PurchaseRequisitionActionhandler } from '../Container/PurchaseRequisitionActionHandler';
import "../../../../../node_modules/office-ui-fabric-core/dist/css/fabric.min.css";
import {
    SPHttpClient,
    SPHttpClientBatch,
    SPHttpClientResponse } from '@microsoft/sp-http';
import  * as lodash from 'lodash';
import { Environment, EnvironmentType } from '@microsoft/sp-core-library';
import * as pnp from 'sp-pnp-js';
import IPurchaseRequisition  from '../../models/IPurchaseRequisition';
import IItemResult  from '../../models/IItemResult';
const suggestionProps: IBasePickerSuggestionsProps = {
    suggestionsHeaderText: 'Suggested People',
    noResultsFoundText: 'No results found',
    loadingText: 'Loading'
};
import IPurchaseDetails from '../../models/IPurchaseDetails';
import { Repeatable }   from './Repeatable';

export class PurchaseRequisitionForm extends React.Component<IPurchaseRequisitionFormProps,IPurchaseRequisitionFormState> {
    private actionHandler: PurchaseRequisitionActionhandler;
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
            delayResults: false,
            purchDet: []
        };
        

    }

    public perRow() {
        return this.state.purchDet.map((el,i) => 
            
            <div key={i}>         
                
                <input type="text" name='ProjectCode' className="form-control" placeholder="Project Code" value={el.ProjectCode} onBlur={(evt) => this._handleChange('ProjectCode', evt)}/>
                <input type="text" name='BudgetCode' className="form-control" placeholder="Budge Code" value={el.BudgetCode} onBlur={(evt) => this._handleChange('BudgetCode', evt)} />
                <input type="text" name='Details' className="form-control" placeholder="Details" value={el.Details} onBlur={(evt) => this._handleChange('Details', evt)} />
                <input type="text" name='Quantity' className="form-control" placeholder="Quantity" value={el.Quantity} onBlur={(evt) => this._handleChange('Quantity', evt)} />
                <input type="text" name='Cost' className="form-control" placeholder="Cost" value={el.Cost} onBlur={(evt) => this._handleChange('Cost', evt)}   />
                <input type="text" name='SubTotal' className="form-control" placeholder="SubTotal" value={el.SubTotal} onBlur={(evt) => this._handleChange('SubTotal', evt)}  readOnly />
                <Button onClick={this.removeClick.bind(this, i)} text='Remove' />
            </div> 
        )
    }
    @autobind
    private _handleChange(i, e) {
        // this.setState({
        //     [i]: evt.target.value
        // });
        const {name, value} = e.target;
        this.setState(prevState => {
            let values = [...prevState.purchDet];
            values[i] =  {...values[i], [name]: value};
            return { values };
        })
        console.log(this.state);
    }

    public addClick(){
        this.setState(prevState => ({ purchDet: [...prevState.purchDet, '']}))
        console.log(this.state);
    }

    public removeClick(i){
        let values = [...this.state.purchDet];
        values.splice(i,1);
        this.setState({ purchDet: values });
    }


    public render() {
        // Render nothing if the "show" prop is false
        if(!this.props.show) {
            return null;
        }
        const spinner = (
            <div className='loading'>Processing...</div>
        );
        return (
            <div>
             <div className={ styles.backdrop }>
                <div className={ styles.modal }>
                {this.state.isLoading ? spinner : ''}

                <a href="#" onClick={this.onSaveClick}>
                                <i className="ms-Icon ms-Icon--Save" aria-hidden="true"></i>&nbsp;Save
                            </a>

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

                 <TextField
                    label='Vendor'
                    required={true}
                    placeholder='Enter vendor here'
                    value={this.state.To}
                    onBlur={(evt) => this._updateFormDataState('To', evt)}
                />

                 <NormalPeoplePicker
                    onChange={this._onChange.bind(this) }
                    onResolveSuggestions={this._onFilterChanged }
                    getTextFromItem={(persona: IPersonaProps) => persona.primaryText}
                    pickerSuggestionsProps={suggestionProps}
                    className={'ms-PeoplePicker'}
                    key={'normal'}
                    onBlur={(evt) => this._updateFormDataState('RequestedBy', evt)}
                    />
                <div>
                    {/*this.perRow()*/}
                      {/* Pass in minimum, maximum, and title for each repeating unit */}
                    <Repeatable minRepeat={1} maxRepeat={5} titleRepeat='Product Details'>
                        <input type="text" name='ProjectCode' className="form-control" placeholder="Project Code" />
                        <input type="text" name='BudgetCode' className="form-control" placeholder="Budge Code" />
                        <input type="text" name='Details' className="form-control" placeholder="Details"   />
                        <input type="text" name='Quantity' className="form-control" placeholder="Quantity"   />
                        <input type="text" name='Cost' className="form-control" placeholder="Cost"  />
                        <input type="text" name='SubTotal' className="form-control" placeholder="SubTotal" readOnly />
                
                    </Repeatable>
                    
                </div>
                <TextField
                    label='Total Cost'
                    required={true}
                    placeholder='Total Cost'
                    value={this.state.TotalCost}
                    readOnly
                    onBlur={(evt) => this._updateFormDataState('TotalCost', evt)}
                />

                <Dropdown
                    placeHolder="SAP Cost Centre"
                    required={true}
                    label="SAP Cost Centre"
                    onBlur={(evt) => this._updateFormDataState('SAPCostCentre', evt)}
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
                    onBlur={(evt) => this._updateFormDataState('AccountCode', evt)}
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
                    value={this.state.TotalCost}
                    readOnly
                    onBlur={(evt) => this._updateFormDataState('BudgetMonth', evt)}
                />

                 <TextField
                    label='Budget (Balance)'
                    required={true}
                    placeholder='Budget (Balance)'
                    value={this.state.TotalCost}
                    readOnly
                    onBlur={(evt) => this._updateFormDataState('BudgetBalance', evt)}
                />

                <TextField
                    label='Purchase Order'
                    required={true}
                    placeholder='Purchase Order'
                    value={this.state.TotalCost}
                    readOnly
                    onBlur={(evt) => this._updateFormDataState('PurchaseOrder', evt)}
                />

                <div className="footer">

                    <Button 
                        onClick={this.props.onClose}
                        text='Close'
                    />
                </div>
                </div>
            </div>
            </div >
        );
    }

    @autobind
    private setLoading(status: boolean): void {
        this.setState({ isLoading: status });
    }

    @autobind
    private _updateFormDataState(prop: any, evt) {
        this.setState({
            [prop]: evt.target.value
        });
    }

    private _onChange(items:any[]) {
        this.setState({
            selectedUsers: items
        });
        if (this.props.onChange)
        {
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
            .then((response: {value: string}) => {
                let userQueryResults: IClientPeoplePickerSearchUser[] = JSON.parse(response.value);
                let persons = userQueryResults.map(p => new SharePointUserPersona(p as IEnsurableSharePointUser));
                return persons;
            })
            .then((persons) => {
                const batch = this.props.spHttpClient.beginBatch();
                const ensureUserUrl = `${this.siteUrl}/_api/web/ensureUser`;
                const batchPromises: Promise<IEnsureUser>[] = persons.map(p => {
                var userQuery = JSON.stringify({logonName: p.User.Key});
                return batch.post(ensureUserUrl, SPHttpClientBatch.configurations.v1, {
                    body: userQuery
                })
                .then((response: SPHttpClientResponse) => response.json())
                .then((json: IEnsureUser) => json);
                });

                var users = batch.execute().then(() => Promise.all(batchPromises).then(values => {
                values.forEach(v => {
                    let userPersona = lodash.find(persons, o => o.User.Key == v.LoginName);
                    if (userPersona && userPersona.User)
                    {
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

    private async onSaveClick(): Promise<void> {
        console.log("save data");
       // if (this.validateFormData() === false) {
       //     return;
       // }
        this.setLoading(true);
        const formData: IPurchaseRequisition = {
            Id: '',
            To: this.state.To,
            PurchaseDet: this.state.PurchaseDetails,
            TotalCost: this.state.TotalCost,
            SAPCostCentre: this.state.SAPCostCentre,
            AccountCode: this.state.AccountCode,
            RequestedBy: this.state.RequestedBy,
            BudgetBalance: this.state.BudgetBalance,
            BudgetMonth: this.state.BudgetMonth,
            PurchaseOrder: this.state.PurchaseOrder
        };

        const result: IItemResult = await this.actionHandler.createPurchaseRequisition(formData);
        if (result.status === false) {
            this.setState({ Errors: [result.message] });
        }

        this.setLoading(false);
    }
}