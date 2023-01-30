import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';
import SFTCard from './SFTCard';

jest.mock('react-native-vector-icons/FontAwesome5', () => 'Icon');

describe('SalesMetrics component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Renders the SFTCard with bottomRightBtnAction', () => {
    const mockBottomRightBtn0Action = jest.fn();
    const { toJSON, getByTestId } = render(
      <SFTCard
        title="SFT-Title"
        subTitle="SFT-SubTitle"
        bottomRightBtnTxt={['bottomRightBtnTxt']}
        bottomRightBtnAction={[mockBottomRightBtn0Action]}
      >
        <Text>Test</Text>
      </SFTCard>
    );
    const bottomRightBtn0 = getByTestId('bottomRightBtn-0');
    fireEvent.press(bottomRightBtn0);

    expect(mockBottomRightBtn0Action).toBeCalled();
    expect(toJSON()).toMatchSnapshot();
  });

  it('Renders the SFTCard with bottomRightBtnText only', () => {
    const { toJSON } = render(
      <SFTCard
        title="SFT-Title"
        subTitle="SFT-SubTitle"
        bottomRightBtnTxt={['bottomRightBtnTxt']}
      >
        <Text>Test</Text>
      </SFTCard>
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('Renders the SFTCard with topRightBtnAction and no subtitle', () => {
    const mockTopRightBtnAction = jest.fn();
    const { toJSON, getByTestId } = render(
      <SFTCard
        title="SFT-Title"
        topRightBtnTxt="topRightBtnTxt"
        topRightBtnAction={mockTopRightBtnAction}
      >
        <Text>Test</Text>
      </SFTCard>
    );
    const topRightBtn = getByTestId('topRightBtn');
    fireEvent.press(topRightBtn);

    expect(mockTopRightBtnAction).toBeCalled();
    expect(toJSON()).toMatchSnapshot();
  });

  it('Renders the SFTCard with topRightBtnAction, no subtitle and iconName', () => {
    const mockTopRightBtnAction = jest.fn();
    const { toJSON } = render(
      <SFTCard
        iconName="iconName"
        title="SFT-Title"
        topRightBtnTxt="topRightBtnTxt"
        topRightBtnAction={mockTopRightBtnAction}
      >
        <Text>Test</Text>
      </SFTCard>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('Renders the SFTCard with topRightBtnAction, no subtitle and iconProp', () => {
    const mockTopRightBtnAction = jest.fn();
    const { toJSON } = render(
      <SFTCard
        iconProp="iconProp"
        title="SFT-Title"
        topRightBtnTxt="topRightBtnTxt"
        topRightBtnAction={mockTopRightBtnAction}
      >
        <Text>Test</Text>
      </SFTCard>
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
