import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import ItemDetailsList, { ItemDetailsListRow } from './ItemDetailsList';

const mockItemDetailsListRowsAdditionalNote: ItemDetailsListRow[] = [
  { label: 'label1', value: 10, additionalNote: 'Test Note' },
  { label: 'label2', value: 20 },
  { label: 'label3', value: 30 }
];

const mockItemDetailsListRowsNoNote = mockItemDetailsListRowsAdditionalNote.slice(1);

describe('ItemDetailsList Component', () => {
  it('should display an additional note below rows with that property defined', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(<ItemDetailsList rows={mockItemDetailsListRowsAdditionalNote} />);
  });

  it('should render rows with matching style when additionalNote and indentAfterFirstRow are not defined', () => {
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(<ItemDetailsList rows={mockItemDetailsListRowsNoNote} />);
  });

  describe('indenting behavior', () => {
    it('should indent all rows after the first if indentAfterFirstRow is true', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(<ItemDetailsList rows={mockItemDetailsListRowsNoNote} indentAfterFirstRow={true} />);
    });

    it('should indent all rows after the first if indentAfterFirstRow is true regardless of additionalNotes', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(<ItemDetailsList rows={mockItemDetailsListRowsAdditionalNote} indentAfterFirstRow={true} />);
    });

    it('should only indent labels and not additionalNotes', () => {
      const renderer = ShallowRenderer.createRenderer();
      const mockItemDetailsRowsWithNotes = mockItemDetailsListRowsNoNote
        .map(row => ({ ...row, additionalNote: 'An Additional Note' }));
      renderer.render(<ItemDetailsList rows={mockItemDetailsRowsWithNotes} indentAfterFirstRow={true} />);
    });

    it('should not indent anything if indentAfterFirstRow is not specified', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(<ItemDetailsList rows={mockItemDetailsListRowsNoNote} />);
    });

    it('should not indent anything if indentAfterFirstRow is false', () => {
      const renderer = ShallowRenderer.createRenderer();
      renderer.render(<ItemDetailsList rows={mockItemDetailsListRowsNoNote} indentAfterFirstRow={false} />);
    });
  });
});
