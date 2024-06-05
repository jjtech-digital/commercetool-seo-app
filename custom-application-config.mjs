import { PERMISSIONS, entryPointUriPath } from './src/constants';

/**
 * @type {import('@commercetools-frontend/application-config').ConfigOptionsForCustomApplication}
 */
const config = {
  name: 'Custom Seo',
  entryPointUriPath,
  cloudIdentifier: 'gcp-au',
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
        'https://api.australia-southeast1.gcp.commercetools.com/jj-seo-app',
        'https://auth.australia-southeast1.gcp.commercetools.com/oauth/token',
        'https://api.australia-southeast1.gcp.commercetools.com/ct-assessment',
        'https://api.australia-southeast1.gcp.commercetools.com/ct-assessment/product-projections',
        'https://api.openai.com/v1/chat/completions',
        '*'
      ],
    },
  },
  env: {
    development: {
      initialProjectKey: 'jj-seo-app',
    },
    production: {
      applicationId: '${env:APPLICATION_ID}',
      url: '${env:APP_URL}',
    },
  },

  oAuthScopes: {
    view: ['view_products'],
    manage: ['manage_products'],
  },
  icon: '${path:@commercetools-frontend/assets/application-icons/rocket.svg}',
  mainMenuLink: {
    defaultLabel: 'Template starter',
    labelAllLocales: [],
    permissions: [PERMISSIONS.View],
  },
  submenuLinks: [
    {
      uriPath: 'channels',
      defaultLabel: 'Channels',
      labelAllLocales: [],
      permissions: [PERMISSIONS.View],
    },
  ],
};

export default config;
