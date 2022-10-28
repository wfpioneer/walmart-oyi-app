export interface Pallet {
    palletId: number;
    quantity: number;
    sectionId: number;
    locationName: string;
    mixedPallet: boolean;
}

export interface GetItemPalletsResponse {
    itemNbr: number;
    upcNbr: string;
    category: number;
    pallets: Pallet[];
}
