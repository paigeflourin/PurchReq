import IPurchaseDetails from './IPurchaseDetails';

interface IPurchaseRequisition {
    Id: String;
    To: String;
    PurchaseDet: IPurchaseDetails[]
    TotalCost: string;
    SAPCostCentre: string;
    AccountCode: string;
    RequestedBy: string;
    BudgetMonth: string;
    BudgetBalance: string;
    
    PurchaseOrder: string;
}

export default IPurchaseRequisition;