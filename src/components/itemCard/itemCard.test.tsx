import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import {Zones} from '../../mockData/zoneDetails';
import ItemCard from '../../components/itemCard/itemCard';
import {ZoneItem} from '../../models/ZoneItem'


describe("Test Item Card", () => {
    it('Renders Item Card', () => {
        const renderer = ShallowRenderer.createRenderer();
        Zones.forEach((item) => renderer.render(
        <ItemCard zoneName={item.zoneName} 
                  aisleCount={item.aisleCount}
        />))
        expect(renderer.getRenderOutput()).toMatchSnapshot();
      });
})

describe("Test Item Card with empty list", () => {
    const emptyZoneList: ZoneItem[] = [];
    it('Should not render any card', () => {
        const renderer = ShallowRenderer.createRenderer();
        emptyZoneList.forEach((item) => renderer.render(
        <ItemCard zoneName={item.zoneName} 
                  aisleCount={item.aisleCount}
        />))
        expect(renderer.getRenderOutput()).toMatchSnapshot();
      });
})

