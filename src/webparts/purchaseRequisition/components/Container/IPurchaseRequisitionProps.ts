import { IPurchaseRequisitionService } from "../../../../../lib/webparts/purchaseRequisition/services/IPurchaseRequisitionService";
import { ViewType } from '../../helper/enum/ViewType';


export interface IPurchaseRequisitionProps {
  numberOfItems: number;
  service: IPurchaseRequisitionService;
}

export interface IPurchaseRequisitionState {
  productRequests: any[];
  isDataLoaded: boolean;
  view: ViewType;
  error: string;
  isOpen: boolean;
}
