import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import ItemDetailsList, {ItemDetailsListRow} from "./ItemDetailsList";

const mockItemDetailsListRowsAdditionalNote: ItemDetailsListRow[] = [
    {label: 'label1', value: 10, additionalNote: 'Test Note'},
    {label: 'label2', value: 20 },
    {label: 'label3', value: 30 }
];

const mockItemDetailsListRowsNoNote = mockItemDetailsListRowsAdditionalNote.slice(1);

describe('ItemDetailsList Component', () => {
    it('should display an additional note below rows with that property defined', () => {
        const renderer = ShallowRenderer.createRenderer();
        renderer.render(<ItemDetailsList  rows={mockItemDetailsListRowsAdditionalNote}/>);
    });

    it('should render rows with matching style when additionalNote and indentAfterFirstRow are not defined', () => {
        const renderer = ShallowRenderer.createRenderer();
        renderer.render(<ItemDetailsList  rows={mockItemDetailsListRowsNoNote}/>);
    });

    it('should indent all rows after the first if indentAfterFirstRow is true', () => {
        const renderer = ShallowRenderer.createRenderer();
        renderer.render(<ItemDetailsList  rows={mockItemDetailsListRowsNoNote} indentAfterFirstRow={true}/>);
    })
});