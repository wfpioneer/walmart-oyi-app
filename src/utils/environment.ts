import Config from 'react-native-config';
import store from '../state';

export interface Environment {
  pingFedURL: string;
  orchestrationURL: string;
  itemDetailsURL: string;
  worklistURL: string;
  printingUrl: string;
  fluffyURL: string;
  locationUrl: string;
  configUrl: string;
  itemImageUUIDUrlCN: string;
  itemImageUrlCN: string;
  atmtUrl: string;
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
  fluffyName: string;
  configName: string;
}

export const svcName: ApplicationKey = {
  orchestrationName: 'INTLSAMS-OYI-ORCHESTRATION-API',
  itemDetailsName: 'OYI_ITEM_DETAILS_API',
  locationName: 'OYI_LOCATION_API',
  printingName: 'OYI_PRINTING_API',
  worklistName: 'OYI_WORKLIST_API',
  configName: 'OYI_CONFIG_API',
  fluffyName: 'IntlMobileAuthorizationPlatform'
};

type svcEnv = 'dev'|'stage'|'prod'| '';
export const getWmSvcEnv = (): svcEnv => {
  switch (Config.ENVIRONMENT) {
    case 'dev':
      return 'dev';
    case 'stage':
      return 'stage';
    case 'prod':
      return 'prod';
    default:
      return 'stage';
  }
};

export const getPingFedClientId = () => {
  switch (Config.ENVIRONMENT) {
    case 'dev':
      return 'intl_sams_oyi_dev';
    case 'stage':
      return 'intl_sams_oyi_stg';
    case 'prod':
      return 'intl_sams_oyi_prod';
    default:
      return 'intl_sams_oyi_prod';
  }
};

export const getConsumerId = () => {
  const consumerId = {
    dev: '3b87ba30-529e-4cf7-983f-c3873edc6304',
    stage: '28cd32c8-6c12-40e9-97ec-e06db93fa529',
    prod: 'cf25a58c-3fdb-4189-974f-8086c7be23d1'
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
  const countryCode = store.getState().User.c.toLowerCase();

  const environments: Environments = {
    dev: {
      pingFedURL: 'https://pfeddev.wal-mart.com',
      orchestrationURL: `https://intl-oyi-orchestration-api.${countryCode}.dev.walmart.com`,
      itemDetailsURL: `https://intl-oyi-item-details-api.${countryCode}.dev.walmart.com`,
      worklistURL: `https://intl-oyi-worklist-api.${countryCode}.dev.walmart.com`,
      fluffyURL: 'https://api-proxy.stg.soa-api-proxy.platform.glb.prod.walmart.com'
        + '/api-proxy/service/IntlMobileAuthorizationPlatform',
      locationUrl: `https://intl-oyi-location-api.${countryCode}.dev.walmart.com`,
      printingUrl: `https://intl-oyi-printing-api.${countryCode}.dev.walmart.com`,
      configUrl: `https://intl-oyi-config-api.${countryCode}.dev.walmart.com`,
      itemImageUUIDUrlCN: 'https://samsclubcnds.riversand.com/api/entityappservice/get',
      itemImageUrlCN: 'https://samsclubcnds.riversand.com/api/rsAssetService/getlinkedasseturl',
      atmtUrl: 'https://api.atmt-feedback.qa.walmart.com'
    },
    stage: {
      pingFedURL: 'https://pfedcert.wal-mart.com',
      orchestrationURL: `https://intl-oyi-orchestration-api.${countryCode}.stg.walmart.com`,
      itemDetailsURL: `https://intl-oyi-item-details-api.${countryCode}.stg.walmart.com`,
      worklistURL: `https://intl-oyi-worklist-api.${countryCode}.stg.walmart.com`,
      fluffyURL: 'https://api-proxy.stg.soa-api-proxy.platform.glb.prod.walmart.com'
        + '/api-proxy/service/IntlMobileAuthorizationPlatform',
      locationUrl: `https://intl-oyi-location-api.${countryCode}.stg.walmart.com`,
      printingUrl: `https://intl-oyi-printing-api.${countryCode}.stg.walmart.com`,
      configUrl: `https://intl-oyi-config-api.${countryCode}.stg.walmart.com`,
      itemImageUUIDUrlCN: 'https://samsclubcnds.riversand.com/api/entityappservice/get',
      itemImageUrlCN: 'https://samsclubcnds.riversand.com/api/rsAssetService/getlinkedasseturl',
      atmtUrl: 'https://api.atmt-feedback.qa.walmart.com'
    },
    prod: {
      pingFedURL: 'https://pfedprod.wal-mart.com',
      orchestrationURL: `https://intl-oyi-orchestration-api.${countryCode}.prod.walmart.com`,
      itemDetailsURL: `https://intl-oyi-item-details-api.${countryCode}.prod.walmart.com`,
      worklistURL: `https://intl-oyi-worklist-api.${countryCode}.prod.walmart.com`,
      fluffyURL: 'https://api-proxy.prod.soa-api-proxy.platform.glb.prod.walmart.com'
        + '/api-proxy/service/IntlMobileAuthorizationPlatform',
      locationUrl: `https://intl-oyi-location-api.${countryCode}.prod.walmart.com`,
      printingUrl: `https://intl-oyi-printing-api.${countryCode}.prod.walmart.com`,
      configUrl: `https://intl-oyi-config-api.${countryCode}.prod.walmart.com`,
      itemImageUUIDUrlCN: 'https://samsclubcnds.riversand.com/api/entityappservice/get',
      itemImageUrlCN: 'https://samsclubcnds.riversand.com/api/rsAssetService/getlinkedasseturl',
      atmtUrl: 'https://api.atmt-feedback.prod.walmart.com'
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

export const getBuildEnvironment = (): string => {
  if (Config.ENVIRONMENT === 'prod') {
    return '';
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return `-${Config.ENVIRONMENT.toUpperCase()}`;
};
