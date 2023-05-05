export interface Pallet {
    palletId: number;
    quantity: number;
    sectionId: number;
    locationName: string;
    mixedPallet: boolean;
    upcNbr: string;
}

export interface GetItemPalletsResponse {
    itemNbr: number;
    upcNbr: string;
    category: number;
    pallets: Pallet[];
}
