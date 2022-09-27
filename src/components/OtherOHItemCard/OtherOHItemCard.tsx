import React from 'react';
import {
  ActivityIndicator, Platform, Text, View
} from 'react-native';
import styles from './OtherOHItemCard.style';
import CollapsibleCard from '../CollapsibleCard/CollapsibleCard';
import { strings } from '../../locales';
import COLOR from '../../themes/Color';

export type OtherOHItemCardProps = {
    claimsOH: number;
    consolidatorOH: number;
    flyCloudOH: number;
    flyCloudInTransitOH: number;
    collapsed: boolean;
    loading: boolean;
};

const OtherOHItemCard = (props: OtherOHItemCardProps): JSX.Element => {
  const {
    claimsOH, consolidatorOH, flyCloudInTransitOH, flyCloudOH, collapsed, loading
  } = props;
  const totalOtherOHItems = claimsOH + consolidatorOH + flyCloudInTransitOH + flyCloudOH;

  return (
    <View>
      {loading ? (
        <CollapsibleCard
          isOpened={!collapsed}
          titleStyle={styles.titleStyle}
          title={strings('AUDITS.OTHER_ON_HANDS')}
        >
          <View style={styles.loader} testID="loader">
            <ActivityIndicator size={30} color={Platform.OS === 'android' ? COLOR.MAIN_THEME_COLOR : undefined} />
          </View>
        </CollapsibleCard>
      ) : (
        <CollapsibleCard
          isOpened={!collapsed}
          titleStyle={styles.titleStyle}
          title={`${strings('AUDITS.OTHER_ON_HANDS')} (${totalOtherOHItems})`}
        >
          <View style={styles.otherOHDetails}>
            <View>
              <Text style={styles.content}>{`${strings('ITEM.CLAIMS_QTY')}  ${claimsOH}`}</Text>
              <Text style={styles.content}>{`${strings('ITEM.FLY_CLOUD_QTY')}  ${flyCloudOH}`}</Text>
            </View>
            <View>
              <Text style={styles.content}>{`${strings('ITEM.CONSOLIDATED_QTY')}  ${consolidatorOH}`}</Text>
              <Text style={styles.content}>{`${strings('ITEM.IN_TRANSIT_FLY_QTY')}  ${flyCloudInTransitOH}`}</Text>
            </View>
          </View>
        </CollapsibleCard>
      )}
    </View>
  );
};

export default OtherOHItemCard;
