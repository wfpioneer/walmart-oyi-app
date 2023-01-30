// eslint-disable-next-line @typescript-eslint/no-var-requires
const secrets = require('./Secrets.json');

const KEY = {
  CN_IMAGE_AUTH_CLIENT_ID: secrets.CN_IMAGE_AUTH_CLIENT_ID,
  CN_IMAGE_AUTH_SECRET: secrets.CN_IMAGE_AUTH_SECRET
};
export default KEY;
