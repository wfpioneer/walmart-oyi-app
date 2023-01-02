import React from 'react';
import {
  ActivityIndicator, Platform, Text, TouchableOpacity, View
} from 'react-native';
import styles from './ItemCard.style';
import COLOR from '../../themes/Color';
import { strings } from '../../locales';
import ImageWrapper from '../ImageWrapper/ImageWrapper';

interface OHItemInfoI {
  claimsOH: number,
  consolidatorOH: number,
  flyCloudInTransitOH: number,
  flyCloudOH: number,
  salesFloorOH: number
}

interface ItemCardProps {
  itemNumber: number,
  onHandQty: number | undefined,
  description: string,
  onClick: (itemNumber: number) => void;
  loading: boolean;
  countryCode: string;
  showItemImage: boolean;
  showOHItems?: boolean;
  OHItemInfo?: OHItemInfoI;
}

interface OtherOnHandsItemsProps {
  countryCode: string;
  OHItemInfo?: OHItemInfoI
}

const defaultOHItemValues = {
  claimsOH: 0,
  consolidatorOH: 0,
  flyCloudInTransitOH: 0,
  flyCloudOH: 0,
  salesFloorOH: 0
};

const getContainerStyle = (isLoading: boolean, showItemImage: boolean) => {
  if (isLoading) {
    return showItemImage ? styles.loaderContainer : { ...styles.loaderContainer, height: 60 };
  }
  return showItemImage ? styles.container : { ...styles.container, paddingLeft: 10 };
};

const OtherOnHandsItems = (props: OtherOnHandsItemsProps) => {
  const { countryCode, OHItemInfo } = props;
  const ClaimsText = () => (
    <Text style={styles.content}>
      {`${strings(
        'ITEM.CLAIMS_QTY'
      )}  ${OHItemInfo?.claimsOH}`}
    </Text>
  );

  const ConsolidatedText = () => (
    <View>
      <Text style={styles.content}>
        {`${strings(
          'ITEM.CONSOLIDATED_QTY'
        )}  ${OHItemInfo?.consolidatorOH}`}
      </Text>
    </View>
  );

  const FlyCloudText = () => (
    <View>
      <Text style={styles.content}>
        {`${strings(
          'ITEM.FLY_CLOUD_QTY'
        )}  ${OHItemInfo?.flyCloudOH}`}
      </Text>
    </View>
  );

  const InTransitOHText = () => (
    <View>
      <Text style={styles.content}>
        {`${strings(
          'ITEM.IN_TRANSIT_FLY_QTY'
        )}  ${OHItemInfo?.flyCloudInTransitOH}`}
      </Text>
    </View>
  );
  const SalesFloorText = () => (
    <View>
      <Text style={styles.content}>
        {`${strings(
          'ITEM.SALES_FLOOR_QTY'
        )}  ${OHItemInfo?.salesFloorOH}`}
      </Text>
    </View>
  );
  return (
    <View style={styles.otherOHDetails}>
      <View>
        {countryCode === 'MX' && (
        <>
          <View style={styles.contentList}>
            <ClaimsText />
            <SalesFloorText />
          </View>
          <View style={styles.contentList}>
            <ConsolidatedText />
          </View>
        </>
        )}
        {countryCode === 'CN' && (
        <>
          <View style={styles.contentList}>
            <ClaimsText />
            <SalesFloorText />
          </View>
          <View style={styles.contentList}>
            <FlyCloudText />
            <InTransitOHText />
          </View>
        </>
        )}
      </View>
    </View>
  );
};

const ItemCard = ({
  itemNumber, description, onClick, loading, onHandQty,
  countryCode, showItemImage, showOHItems, OHItemInfo
}: ItemCardProps) => (
  <View style={styles.mainContainer}>
    <TouchableOpacity
      style={getContainerStyle(loading, showItemImage)}
      onPress={() => {
        if (!loading) {
          onClick(itemNumber);
        }
      }}
      testID="itemCard"
    >
      {showItemImage && !loading && (
      <ImageWrapper
        countryCode={countryCode}
        itemNumber={itemNumber}
      />
      )}
      {loading && (
      <View style={styles.loader} testID="loader">
        <ActivityIndicator size={30} color={Platform.OS === 'android' ? COLOR.MAIN_THEME_COLOR : undefined} />
      </View>
      )}
      {!loading && (
      <View style={styles.itemDetails} testID="item-details">
        <View style={!showItemImage ? styles.itemNbrView : {}}>
          <Text style={styles.itemNbr}>{`${strings('GENERICS.ITEM')} ${itemNumber}`}</Text>
        </View>
        <View>
          <Text style={styles.itemDesc}>{description}</Text>
        </View>
        {onHandQty !== undefined && (
          <View>
            <Text style={styles.itemNbr}>{`${strings('ITEM.ON_HANDS')} ${onHandQty.toString()}`}</Text>
          </View>
        )}
      </View>
      )}
    </TouchableOpacity>
    {showOHItems && <OtherOnHandsItems countryCode={countryCode} OHItemInfo={OHItemInfo} />}
  </View>
);

ItemCard.defaultProps = {
  showOHItems: false,
  OHItemInfo: defaultOHItemValues
};

OtherOnHandsItems.defaultProps = {
  OHItemInfo: defaultOHItemValues
};

export default ItemCard;
