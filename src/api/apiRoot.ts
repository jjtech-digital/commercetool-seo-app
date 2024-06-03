import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import {
  ClientBuilder,
  AuthMiddlewareOptions,
  HttpMiddlewareOptions,
} from '@commercetools/sdk-client-v2';
import fetch from 'node-fetch';

const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: 'https://auth.australia-southeast1.gcp.commercetools.com',
  projectKey: 'jj-seo-app',
  credentials: {
    clientId: 'DCPHZDYQ_wKThdKR_iEti3EP',
    clientSecret: 'GWq7MCknLhc-Oiu5oLebXqHNMac3zJ85',
  },
  scopes: [
    'manage_discount_codes:jj-seo-app manage_project:jj-seo-app manage_my_payments:jj-seo-app manage_connectors_deployments:jj-seo-app manage_customers:jj-seo-app introspect_oauth_tokens:jj-seo-app manage_cart_discounts:jj-seo-app manage_sessions:jj-seo-app manage_import_containers:jj-seo-app manage_attribute_groups:jj-seo-app manage_my_quote_requests:jj-seo-app manage_my_orders:jj-seo-app view_api_clients:jj-seo-app manage_connectors:jj-seo-app manage_api_clients:jj-seo-app manage_products:jj-seo-app manage_associate_roles:jj-seo-app manage_payments:jj-seo-app create_anonymous_token:jj-seo-app manage_checkout_payment_intents:jj-seo-app manage_my_shopping_lists:jj-seo-app manage_orders:jj-seo-app manage_extensions:jj-seo-app manage_my_business_units:jj-seo-app manage_customer_groups:jj-seo-app manage_audit_log:jj-seo-app manage_business_units:jj-seo-app manage_product_selections:jj-seo-app view_messages:jj-seo-app view_audit_log:jj-seo-app manage_categories:jj-seo-app manage_my_quotes:jj-seo-app manage_order_edits:jj-seo-app manage_my_profile:jj-seo-app',
  ],
  fetch,
};

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: 'https://api.australia-southeast1.gcp.commercetools.com',
  fetch,
};

const ctpClient = new ClientBuilder()
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .build();

const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
  projectKey: 'jj-seo-app',
});

export default apiRoot;
