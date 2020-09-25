interface Environment {
  orchestrationURL: string;
  itemDetailsURL: string;
  locationURL: string;
  printingURL: string;
  worklistURL: string;
}

export interface Environments {
  stage: Environment;
  prod: Environment;
}

const environments: Environments = {
  stage: {
    orchestrationURL: 'https://intl-oyi-orchestration-api.dev.walmart.com',
    itemDetailsURL: 'https://intl-oyi-item-details-api.dev.walmart.com',
    locationURL: 'https://intl-oyi-location-api.dev.walmart.com',
    printingURL: 'https://intl-oyi-printing-api.dev.walmart.com',
    worklistURL: 'https://intl-oyi-worklist-api.dev.walmart.com'
  },
  prod: {
    orchestrationURL: '',
    itemDetailsURL: '',
    locationURL: '',
    printingURL: '',
    worklistURL: ''
  }
};

const getEnvironment = (): Environment => {
  return __DEV__ ? environments.stage : environments.stage;
};

export default getEnvironment();