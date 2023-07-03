import React from 'react';
import { Text, View } from 'react-native';
import { NavigationProp } from '@react-navigation/native';

import styles from './ItemInfo.style';
import { currencies, strings } from '../../locales';
import Button from '../buttons/Button';
import COLOR from '../../themes/Color';
import { trackEvent } from '../../utils/AppCenterTool';
import CollapsibleCard from '../CollapsibleCard/CollapsibleCard';
import ItemDetailsList, { ItemDetailsListRow } from '../ItemDetailsList/ItemDetailsList';
import ImageWrapper from '../ImageWrapper/ImageWrapper';
import { TrackEventSource } from '../../models/Generics.d';

export type ItemInfoProps = {
  itemName: string;
  itemNbr: number;
  upcNbr: string;
  status: string;
  category: string;
  price?: number;
  exceptionType?: string; // This is enumerated
  navigationForPrint?: NavigationProp<any>;
  additionalItemDetails?: AdditionalItemDetailsProps;
  countryCode: string;
  showItemImage: boolean;
  worklistAuditType?: string;
};

export type AdditionalItemDetailsProps = {
  color: string,
  size: number,
  grossProfit: number,
  vendorPackQty: number,
  basePrice: number,
  margin: number,
  source?: TrackEventSource,
  viewProfitMargin: boolean
}

export const renderAdditionalItemDetails = (
  additionalItemDetails: AdditionalItemDetailsProps,
): JSX.Element => {
  const {
    color,
    margin,
    vendorPackQty,
    grossProfit,
    size,
    basePrice,
    source,
    viewProfitMargin
  } = additionalItemDetails;

  const qtyRows: ItemDetailsListRow[] = [
    { label: strings('ITEM.VENDOR_PACK'), value: vendorPackQty },
    { label: strings('ITEM.COLOR'), value: color },
    { label: strings('ITEM.SIZE'), value: size },
    {
      label: strings('ITEM.PRICE_BEFORE_TAX'),
      value:
    `$${typeof basePrice === 'number' ? basePrice.toFixed(2) : '0.00'}`
    }
  ];

  if (viewProfitMargin) {
    qtyRows.push({
      label: strings('ITEM.MARGIN'),
      value:
    `${typeof margin === 'number' ? margin.toFixed(2) : '0.00'}%`
    });
    qtyRows.push({
      label: strings('ITEM.GROSS_PROFIT'),
      value:
    `$${typeof grossProfit === 'number' ? grossProfit.toFixed(2) : '0.00'}`
    });
  }

  return (
    <CollapsibleCard title={strings('ITEM.ADDITIONAL_ITEM_DETAILS')} source={source}>
      <View testID="additional-item-details">
        <ItemDetailsList rows={qtyRows} indentAfterFirstRow={false} />
      </View>
    </CollapsibleCard>
  );
};

const ItemInfo = (props: ItemInfoProps): JSX.Element => {
  const {
    itemName, itemNbr, upcNbr, status, category,
    price, exceptionType, navigationForPrint: navigation, additionalItemDetails,
    countryCode, showItemImage, worklistAuditType
  } = props;

  const handlePrintPriceSign = () => {
    trackEvent('item_details_print_sign_button_click', { itemDetails: JSON.stringify(props) });
    // will only be callable when button is available
    navigation?.navigate('PrintPriceSign', { screen: 'PrintPriceSignScreen' });
  };

  let exceptionString = strings('EXCEPTION.UNKNOWN');
  if (exceptionType) {
    switch (exceptionType.toUpperCase()) {
      case 'NO':
        exceptionString = strings('EXCEPTION.NEGATIVE_ON_HANDS');
        break;
      case 'NSFL':
        exceptionString = strings('EXCEPTION.NSFL');
        break;
      case 'NP':
        exceptionString = strings('EXCEPTION.NIL_PICK');
        break;
      case 'NS':
        exceptionString = strings('EXCEPTION.NO_SALES');
        break;
      case 'C':
        exceptionString = strings('EXCEPTION.CANCELLED');
        break;
      case 'PO':
        exceptionString = strings('EXCEPTION.PO');
        break;
      case 'NSFQ':
        exceptionString = strings('EXCEPTION.NEG_SALES_FLOOR_QTY');
        break;
      default:
        break;
    }
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.imageContainer}>
        {showItemImage && (
        <View style={styles.imageView}>
          <ImageWrapper
            itemNumber={itemNbr}
            countryCode={countryCode}
            imageStyle={styles.image}
          />
        </View>
        )}
        <View>
          {exceptionType && <Text style={styles.exceptionText}>{exceptionString}</Text>}
          {worklistAuditType && <Text style={styles.auditFlagText}>{strings('AUDITS.AUDITS')}</Text>}
          <Text style={styles.itemNameText}>{itemName}</Text>
          <View style={styles.nbrContainer}>
            <Text style={styles.itemNbrText}>{`${strings('ITEM.ITEM')} ${itemNbr}`}</Text>
            <Text style={styles.nbrDivider}>|</Text>
            <Text style={styles.upcNbrText}>{`${strings('ITEM.UPC')} ${upcNbr}`}</Text>
          </View>
          <Text style={styles.statusText}>{`${strings('ITEM.STATUS')}: ${status}`}</Text>
          <Text style={styles.catgText}>{`${strings('ITEM.CATEGORY')}: ${category}`}</Text>
        </View>
      </View>
      {additionalItemDetails && renderAdditionalItemDetails(additionalItemDetails)}
      {price && <Text style={styles.priceText}>{`${currencies(price)}`}</Text>}
      {navigation && (
        <Button
          type={2}
          title={strings('PRINT.PRICE_SIGN')}
          titleColor={COLOR.MAIN_THEME_COLOR}
          testID="print-price-sign"
          style={styles.printPriceBtn}
          onPress={handlePrintPriceSign}
        />
      )}
    </View>
  );
};

ItemInfo.defaultProps = {
  exceptionType: null,
  navigationForPrint: undefined,
  price: undefined,
  additionalItemDetails: undefined,
  worklistAuditType: undefined
};

export default ItemInfo;
