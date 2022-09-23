import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import LocationCard, { getContentStyle } from './LocationCard';
import styles from './LocationCard.style';

describe('LocationCard', () => {
  describe('Tests rendering LocationCard', () => {
    const renderer = ShallowRenderer.createRenderer();
    it('LocationCard with valid input', () => {
      renderer.render(<LocationCard
        location="A1-1"
        locationType="floor"
        onQtyIncrement={jest.fn}
        onEndEditing={jest.fn}
        onTextChange={jest.fn}
        onQtyDecrement={jest.fn}
        palletID="1234"
        scannerEnabled={false}
        scanned={false}
        quantity={12}
        onLocationDelete={jest.fn}
      />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('LocationCard with locationType as reserve', () => {
      renderer.render(<LocationCard
        location="A1-1"
        locationType="reserve"
        onQtyIncrement={jest.fn}
        onEndEditing={jest.fn}
        onTextChange={jest.fn}
        onQtyDecrement={jest.fn}
        palletID="1234"
        scannerEnabled={false}
        scanned={false}
        quantity={12}
        onLocationDelete={jest.fn}
      />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('renders the card with locationType reserve and scannerEnabled true', () => {
      renderer.render(<LocationCard
        location="A1-1"
        locationType="reserve"
        onQtyIncrement={jest.fn}
        onEndEditing={jest.fn}
        onTextChange={jest.fn}
        onQtyDecrement={jest.fn}
        palletID="1234"
        scannerEnabled={true}
        scanned={false}
        quantity={12}
        onLocationDelete={jest.fn}
      />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });

    it('renders the card with locationType reserve, scannerEnabled true and scanned true', () => {
      renderer.render(<LocationCard
        location="A1-1"
        locationType="reserve"
        onQtyIncrement={jest.fn}
        onEndEditing={jest.fn}
        onTextChange={jest.fn}
        onQtyDecrement={jest.fn}
        palletID="1234"
        scannerEnabled={true}
        scanned={true}
        quantity={12}
        onLocationDelete={jest.fn}
      />);
      expect(renderer.getRenderOutput()).toMatchSnapshot();
    });
  });

  describe('Tests getContentStyle function', () => {
    it('should return style location when location type floor and isLocation content true', () => {
      expect(getContentStyle('Floor', false, false, true)).toStrictEqual(styles.location);
    });
    it('should return style pallet when location type floor and isLocation content false', () => {
      expect(getContentStyle('Floor', false, false, false)).toStrictEqual(styles.pallet);
    });
    it('should return style mandatorylocation when location type reserve, isLocation content true', () => {
      expect(getContentStyle('reserve', true, false, true)).toStrictEqual(styles.mandatoryLocScan);
    });
    it('should return style mandatoryPallet when location type reserve, isLocation content false', () => {
      expect(getContentStyle('reserve', true, false, false)).toStrictEqual(styles.mandatoryPalletScan);
    });
    it('should return style locationscanned when location type reserve, isLocation content true', () => {
      expect(getContentStyle('reserve', true, true, true)).toStrictEqual(styles.locScanned);
    });
    it('should return style mandatoryPallet when location type reserve, isLocation content false', () => {
      expect(getContentStyle('reserve', true, true, false)).toStrictEqual(styles.palletScanned);
    });
  });
});
