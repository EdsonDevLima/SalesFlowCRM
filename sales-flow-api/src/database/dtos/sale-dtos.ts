export interface ISaleDto {
    id?: number;
    userId: number;
    productIds: number[];
    total: number;
    trackingCode:string
    status:"pending" | "completed" | "cancelled" | "refunded"
}
