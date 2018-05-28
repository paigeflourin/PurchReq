import { PurchaseRequisition } from "./PurchaseRequisition";
import { IPurchaseRequisitionService } from '../../services/IPurchaseRequisitionService';
import  IPurchaseRequisition  from '../../models/IPurchaseRequisition';
import { Environment, EnvironmentType } from '@microsoft/sp-core-library';
import { ViewType } from '../../helper/enum/ViewType';

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
}