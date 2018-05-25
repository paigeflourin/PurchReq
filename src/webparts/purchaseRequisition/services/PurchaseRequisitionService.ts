import { IWebPartContext } from '@microsoft/sp-webpart-base';
import { SPHttpClient, HttpClient, HttpClientResponse } from '@microsoft/sp-http';
import { IPurchaseRequisitionService } from './IPurchaseRequisitionService';
import  IPurchaseRequisition  from '../models/IPurchaseRequisition';
import IItemResult from "../models/IItemResult";


export class PurchaseRequsitionService implements IPurchaseRequisitionService {
    public webPartContext: IWebPartContext;

    constructor(webPartContext: IWebPartContext) {
        this.webPartContext = webPartContext;
    }
    private readonly mockData = [
        {
            Items: [
                {
                    PRNumber: '1',
                    To: "Nexus",
                    PurchaseDetails: [
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
                    TotalCost: 1000,
                    SAPCostCenter:'TestSAP',
                    AccountCode:'TestAccound',
                    RequestBy: 'Page Flourin Tangalin',
                    BudgetMont: 35000,
                    BudgetBalance: 30000,
                    PurchaseReqStatus: 'Pending',
                    PurchRequestWorkflow: 'Approved By Finance',
                    PurchaseOrder: '12334sdsd'
                },
                {
                    PRNumber: '2',
                    To: "Northgate",
                    PurchaseDetails: {
                        ProjectCode: '123asd',
                        BudgetCode: '123asd',
                        Details: '123asd',
                        Quantity: 1,
                        Cost: 1000,
                        SubTotal: 1000     
                    },
                    TotalCost: 1000,
                    SAPCostCenter:'TestSAP',
                    AccountCode:'TestAccound',
                    RequestBy: 'Page Flourin Tangalin',
                    BudgetMont: 35000,
                    BudgetBalance: 30000,
                    PurchaseReqStatus: 'Pending',
                    PurchRequestWorkflow: 'Approved By Finance',
                    PurchaseOrder: '12334sdsd'
                },
            ]
        }
        
    ];

    public getAllItems(): Promise<any> {
        //get all list items
        //mock
        return new Promise<any[]>((resolve) => {
            console.log(this.mockData);
            setTimeout(() => resolve(this.mockData), 300);
        });
        
    };
    addNewRequest: (formData: IPurchaseRequisition) => Promise<IItemResult>;
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