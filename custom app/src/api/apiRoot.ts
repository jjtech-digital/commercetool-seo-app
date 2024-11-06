import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import {
  ClientBuilder,
  AuthMiddlewareOptions,
  HttpMiddlewareOptions,
} from '@commercetools/sdk-client-v2';
import fetch from 'node-fetch';

const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: window.app.authUrl,
  projectKey: window.app.projectKey,
  credentials: {
    clientId: window.app.clientId,
    clientSecret: window.app.clientSecret,
  },
  scopes: [
    window.app.scopes,
  ],
  fetch,
};

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host:  window.app.apiUrl,
  fetch,
};

const ctpClient = new ClientBuilder()
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .build();

const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
  projectKey: window.app.projectKey,
});

export default apiRoot;
