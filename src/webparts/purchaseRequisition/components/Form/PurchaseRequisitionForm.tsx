import * as React from 'react';
import { IPurchaseRequisitionFormProps, IPurchaseRequisitionFormState } from './IPurchaseRequisitionFormProps';
import styles from './PurchaseRequisitionForm.module.scss';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { IPersonaProps } from 'office-ui-fabric-react/lib/Persona';
import {
  assign,
  autobind,
  css
} from 'office-ui-fabric-react/lib/Utilities';
import {
    CompactPeoplePicker,
    IBasePickerSuggestionsProps,
    NormalPeoplePicker
  } from 'office-ui-fabric-react/lib/Pickers';
import {
    Button, Checkbox, ChoiceGroup, Breadcrumb, ComboBox, DatePicker, Dialog, Dropdown, Persona, TextField, Toggle,Tooltip
}from 'office-ui-fabric-react/lib/';
import {
    IClientPeoplePickerSearchUser,
    IEnsurableSharePointUser,
    IEnsureUser,
    SharePointUserPersona } from '../../models/IPeoplePicker';

import { IPersonaWithMenu } from 'office-ui-fabric-react/lib/components/pickers/PeoplePicker/PeoplePickerItems/PeoplePickerItem.Props';
import { PurchaseRequisitionActionhandler } from '../Container/PurchaseRequisitionActionHandler';


const suggestionProps: IBasePickerSuggestionsProps = {
    suggestionsHeaderText: 'Suggested People',
    noResultsFoundText: 'No results found',
    loadingText: 'Loading'
};


export class PurchaseRequisitionForm extends React.Component<IPurchaseRequisitionFormProps,IPurchaseRequisitionFormState> {
    private actionHandler: PurchaseRequisitionActionhandler;
    constructor(props: IPurchaseRequisitionFormProps) {
        super(props);
        this.onSaveClick = this.onSaveClick.bind(this);
        this.state = {
            Title: "",
            To: "",
            PurchaseDetails: [],
            TotalCost: 0,
            SAPCostCentre: "",
            AccountCode: "",
            RequestedBy: "",
            BudgetMonth: "",
            BudgetBalance: "",
            
            PurchaseOrder: "",
        
            Errors: [],
            isLoading: false,
            selectedUsers: []
        };

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
                    />


                <div className="footer">
                    <button onClick={this.props.onClose}>
                    Close
                    </button>
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
            return await this.actionHandler.searchPeople(filterText);
            //return this._searchPeople(filterText, this._peopleList);
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
        return null;
    };
    private async onSaveClick(): Promise<void> {
        // if (this.validateFormData() === false) {
        //     return;
        // }
        // this.setLoading(true);
        // const formData: IMyTasks = {
        //     Id: '',
        //     Subject: this.state.Subject,
        //     StartDateTime: { DateTime: moment(this.state.StartDate, 'DD-MM-YYYY HH:mm').utc(true).format('YYYY-MM-DDTHH:mm'), TimeZone: "UTC" },
        //     DueDateTime: { DateTime: moment(this.state.DueDate, 'DD-MM-YYYY HH:mm').utc(true).format('YYYY-MM-DDTHH:mm'), TimeZone: "UTC" },
        //     Body: { ContentType: "TEXT", Content: this.state.Content }
        // };

        // const result: IItemResult = await this.props.actionHandler.saveMyTasks(formData);
        // if (result.status === false) {
        //     this.setState({ Errors: [result.message] });
        // }

        this.setLoading(false);
    }
}