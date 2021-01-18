import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { PrintQueueScreen, handlePrint } from './PrintQueueScreen';
import { LaserPaper } from '../../models/Printer';

describe('PrintQueueScreen', () => {
  it('renders the default snapshot', () => {
    // @ts-ignore
    const renderer = new ShallowRenderer();
    renderer.render(<PrintQueueScreen
      printQueue={[]}
      selectedPrinter={{}}
      printAPI={jest.fn()}
      dispatch={jest.fn()}
      navigation={jest.fn()}
      route={jest.fn()}
      itemIndexToEdit={0}
      setItemIndexToEdit={jest.fn()}
      apiInProgress={false}
      setAPIInProgress={jest.fn()}
      error={false}
      setError={jest.fn()}
      apiStart={undefined}
      setApiStart={jest.fn()}
      trackEventCall={jest.fn()}
      validateSession={jest.fn(() => Promise.resolve())}
    />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('renders the print queue with 1 item in it', () => {
    // @ts-ignore
    const renderer = new ShallowRenderer();
    renderer.render(<PrintQueueScreen
      printQueue={[{
        itemName: 'Test item',
        itemNbr: 123456,
        upcNbr: '123456',
        catgNbr: 2,
        signQty: 1,
        paperSize: LaserPaper.Small,
        worklistType: 'blah'
      }]}
      selectedPrinter={{}}
      printAPI={jest.fn()}
      dispatch={jest.fn()}
      navigation={jest.fn()}
      route={jest.fn()}
      itemIndexToEdit={0}
      setItemIndexToEdit={jest.fn()}
      apiInProgress={false}
      setAPIInProgress={jest.fn()}
      error={false}
      setError={jest.fn()}
      apiStart={undefined}
      setApiStart={jest.fn()}
      trackEventCall={jest.fn()}
      validateSession={jest.fn(() => Promise.resolve())}
    />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('calls handlePrint', async () => {
    const trackEventCall = jest.fn();

    await handlePrint({
      validateSession: jest.fn(() => Promise.resolve()),
      dispatch: jest.fn(),
      navigation: jest.fn(),
      printQueue: [],
      route: { name: 'TEST' },
      selectedPrinter: null,
      setApiStart: jest.fn(),
      trackEventCall
    });

    expect(trackEventCall).toHaveBeenCalled();
  });
});
