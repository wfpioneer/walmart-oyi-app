import React from 'react';
import {
  ActivityIndicator, Platform, Text, TouchableOpacity, View
} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import styles from './ItemCard.style';
import COLOR from '../../themes/Color';
import { strings } from '../../locales';
import ImageWrapper from '../ImageWrapper/ImageWrapper';
import { WorkListStatus } from '../../models/WorklistItem';

const INFO_ICON_SIZE = 12;

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
  loading: boolean;
  countryCode: string;
  showItemImage: boolean;
  onClick?: (itemNumber: number) => void;
  disabled?: boolean;
  showOHItems?: boolean;
  OHItemInfo?: OHItemInfoI;
  pendingQty?: number | undefined;
  status?: WorkListStatus;
  totalQty: number | undefined;
  imageToken?: string | undefined;
  tokenIsWaiting?: boolean;
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

export const getAuditsBadgeText = (status: WorkListStatus): string => {
  switch (status) {
    case WorkListStatus.AUDITSTARTED:
      return `${strings('AUDITS.AUDITS')} - ${strings('AUDITS.IN_PROGRESS')}`;
    case WorkListStatus.INPROGRESS:
      return strings('ITEM.PENDING_MGR_APPROVAL');
    default:
      return '';
  }
};

export const getAuditsBadgeStyle = (status: WorkListStatus) => {
  switch (status) {
    case WorkListStatus.AUDITSTARTED:
      return styles.inProgress;
    case WorkListStatus.INPROGRESS:
      return styles.pendingApproval;
    default:
      return {};
  }
};

export const isQuantityPending = (pendingQty: number | undefined) => typeof pendingQty === 'number' && pendingQty >= 0;

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
  itemNumber, description, onClick, loading, onHandQty, disabled, countryCode,
  showItemImage, showOHItems, OHItemInfo, pendingQty, totalQty, status, imageToken, tokenIsWaiting
}: ItemCardProps) => (
  <View style={styles.mainContainer}>
    <TouchableOpacity
      style={getContainerStyle(loading, showItemImage)}
      onPress={() => {
        if (!loading && onClick) {
          onClick(itemNumber);
        }
      }}
      disabled={disabled}
      testID="itemCard"
    >
      {showItemImage && !loading && (
      <ImageWrapper
        countryCode={countryCode}
        itemNumber={itemNumber}
        imageToken={imageToken}
        tokenIsWaiting={tokenIsWaiting}
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
        {(status && getAuditsBadgeText(status)) ? (
          <View style={getAuditsBadgeStyle(status)}>
            <Text>{getAuditsBadgeText(status)}</Text>
          </View>
        ) : null}
        {onHandQty !== undefined ? (
          <View style={styles.itemQtyContainer}>
            <View style={styles.itemQtyView}>
              <Text style={styles.itemNbr}>{`${strings('ITEM.ON_HANDS')} ${onHandQty.toString()}`}</Text>
              {isQuantityPending(pendingQty) ? <Text style={styles.itemNbr}>{` (${pendingQty})`}</Text> : null}
            </View>
            {isQuantityPending(pendingQty) ? (
              <View style={styles.itemQtyView}>
                <FontAwesome5Icon
                  name="info-circle"
                  size={INFO_ICON_SIZE}
                  color={COLOR.ORANGE}
                  style={styles.infoIcon}
                />
                <Text style={styles.itemNbr}>{strings('ITEM.PENDING_MGR_APPROVAL')}</Text>
              </View>
            ) : null}
          </View>
        ) : null}
        {totalQty !== undefined ? (
          <View style={styles.itemQtyContainer}>
            <Text style={styles.itemNbr}>{`${strings('AUDITS.CURRENT_TOTAL')} ${totalQty}`}</Text>
          </View>
        ) : null}
      </View>
      )}
    </TouchableOpacity>
    {showOHItems && <OtherOnHandsItems countryCode={countryCode} OHItemInfo={OHItemInfo} />}
  </View>
);

ItemCard.defaultProps = {
  showOHItems: false,
  OHItemInfo: defaultOHItemValues,
  disabled: false,
  pendingQty: -999,
  onClick: () => {},
  status: undefined,
  imageToken: undefined,
  tokenIsWaiting: false
};

OtherOnHandsItems.defaultProps = {
  OHItemInfo: defaultOHItemValues
};

export default ItemCard;
