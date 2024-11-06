import axios from 'axios';

export const createCtObjToken = async (secrets: any) => {
  const { CTP_AUTH_URL, CTP_CLIENT_ID, CTP_SCOPES, CTP_CLIENT_SECRET } = secrets;

  try {
    const accessTokenUrl = `${CTP_AUTH_URL}/oauth/token?grant_type=client_credentials`;
    const basicAuth = Buffer.from(
      `${CTP_CLIENT_ID}:${CTP_CLIENT_SECRET}`
    ).toString('base64');
    const requestBody = new URLSearchParams();
    requestBody.append('grant_type', 'client_credentials'); // Use the appropriate grant type
    requestBody.append('scope', CTP_SCOPES || '');
    const response = await axios.post(accessTokenUrl, requestBody, {
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error generating SEO metadata:', error);
    return null;
  }
};
