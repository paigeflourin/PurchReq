import IPurchaseRequisition from "../models/IPurchaseRequisition";
import IItemResult from "../models/IItemResult";


export interface IPurchaseRequisitionService {
    getAllItems: () => Promise<any>;
    addNewRequest: (formData: IPurchaseRequisition) => Promise<IItemResult>;
    updateRequest(formData: IPurchaseRequisition): Promise<IItemResult>;
    deleteRequest(Id: string): Promise<IItemResult>;
    // updateWebpartProps(propertyPath:string, newValue:any):void;
    changeStatus(Id:string,newStatus:string):Promise<IItemResult>;
}
