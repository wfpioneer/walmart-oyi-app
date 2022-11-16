// import React from 'react';
// import ShallowRenderer from 'react-test-renderer/shallow';
// import { NavigationProp, RouteProp } from '@react-navigation/native';
// import {
//     HomeNavigatorComponent
// } from './HomeNavigator';
// import { Printer, PrinterType } from '../models/Printer';

// let navigationProp: NavigationProp<any>;
// describe('Binning Navigator', () => {
//   it('Renders the Binning navigator component', () => {
//     const renderer = ShallowRenderer.createRenderer();
//     renderer.render(
//       <HomeNavigatorComponent
//         logoutUser={jest.fn()}
//         showActivityModal={false}
//         hideActivityModal={true}
//         navigation={navigationProp}
//         isManualScanEnabled={true}
//         setManualScan={jest.fn()}
//         clubNbr={1234}
//         updatePrinterByID={jest.fn()}
//         priceLabelPrinter={{} as Printer}
//         setPriceLabelPrinter={jest.fn()}
//       />
//     );
//     expect(renderer.getRenderOutput()).toMatchSnapshot();
//   });
// });
