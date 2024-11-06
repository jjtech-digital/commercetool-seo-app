import { entryPointUriPathToPermissionKeys } from '@commercetools-frontend/application-shell/ssr';

/**
 * @type {import('@commercetools-frontend/application-config').ConfigOptionsForCustomApplication}
 */
const config = {
  name: 'Custom Seo',
  entryPointUriPath: "${env:ENTRY_POINT_URI_PATH}",
  cloudIdentifier: "${env:CLOUD_IDENTIFIER}",
  headers: {
    csp: {
      'connect-src': [
        'http://localhost:3002/products',
        'http://localhost:3002/products/generate-meta-data',
        'http://localhost:3002/rule',
        'http://localhost:3002/rule/create-rules',
        'http://localhost:3002/rule/saved-rules',
        'https://ct-custom-seo-be.vercel.app/products',
        'https://ct-custom-seo-be.vercel.app/products/generate-meta-data',
        'https://ct-custom-seo-be.vercel.app/rule',
        'https://ct-custom-seo-be.vercel.app/rule/create-rules',
        'https://ct-custom-seo-be.vercel.app/rule/saved-rules',
        'https://api.australia-southeast1.gcp.commercetools.com/jj-custom-app',
        'https://auth.australia-southeast1.gcp.commercetools.com/oauth/token',
        'https://api.australia-southeast1.gcp.commercetools.com/ct-assessment',
        'https://api.australia-southeast1.gcp.commercetools.com/ct-assessment/product-projections',
        'https://api.openai.com/v1/chat/completions',
        '*',
      ],
    },
  },
  env: {
    development: {
      initialProjectKey: 'jj-custom-app',
    },
    production: {
      applicationId: '${env:CUSTOM_APPLICATION_ID}',
      url: '${env:APP_URL}',
    },
  },

  additionalEnv: {
    applicationId: '${env:CUSTOM_APPLICATION_ID}',
    url: '${env:APP_URL}',
    authUrl: '${env:CTP_AUTH_URL}',
    apiUrl: '${env:CTP_API_URL}',
    projectKey: '${env:CTP_PROJECT_KEY}',
    clientSecret: '${env:CTP_CLIENT_SECRET}',
    clientId: '${env:CTP_CLIENT_ID}',
    scopes: '${env:CTP_SCOPES}',
    entryPointUriPath : "${env:ENTRY_POINT_URI_PATH}"
  },

  oAuthScopes: {
    view: ['view_products'],
    manage: ['manage_products'],
  },
  icon: '${path:@commercetools-frontend/assets/application-icons/rocket.svg}',
  mainMenuLink: {
    defaultLabel: 'Template starter',
    labelAllLocales: [],
    permissions: [entryPointUriPathToPermissionKeys("${env:ENTRY_POINT_URI_PATH}").View],
  },
  submenuLinks: [
    {
      uriPath: 'channels',
      defaultLabel: 'Channels',
      labelAllLocales: [],
      permissions: [entryPointUriPathToPermissionKeys("${env:ENTRY_POINT_URI_PATH}").View],
    },
  ],
};

export default config;
