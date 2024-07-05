import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import {
  ClientBuilder,
  AuthMiddlewareOptions,
  HttpMiddlewareOptions,
} from '@commercetools/sdk-client-v2';
import fetch from 'node-fetch';

const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: 'https://auth.australia-southeast1.gcp.commercetools.com',
  projectKey: 'jj-custom-app',
  credentials: {
    clientId: 'xZVC4aex0a0MaWLtQ8mk6ZZM',
    clientSecret: 'Wq0FXRJSQpbsxHDKIU6ObdebuiQDJVAs',
  },
  scopes: [
    "view_connectors:jj-custom-app view_attribute_groups:jj-custom-app manage_stores:jj-custom-app manage_types:jj-custom-app manage_project:jj-custom-app manage_my_business_units:jj-custom-app manage_cart_discounts:jj-custom-app view_orders:jj-custom-app view_shipping_methods:jj-custom-app view_connectors_deployments:jj-custom-app manage_audit_log:jj-custom-app view_stores:jj-custom-app manage_checkout_payment_intents:jj-custom-app manage_states:jj-custom-app manage_products:jj-custom-app view_staged_quotes:jj-custom-app manage_my_payments:jj-custom-app manage_my_orders:jj-custom-app manage_my_quotes:jj-custom-app view_messages:jj-custom-app view_customers:jj-custom-app manage_categories:jj-custom-app manage_associate_roles:jj-custom-app view_cart_discounts:jj-custom-app view_categories:jj-custom-app manage_sessions:jj-custom-app view_quote_requests:jj-custom-app manage_tax_categories:jj-custom-app view_payments:jj-custom-app view_project_settings:jj-custom-app view_tax_categories:jj-custom-app view_customer_groups:jj-custom-app manage_payments:jj-custom-app manage_product_selections:jj-custom-app view_states:jj-custom-app manage_project_settings:jj-custom-app view_associate_roles:jj-custom-app introspect_oauth_tokens:jj-custom-app create_anonymous_token:jj-custom-app manage_subscriptions:jj-custom-app manage_api_clients:jj-custom-app view_business_units:jj-custom-app view_types:jj-custom-app manage_my_quote_requests:jj-custom-app view_products:jj-custom-app manage_customers:jj-custom-app manage_business_units:jj-custom-app manage_import_containers:jj-custom-app manage_discount_codes:jj-custom-app view_standalone_prices:jj-custom-app manage_orders:jj-custom-app manage_standalone_prices:jj-custom-app view_quotes:jj-custom-app view_shopping_lists:jj-custom-app manage_my_shopping_lists:jj-custom-app manage_my_profile:jj-custom-app view_order_edits:jj-custom-app manage_shipping_methods:jj-custom-app view_sessions:jj-custom-app view_product_selections:jj-custom-app manage_connectors:jj-custom-app manage_quotes:jj-custom-app manage_shopping_lists:jj-custom-app view_audit_log:jj-custom-app manage_extensions:jj-custom-app manage_attribute_groups:jj-custom-app manage_staged_quotes:jj-custom-app view_import_containers:jj-custom-app manage_quote_requests:jj-custom-app manage_connectors_deployments:jj-custom-app manage_order_edits:jj-custom-app view_discount_codes:jj-custom-app manage_customer_groups:jj-custom-app",
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
  projectKey: 'jj-custom-app',
});

export default apiRoot;
