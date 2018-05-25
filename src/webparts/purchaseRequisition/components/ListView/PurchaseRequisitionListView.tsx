import * as React from 'react';
import { IPurchaseRequisitionListViewProps } from './IPurchaseRequisitionListViewProps';
import styles from './PurchaseRequisitionListView.module.scss';

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
        console.log(this.props.productRequests);
        const spinner = (
            <div className='loading'>Processing...</div>
        );
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
                    Content is here
                </div>
            </div >
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