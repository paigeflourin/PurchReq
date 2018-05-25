import { IPurchaseRequisitionService } from "../../../../../lib/webparts/purchaseRequisition/services/IPurchaseRequisitionService";

export interface IPurchaseRequisitionProps {
  numberOfItems: number;
  service: IPurchaseRequisitionService;
}

export interface IPurchaseRequisitionState {
  productRequests: any[];
  isDataLoaded: boolean;
  view: string;
  error: string;
}
