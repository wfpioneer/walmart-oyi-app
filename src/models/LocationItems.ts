export interface ZoneItem {
    zoneId: number,
    zoneName: string,
    aisleCount: number
}

export interface AisleItem {
    aisleId: number,
    aisleName: string,
    sectionCount: number
}

export interface SectionItem {
    sectionId: number,
    sectionName: string,
}

export interface LocationItem {
        zone: {
          id: number,
          name: string
        },
        aisle: {
          id: number,
          name: string
        },
         section: {
          id: number,
          name: string
        }
        floor: [
          {
            itemNbr: number,
            itemDesc: string,
            price: number
          }
        ],
        reserve: [
          {
            palletId: number,
            palletCreateTS: string,
            items: [
              {
                itemNbr: number,
                itemDesc: string,
                price: number
              }
            ]
          }
        ]
      }
