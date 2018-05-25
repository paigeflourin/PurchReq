import * as React from 'react';
import { IPurchaseRequisitionFormProps } from './IPurchaseRequisitionFormProps';


export class PurchaseRequisitionForm extends React.Component<IPurchaseRequisitionFormProps,any> {


    public render() {
        const spinner = (
            <div className='loading'>Processing...</div>
        );
        return (
            <div>
               This is the List Form
            </div >
        );
    }
}