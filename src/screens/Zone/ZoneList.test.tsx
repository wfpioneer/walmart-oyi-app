import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import {ZoneScreen} from './ZoneList';
import {Zones} from "../../mockData/zoneDetails";

describe("Zone List", () => {
    it('Renders Zone Screen', () => {
        const renderer = ShallowRenderer.createRenderer();
        renderer.render(<ZoneScreen zoneList={Zones} siteId={5522}/>)
        expect(renderer.getRenderOutput()).toMatchSnapshot();
      });


})

