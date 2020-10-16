interface Environment {
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

const environments: Environments = {
  dev: {
    orchestrationURL: 'https://intl-oyi-orchestration-api.dev.walmart.com',
    itemDetailsURL: 'https://intl-oyi-item-details-api.dev.walmart.com',
    locationURL: 'https://intl-oyi-location-api.dev.walmart.com',
    printingURL: 'https://intl-oyi-printing-api.dev.walmart.com',
    worklistURL: 'https://intl-oyi-worklist-api.dev.walmart.com'
  },
  stage: {
    orchestrationURL: 'https://intl-oyi-orchestration-api.stg.walmart.com',
    itemDetailsURL: 'https://intl-oyi-item-details-api.stg.walmart.com',
    locationURL: 'https://intl-oyi-location-api.stg.walmart.com',
    printingURL: 'https://intl-oyi-printing-api.stg.walmart.com',
    worklistURL: 'https://intl-oyi-worklist-api.stg.walmart.com'
  },
  prod: {
    orchestrationURL: 'https://intl-oyi-orchestration-api.prod.walmart.com',
    itemDetailsURL: 'https://intl-oyi-item-details-api.prod.walmart.com',
    locationURL: 'https://intl-oyi-location-api.prod.walmart.com',
    printingURL: 'https://intl-oyi-printing-api.prod.walmart.com',
    worklistURL: 'https://intl-oyi-worklist-api.prod.walmart.com'
  }
};

const getEnvironment = (): Environment => (__DEV__ ? environments.stage : environments.prod);

export default getEnvironment();