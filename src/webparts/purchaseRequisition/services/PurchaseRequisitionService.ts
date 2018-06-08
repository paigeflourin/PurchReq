import { IWebPartContext } from '@microsoft/sp-webpart-base';
import { SPHttpClient, HttpClient, HttpClientResponse } from '@microsoft/sp-http';
import { IPurchaseRequisitionService } from './IPurchaseRequisitionService';
import  IPurchaseRequisition  from '../models/IPurchaseRequisition';
import IItemResult from "../models/IItemResult";
import * as pnp from "sp-pnp-js"; 

export class PurchaseRequsitionService implements IPurchaseRequisitionService {
    public webPartContext: IWebPartContext;

    constructor(webPartContext: IWebPartContext) {
        this.webPartContext = webPartContext;
    }

    public getAllItems(): Promise<any> {
        //get all list items
        var res;
        pnp.sp.web.lists.getByTitle("Purchase%20Requisition").items.get().then((result) => {
            console.log(result);
            res= result;
        });
        return res;
    };
    public addNewRequest(formData: IPurchaseRequisition): Promise<IItemResult> {
        return null;
    }


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
