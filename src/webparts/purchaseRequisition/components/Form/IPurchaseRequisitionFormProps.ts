import { SPHttpClient } from '@microsoft/sp-http';
import { SharePointUserPersona } from '../../models/IPeoplePicker';
import IPurchaseDetails from '../../models/IPurchaseDetails';
import { PurchaseRequisitionActionhandler } from '../Container/PurchaseRequisitionActionHandler';

export interface IPurchaseRequisitionFormProps {
    show: boolean;
    onClose: () => void;
    onChange?: (items: SharePointUserPersona[]) => void;
    siteUrl?: string;
    typePicker?: string;
    principalTypeUser?: boolean;
    principalTypeSharePointGroup?: boolean;
    principalTypeSecurityGroup?: boolean;
    principalTypeDistributionList?: boolean;
    numberOfItems?: number;
    spHttpClient?: SPHttpClient;
    actionHandler: PurchaseRequisitionActionhandler;
}

export interface IPurchaseRequisitionFormState {
    Title: string;
    To: string;
    Department: string;
    PurchaseDetails: IPurchaseDetails[];
    TotalCost: string;
    SAPCostCentre: string;
    AccountCode: string;
    RequestedBy: string;
    BudgetMonth: string;
    BudgetBalance: string;
    
    PurchaseOrder: string;

    Errors: string[];
    isLoading: boolean;
    selectedUsers: string[];
    currentPicker?: number | string;
    delayResults?: boolean;
}