interface IPurchaseDetails {
    PurchaseDetails: {
        ProjectCode: string,
        BudgetCode: string,
        Details: string,
        Quantity: number,
        Cost: number,
        SubTotal: number
    }
}

export default IPurchaseDetails;