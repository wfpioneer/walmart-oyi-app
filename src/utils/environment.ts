import Config from 'react-native-config';
import { store } from '../../App';

export interface Environment {
  orchestrationURL: string;
  itemDetailsURL: string;
  locationURL: string;
  printingURL: string;
  worklistURL: string;
}

export interface Environments {
  dev: Environment;
  stage: Environment;
  prod: Environment;
}

interface ApplicationKey {
  orchestrationName: string;
  itemDetailsName: string;
  locationName: string;
  printingName: string;
  worklistName: string;
}

export const svcName: ApplicationKey = {
  orchestrationName: 'INTLSAMS-OYI-ORCHESTRATION-API',
  itemDetailsName: 'OYI_ITEM_DETAILS_API',
  locationName: 'OYI_LOCATION_API',
  printingName: 'OYI_PRINTING_API',
  worklistName: 'OYI_WORKLIST_API'
};

type svcEnv = 'stg.1.0.0' | 'stg.2.0.0' | '';
export const getWmSvcEnv = (): svcEnv => {
  switch (Config.ENVIRONMENT) {
    case 'dev':
      return 'stg.1.0.0';
    case 'stage':
      return 'stg.2.0.0';
    case 'prod':
      return '';
    default:
      return 'stg.2.0.0';
  }
};

export const getConsumerId = () => {
  const consumerId = {
    dev: '3b87ba30-529e-4cf7-983f-c3873edc6304',
    stage: '3b87ba30-529e-4cf7-983f-c3873edc6304',
    prod: ''
  };

  switch (Config.ENVIRONMENT) {
    case 'dev':
      return consumerId.dev;
    case 'stage':
      return consumerId.stage;
    case 'prod':
      return consumerId.prod;
    default:
      return consumerId.stage;
  }
};

export const getEnvironment = (): Environment => {
  const countryCode = store.getState().User.countryCode.toLowerCase();

  const environments: Environments = {
    dev: {
      orchestrationURL: 'https://intl-oyi-orchestration-api.dev.walmart.com',
      itemDetailsURL: `https://intl-oyi-item-details-api.${countryCode}.dev.walmart.com`,
      locationURL: `https://intl-oyi-location-api.${countryCode}.dev.walmart.com`,
      printingURL: `https://intl-oyi-printing-api.${countryCode}.dev.walmart.com`,
      worklistURL: `https://intl-oyi-worklist-api.${countryCode}.dev.walmart.com`
    },
    stage: {
      orchestrationURL: 'https://intl-oyi-orchestration-api.stg.walmart.com',
      itemDetailsURL: `https://intl-oyi-item-details-api.${countryCode}.stg.walmart.com`,
      locationURL: `https://intl-oyi-location-api.${countryCode}.stg.walmart.com`,
      printingURL: `https://intl-oyi-printing-api.${countryCode}.stg.walmart.com`,
      worklistURL: `https://intl-oyi-worklist-api.${countryCode}.stg.walmart.com`
    },
    prod: {
      orchestrationURL: 'https://intl-oyi-orchestration-api.prod.walmart.com',
      itemDetailsURL: `https://intl-oyi-item-details-api.${countryCode}.prod.walmart.com`,
      locationURL: `https://intl-oyi-location-api.${countryCode}.prod.walmart.com`,
      printingURL: `https://intl-oyi-printing-api.${countryCode}.prod.walmart.com`,
      worklistURL: `https://intl-oyi-worklist-api.${countryCode}.prod.walmart.com`
    }
  };

  switch (Config.ENVIRONMENT) {
    case 'dev':
      return environments.dev;
    case 'stage':
      return environments.stage;
    case 'prod':
      return environments.prod;
    default:
      return environments.stage;
  }
};
