import * as React from 'react';
import * as ReactDom from 'react-dom';
import { IPurchaseRequisitionListViewProps } from './IPurchaseRequisitionListViewProps';
import styles from './PurchaseRequisitionListView.module.scss';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/css/react-bootstrap-table.css'

export class PurchaseRequisitionListView extends React.Component<IPurchaseRequisitionListViewProps,any> {

    public constructor(props: IPurchaseRequisitionListViewProps, state: any) {
        super(props);
        this.state = {
            items: props.productRequests,
            value: 0,
            Errors: [],
            Messages: [],
            isLoading: false,
        };
        this.onDeleteClick = this.onDeleteClick.bind(this);
        this.onEditClick = this.onEditClick.bind(this);
    }

    public render() {
        //console.log(this.props.productRequests);
        const spinner = (
            <div className='loading'>Processing...</div>
        );
        const options = {
            expandRowBgColor: 'rgb(242, 255, 163)',
            expandAll: true
          };
        return (
            
            <div>
                {this.state.isLoading ? spinner : ''}
              <h1>This is the List View</h1>
              {this.state.Errors.length > 0 ?
                    <div className={styles.errorMess} >

                        <br />
                    </div>
                    : ''
                }
                <div className={styles.content}>
                    <BootstrapTable data={ this.props.productRequests }
                        options={ options }
                        expandableRow={ this.isExpandableRow }
                        expandComponent={ this.expandComponent }
                        expandColumnOptions={ { expandColumnVisible: true } }
                        search>
                        <TableHeaderColumn dataField='Department' isKey={ true }>Department</TableHeaderColumn>
                        <TableHeaderColumn dataField='Title' isKey={ true }>PR Number</TableHeaderColumn>
                        <TableHeaderColumn dataField='To'>Vendor</TableHeaderColumn>
                        <TableHeaderColumn dataField='PurchaseDet'>Purchase Details</TableHeaderColumn>
                        <TableHeaderColumn dataField='Total_x0020_Cost'>Total Cost</TableHeaderColumn>
                        <TableHeaderColumn dataField='SAP_x0020_Cost_x0020_Centre'>SAP Cost Centre</TableHeaderColumn>
                        <TableHeaderColumn dataField='Account_x0020_Code'>Account Code</TableHeaderColumn>
                        <TableHeaderColumn dataField='Requested_x0020_By'>Requested By</TableHeaderColumn>
                        <TableHeaderColumn dataField='Budget_x0020__x0028_Month_x0029_'>Budget (Month) </TableHeaderColumn>
                        <TableHeaderColumn dataField='Budget_x0020__x0028_Balance_x002'>Budget (Balance) </TableHeaderColumn>
                        <TableHeaderColumn dataField='Purchase_x0020_Request_x0020_Sta'>Purchase Request Status</TableHeaderColumn>
                        <TableHeaderColumn dataField='Purchase_x0020_Requisition_x0020'>Purchase Requisition Approval Workflow</TableHeaderColumn>
                        <TableHeaderColumn dataField='Purchase_x0020_Order'>Purchase Order</TableHeaderColumn>
                    </BootstrapTable>
                </div>
            </div >
        );
    }

    isExpandableRow(row) {
        return true;
    }

    expandComponent(row) {
        //console.log(row);
        return (
            <BSTable data={ row.PurchaseDet } />
        );
    }

    private onDeleteClick(index): void {
        this.setState({
            deleteIndex: index,
        });
    }

    private onEditClick(Id: string): void {
        //this.props.actionHandler.editPurchaseReq(Id);
    }
}


class BSTable extends React.Component<any,any> {
    render() {
      //console.log(this.props.data);  
      if (this.props.data) {
        return (
          <BootstrapTable data={ this.props.data }>
            <TableHeaderColumn dataField='ProjectCode' isKey={ true }>Project Code</TableHeaderColumn>
            <TableHeaderColumn dataField='BudgetCode'>Budget Code</TableHeaderColumn>
            <TableHeaderColumn dataField='Details'>Details</TableHeaderColumn>
            <TableHeaderColumn dataField='Quantity'>Quantity</TableHeaderColumn>
            <TableHeaderColumn dataField='Cost'>Cost</TableHeaderColumn>
            <TableHeaderColumn dataField='SubTotal'>Sub Total</TableHeaderColumn>
          </BootstrapTable>);
      } else {
        return (<p>?</p>);
      }
    }
  }