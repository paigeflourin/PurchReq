import { PurchaseRequisitionActionhandler } from "../Container/PurchaseRequisitionActionHandler";


export interface IPurchaseRequisitionListViewProps {
    productRequests: any[];
    numberOfItems: number;
    changeView: Function;
    actionHandler: PurchaseRequisitionActionhandler;
}