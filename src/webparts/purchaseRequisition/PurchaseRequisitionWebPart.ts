import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'PurchaseRequisitionWebPartStrings';
import { PurchaseRequisition } from './components/Container/PurchaseRequisition';
import { IPurchaseRequisitionProps } from './components/Container/IPurchaseRequisitionProps';
import { IPurchaseRequisitionService } from './services/IPurchaseRequisitionService';
import  { PurchaseRequsitionService }  from './services/PurchaseRequisitionService';
import  { MockPurchaseRequisitionService }  from './services/MockPurchaseRequisitionService';
import { Environment, EnvironmentType } from '@microsoft/sp-core-library';

export interface IPurchaseRequisitionWebPartProps {
    numberOfItems: number;
}

export default class PurchaseRequisitionWebPart extends BaseClientSideWebPart<IPurchaseRequisitionWebPartProps> {
  
  private service: IPurchaseRequisitionService;
  private mockservice: MockPurchaseRequisitionService;
  private readonly purchaseRequests = [
      {  text: "Add", view: "Add" },
      {  text: "Edit", view: "Edit" }
  ];

  protected onInit(): Promise<void> {
    if (Environment.type === EnvironmentType.Local  ) {
      this.service = new MockPurchaseRequisitionService(null); 
    } else if (Environment.type == EnvironmentType.SharePoint || Environment.type == EnvironmentType.ClassicSharePoint) {
      this.service = new PurchaseRequsitionService(this.context);
    } 
    
    return super.onInit();
}

  public render(): void {
    const element: React.ReactElement<IPurchaseRequisitionProps > = React.createElement(
      PurchaseRequisition,
      {
        numberOfItems: this.properties.numberOfItems,
        service: this.service
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
