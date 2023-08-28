export const postApiCall = (apiUrl: string, data: any): Promise<Response> => {
  const headers = {
    'Content-Type': 'application/json',
    'c-name': 'oyi-riversand'
  };

  return fetch(apiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  });
};
