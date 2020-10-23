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
      orchestrationURL: `https://intl-oyi-orchestration-api.stg.walmart.com`,
      itemDetailsURL: `https://intl-oyi-item-details-api.${countryCode}.stg.walmart.com`,
      locationURL: `https://intl-oyi-location-api.${countryCode}.stg.walmart.com`,
      printingURL: `https://intl-oyi-printing-api.${countryCode}.stg.walmart.com`,
      worklistURL: `https://intl-oyi-worklist-api.${countryCode}.stg.walmart.com`
    },
    prod: {
      orchestrationURL: `https://intl-oyi-orchestration-api.prod.walmart.com`,
      itemDetailsURL: `https://intl-oyi-item-details-api.${countryCode}.prod.walmart.com`,
      locationURL: `https://intl-oyi-location-api.${countryCode}.prod.walmart.com`,
      printingURL: `https://intl-oyi-printing-api.${countryCode}.prod.walmart.com`,
      worklistURL: `https://intl-oyi-worklist-api.${countryCode}.prod.walmart.com`
    }
  };
  return __DEV__ ? environments.stage : environments.stage
};
