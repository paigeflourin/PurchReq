import IWebPartContext from '@microsoft/sp-webpart-base/lib/core/IWebPartContext';
import  IPurchaseRequisition  from '../models/IPurchaseRequisition';
import IItemResult from "../models/IItemResult";

export class MockPurchaseRequisitionService   {
    public webPartContext: IWebPartContext;
    constructor(webPartContext: IWebPartContext) {
        this.webPartContext = webPartContext;
    }

    private mockData = [

        {
            ID: 1,
            Title: '1',
            To: "Nexus",
            PurchaseDet: [
                {
                    ProjectCode: '123asd',
                    BudgetCode: '123asd',
                    Details: '123asd',
                    Quantity: 1,
                    Cost: 1000,
                    SubTotal: 1000     
                },
                {
                    ProjectCode: '123a45',
                    BudgetCode: 'gfdgdf56',
                    Details: 'fghgh',
                    Quantity: 13,
                    Cost: 2333,
                    SubTotal: 23233     
                },
            ],
            Total_x0020_Cost: 1000,
            SAP_x0020_Cost_x0020_Centre:'TestSAP',
            Account_x0020_Code:'TestAccound',
            Requested_x0020_By: 'Page Flourin Tangalin',
            Budget_x0020__x0028_Month_x0029_: 35000,
            Budget_x0020__x0028_Balance_x002: 30000,
            Purchase_x0020_Request_x0020_Sta: 'Pending',
            Purchase_x0020_Requisition_x0020:  'Awaiting Approval from Finance',
            Purchase_x0020_Order: '12334sdsd'
        },
        {
            ID: 2,
            Title: '2',
            To: "Northgate",
            PurchaseDet: [
                {
                    ProjectCode: '123asd',
                    BudgetCode: '123asd',
                    Details: '123asd',
                    Quantity: 1,
                    Cost: 1000,
                    SubTotal: 1000     
                },
                {
                    ProjectCode: '123a45',
                    BudgetCode: 'gfdgdf56',
                    Details: 'fghgh',
                    Quantity: 13,
                    Cost: 2333,
                    SubTotal: 23233     
                },
            ],
            Total_x0020_Cost: 1000,
            SAP_x0020_Cost_x0020_Centre:'TestSAP',
            Account_x0020_Code:'TestAccound',
            Requested_x0020_By: 'Page Flourin Tangalin',
            Budget_x0020__x0028_Month_x0029_: 35000,
            Budget_x0020__x0028_Balance_x002: 30000,
            Purchase_x0020_Request_x0020_Sta: 'Pending',
            Purchase_x0020_Requisition_x0020: 'Awaiting Approval from Finance',
            Purchase_x0020_Order: '12334sdsd'
        },
    ];


    public getAllItems(): Promise<any[]> {
        console.log("IN MOCK SERVICE");
        return new Promise<any[]>((resolve) => {
            setTimeout(() => resolve(this.mockData), 300);
        });
    }

    addNewRequest: (formData: IPurchaseRequisition) => Promise<IItemResult>
    updateRequest(formData: IPurchaseRequisition): Promise<IItemResult> {
        throw new Error("Method not implemented.");
    }
    deleteRequest(Id: string): Promise<IItemResult> {
        throw new Error("Method not implemented.");
    }
    changeStatus(Id: string, newStatus: string): Promise<IItemResult> {
        throw new Error("Method not implemented.");
    
    }


}