// @ts-ignore
const environments = {
  dev: {
    orchestrationURL: 'https://intl-oyi-orchestration-api.dev.walmart.com',
    itemDetailsURL: 'https://intl-oyi-item-details-api.dev.walmart.com',
    locationURL: 'https://intl-oyi-location-api.dev.walmart.com',
    printingURL: 'https://intl-oyi-printing-api.dev.walmart.com',
    worklistURL: 'https://intl-oyi-worklist-api.dev.walmart.com'
  },
  stage: {
    orchestrationURL: '',
    itemDetailsURL: '',
    locationURL: '',
    printingURL: '',
    worklistURL: ''
  },
  prod: {
    orchestrationURL: '',
    itemDetailsURL: '',
    locationURL: '',
    printingURL: '',
    worklistURL: ''
  }
};

const getEnvironment = () => {

};