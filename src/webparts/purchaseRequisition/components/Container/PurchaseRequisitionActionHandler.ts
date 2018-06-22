import { PurchaseRequisition } from "./PurchaseRequisition";
import { IPurchaseRequisitionService } from '../../services/IPurchaseRequisitionService';
import  IPurchaseRequisition  from '../../models/IPurchaseRequisition';
import { Environment, EnvironmentType } from '@microsoft/sp-core-library';
import { ViewType } from '../../helper/enum/ViewType';
import IItemResult from "../../../../../lib/webparts/purchaseRequisition/models/IItemResult";

export class PurchaseRequisitionActionhandler {
   
    constructor(private container: PurchaseRequisition, private service: IPurchaseRequisitionService ){
        this.changeView = this.changeView.bind(this);
    }

    public changeView(view: ViewType): void {
        this.container.setState({ view });
    }

    public async getAllItems(): Promise<any[]> {
        return await this.service.getAllItems();
    }

    public async createPurchaseRequisition(formData: IPurchaseRequisition): Promise<IItemResult> {
        const newData: IPurchaseRequisition = formData;

        const result: IItemResult   = await this.service.addNewRequest(newData);
        return result;
    }
}