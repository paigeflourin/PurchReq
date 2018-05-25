import { PurchaseRequisition } from "./PurchaseRequisition";
import { IPurchaseRequisitionService } from '../../services/IPurchaseRequisitionService';
import  IPurchaseRequisition  from '../../models/IPurchaseRequisition';
import  { MockPurchaseRequisitionService }  from '../../services/MockPurchaseRequisitionService';
//import Environment, { EnvironmentType } from '@microsoft/sp-core-library/lib/Environment';

export class PurchaseRequisitionActionhandler {
    private mockService: MockPurchaseRequisitionService;

    constructor(private container: PurchaseRequisition, private service: IPurchaseRequisitionService){
        this.changeView = this.changeView.bind(this);
    }

    public changeView(view: string): void {
        this.container.setState({ view });
    }

    public async getAllItems(): Promise<any[]> {
        console.log("HERE IN HANDLER!!!!");
        //if (Environment.type === EnvironmentType.Local ) {
        //    return await this.service.getAllItems();
        //} else if (Environment.type == EnvironmentType.SharePoint || Environment.type == EnvironmentType.ClassicSharePoint) {
            return await this.service.getAllItems();
        //}
    }
}