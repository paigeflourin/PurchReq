import { SPHttpClient } from '@microsoft/sp-http';
import { SharePointUserPersona } from '../../models/IPeoplePicker';


export interface IPurchaseRequisitionFormProps {
    show: boolean;
    onClose: () => void;
    onChange?: (items: SharePointUserPersona[]) => void;
}

export interface IPurchaseRequisitionFormState {
    Title: string;
    To: string;
    PurchaseDetails: any[];
    TotalCost: number;
    SAPCostCentre: string;
    AccountCode: string;
    RequestedBy: string;
    BudgetMonth: string;
    BudgetBalance: string;
    
    PurchaseOrder: string;

    Errors: string[];
    isLoading: boolean;
    selectedUsers: string[];
    
}