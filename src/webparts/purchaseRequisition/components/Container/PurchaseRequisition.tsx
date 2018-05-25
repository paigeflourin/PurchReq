import * as React from 'react';
import styles from './PurchaseRequisition.module.scss';
import { IPurchaseRequisitionProps,IPurchaseRequisitionState  } from './IPurchaseRequisitionProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { PurchaseRequisitionListView } from '../ListView/PurchaseRequisitionListView';
import { PurchaseRequisitionForm } from '../Form/PurchaseRequisitionForm';
import { PurchaseRequisitionActionhandler } from './PurchaseRequisitionActionHandler';



export class PurchaseRequisition extends React.Component<IPurchaseRequisitionProps, IPurchaseRequisitionState> {

  private actionHandler: PurchaseRequisitionActionhandler;
  public token = null;

  constructor(props: IPurchaseRequisitionProps, state: IPurchaseRequisitionState){
  super(props);
  this.state = { 
    productRequests: [],
    view: "display",
    error: "",
    isDataLoaded: false
  }
  this.changeView = this.changeView.bind(this);
  this.actionHandler = new PurchaseRequisitionActionhandler(this, this.props.service);

  }

  public componentWillReceiveProps(newProps): void {
    console.log("INSIDE WILL RECEIVE PROPS");
    this.loadData(newProps);

  }


//render the list view here as well as the add button to have form in a dialog
  public render(): React.ReactElement<IPurchaseRequisitionProps> {
    return (
      <div className={ styles.purchaseRequisition }>
        <div className={ styles.container }>
            <h1>Purchase Requisition List</h1>
            
            <PurchaseRequisitionListView productRequests={this.state.productRequests} numberOfItems={this.props.numberOfItems} changeView={this.changeView} actionHandler={this.actionHandler} />

        </div>
      </div>
    );
  }

  private async loadData(props): Promise<void> {
    console.log("INSIDE LOAD DATA!!");
    this.setState({
      productRequests: await props.service.getAllItems(),
        isDataLoaded: true,
    });
    
}

  private changeView(view: string): void {
    this.setState({ view });
  } 



}
