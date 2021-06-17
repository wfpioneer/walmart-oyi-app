import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import {ZoneListScreen} from './ZoneList';
import {dataset_one} from "../../mockData/zoneDetails";

describe("Zone List", () => {
    it('Renders Zone Screen', () => {
        const renderer = ShallowRenderer.createRenderer();
        renderer.render(<ZoneListScreen dataSet={dataset_one} siteId={5522}/>)
        expect(renderer.getRenderOutput()).toMatchSnapshot();
      });


})

