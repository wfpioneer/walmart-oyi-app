import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import {
  CollapsibleCard, SettingsScreen, featureCard, printerCard
} from './Settings';
import { mockPrinterList } from '../../mockData/mockPrinterList';

describe('SettingsScreen', () => {
  describe('Tests rendering the SettingsScreen component', () => {
    it('Test renders the default SettingsScreen ', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <SettingsScreen
          printerOpen={true}
          togglePrinterList={jest.fn()}
          featuresOpen={true}
          toggleFeaturesList={jest.fn()}
          priceLabelPrinter={null}
          locationLabelPrinter={null}
          palletLabelPrinter={null}
          userFeatures={[]}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Test renders the SettingsScreen with Selected Printers', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <SettingsScreen
          printerOpen={true}
          togglePrinterList={jest.fn()}
          featuresOpen={true}
          toggleFeaturesList={jest.fn()}
          priceLabelPrinter={mockPrinterList[0]}
          locationLabelPrinter={mockPrinterList[1]}
          palletLabelPrinter={mockPrinterList[2]}
          userFeatures={[]}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Test renders the SettingsScreen with the Printer List collapsed', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <SettingsScreen
          printerOpen={false}
          togglePrinterList={jest.fn()}
          featuresOpen={true}
          toggleFeaturesList={jest.fn()}
          priceLabelPrinter={null}
          locationLabelPrinter={null}
          palletLabelPrinter={null}
          userFeatures={[]}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('Test renders the SettingsScreen with the Feature List collapsed', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(
        <SettingsScreen
          printerOpen={true}
          togglePrinterList={jest.fn()}
          featuresOpen={false}
          toggleFeaturesList={jest.fn()}
          priceLabelPrinter={null}
          locationLabelPrinter={null}
          palletLabelPrinter={null}
          userFeatures={[]}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Tests rendering featureCard component', () => {
    const renderer = ShallowRenderer.createRenderer();
    it('featureCard function renders "Enabled" translation if isEnabled is set to True', () => {
      renderer.render(
        featureCard('manager approval', true)
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('featureCard function renders "Disabled" translation if isEnabled is set to False', () => {
      renderer.render(
        featureCard('manager approval', false)
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
  describe('Tests rendering printerCard component', () => {
    const renderer = ShallowRenderer.createRenderer();

    it('printerCard functions renders Printer Name if Printer is not null', () => {
      renderer.render(printerCard('Price Sign Printer', mockPrinterList[0], jest.fn()));
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('printerCard functions renders "Not Assigned" translation if Printer is null', () => {
      renderer.render(printerCard('Price Sign Printer', null, jest.fn()));
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Tests rendering CollapsibleCard component', () => {
    const renderer = ShallowRenderer.createRenderer();

    it('CollapsibleCard functions renders down-arrow  if isOpened is false', () => {
      renderer.render(
        <CollapsibleCard
          title=""
          isOpened={false}
          toggleIsOpened={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
    it('CollapsibleCard functions renders up-arrow  if isOpened is true', () => {
      renderer.render(
        <CollapsibleCard
          title=""
          isOpened={true}
          toggleIsOpened={jest.fn()}
        />
      );
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });
});
