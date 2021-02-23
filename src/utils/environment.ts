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

type svcEnv = 'dev'|'stg:1.0.0'|'stg:2.0.0'|'stage'|'prod'| '';
export const getWmSvcEnv = (isOrchApi?: boolean): svcEnv => {
  switch (Config.ENVIRONMENT) {
    case 'dev':
      return isOrchApi ? 'stg:1.0.0' : 'dev';
    case 'stage':
      return isOrchApi ? 'stg:2.0.0' : 'stage';
    case 'prod':
      return 'prod';
    default:
      return isOrchApi ? 'stg:2.0.0' : 'stage';
  }
};

// this is a temporary change to hit the Orch api for development waiting for BE fixes
export const getConsumerId = (isOrchApi?: boolean) => {
  const consumerId = {
    dev: '3b87ba30-529e-4cf7-983f-c3873edc6304',
    stage: '28cd32c8-6c12-40e9-97ec-e06db93fa529',
    prod: ''
  };

  switch (Config.ENVIRONMENT) {
    case 'dev':
      // Service Mesh in Orch Api requires Oyi-app-stage consumerId for its dev(stg:1.0.0) environment
      return isOrchApi ? consumerId.stage : consumerId.dev;
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
