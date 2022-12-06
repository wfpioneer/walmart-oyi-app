import KEY from '../../constant/Key';

export const uuidApiUrlCN = 'https://samsclubcnds.riversand.com/api/entityappservice/get';
export const imageApiUrlCN = 'https://samsclubcnds.riversand.com/api/rsAssetService/getlinkedasseturl';

export const postApiCall = (apiUrl: string, data: string): Promise<Response> => {
  const headers = {
    'Content-Type': 'application/json',
    'x-rdp-version': '8.1',
    'x-rdp-clientId': 'rdbclient',
    'x-rdp-tenantId': 'samsclubcn',
    'x-rdp-userId': 'cnnonadmin.sams@samsclub.com',
    'auth-client-id': KEY.CN_IMAGE_AUTH_CLIENT_ID,
    'auth-client-secret': KEY.CN_IMAGE_AUTH_SECRET
  };

  return fetch(apiUrl, {
    method: 'POST',
    headers,
    body: data
  });
};
