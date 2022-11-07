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
    countryCode?: string;
};

const OtherOHItemCard = (props: OtherOHItemCardProps): JSX.Element => {
  const {
    claimsOH, consolidatorOH, flyCloudInTransitOH, flyCloudOH, collapsed, loading, countryCode
  } = props;
  const totalOtherOHItems = claimsOH + consolidatorOH + flyCloudInTransitOH + flyCloudOH;

  const ClaimsText = () => (
    <Text style={styles.content}>
      {`${strings(
        'ITEM.CLAIMS_QTY'
      )}  ${claimsOH}`}
    </Text>
  );

  const ConsolidatedText = () => (
    <Text style={styles.content}>
      {`${strings(
        'ITEM.CONSOLIDATED_QTY'
      )}  ${consolidatorOH}`}
    </Text>
  );

  const FlyCloudText = () => (
    <Text style={styles.content}>
      {`${strings(
        'ITEM.FLY_CLOUD_QTY'
      )}  ${flyCloudOH}`}
    </Text>
  );

  const InTransitOHText = () => (
    <Text style={styles.content}>
      {`${strings(
        'ITEM.IN_TRANSIT_FLY_QTY'
      )}  ${flyCloudInTransitOH}`}
    </Text>
  );

  return (
    <View>
      {loading ? (
        <CollapsibleCard
          isOpened={!collapsed}
          titleStyle={styles.titleStyle}
          title={strings('AUDITS.OTHER_ON_HANDS')}
        >
          <View style={styles.loader} testID="loader">
            <ActivityIndicator
              size={30}
              color={
                Platform.OS === 'android' ? COLOR.MAIN_THEME_COLOR : undefined
              }
            />
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
              {countryCode === 'MX' && (
                <View style={styles.contentList}>
                  <ClaimsText />
                  <ConsolidatedText />
                </View>
              )}
              {countryCode === 'CN' && (
                <>
                  <View style={styles.contentList}>
                    <ClaimsText />
                    <FlyCloudText />
                  </View>
                  <View style={styles.contentList}>
                    <InTransitOHText />
                  </View>
                </>
              )}
            </View>
          </View>
        </CollapsibleCard>
      )}
    </View>
  );
};

export default OtherOHItemCard;
