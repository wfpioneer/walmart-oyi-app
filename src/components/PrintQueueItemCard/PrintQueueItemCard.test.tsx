import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import PrintQueueItemCard from './PrintQueueItemCard';

const mockPrintQueueItem = {
  jobName: 'A1-1',
  nbrOfCopies: 1,
  size: 'small'
};

describe('Test Print Queue Item Card', () => {
  it('Renders Print Queue Item Card with mock print queue items', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(
      <PrintQueueItemCard
        jobName={mockPrintQueueItem.jobName}
        nbrOfCopies={mockPrintQueueItem.nbrOfCopies}
        size={mockPrintQueueItem.size}
        editCallback={jest.fn}
        deleteCallback={jest.fn}
      />
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
