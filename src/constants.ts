// Make sure to import the helper functions from the `ssr` entry point.
import { entryPointUriPathToPermissionKeys } from '@commercetools-frontend/application-shell/ssr';

export const entryPointUriPath = 'custom-seo';

export const PERMISSIONS = entryPointUriPathToPermissionKeys(entryPointUriPath);

export const apiBaseUrl = 'https://ct-custom-seo-be.vercel.app';

export const titlePattern = /(SEO Title:|Title:)\s*(.+)/;
export const descriptionPattern = /(SEO Description:|Description:)\s*(.+)/;

// export const normalDescPattern =/\*Description\*:\s*(.+?)\s*\*Key Features\*:/s;
export const normalDescPattern =/\*Description\*:\s*(.*?)\s*\*Key Features\*:/
export const featuresPattern =  /\*Key Features\*:\s*(.+)/s;

export const LS_KEY = {
  CT_OBJ_TOKEN: 'token',
  OPEN_AI_KEY: 'openAIKey',
};


export const CTP_CUSTOM_OBJ_SEO_CONTAINER_NAME="ct-seo-container"
export const CTP_CUSTOM_OBJ_SEO_CONTAINER_KEY="ct-seo-key"

export const CTP_CUSTOM_OBJ_DESCRIPTION_CONTAINER_NAME="ct-description-container"
export const CTP_CUSTOM_OBJ_DESCRIPTION_CONTAINER_KEY="ct-description-key"

export const CTP_CUSTOM_OBJ_KEYFEATURES_CONTAINER_NAME="ct-keyFeatures-container"
export const CTP_CUSTOM_OBJ_KEYFEATURES_CONTAINER_KEY="ct-keyFeatures-key"


export const CTP_CUSTOM_OBJ_AI_CONTAINER_NAME="ct-seo-ai-container"
export const CTP_CUSTOM_OBJ_AI_CONTAINER_KEY="ct-seo-ai-key"

export const APPLICATION_ID="clukw6xob001mliooc1pc4t5q"
export const CTP_PROJECT_KEY="jj-custom-app"
export const CTP_CLIENT_ID="xZVC4aex0a0MaWLtQ8mk6ZZM"
export const CTP_AUTH_URL="https://auth.australia-southeast1.gcp.commercetools.com"
export const CTP_API_URL="https://api.australia-southeast1.gcp.commercetools.com"
export const CTP_SCOPES="view_connectors:jj-custom-app view_attribute_groups:jj-custom-app manage_stores:jj-custom-app manage_types:jj-custom-app manage_project:jj-custom-app manage_my_business_units:jj-custom-app manage_cart_discounts:jj-custom-app view_orders:jj-custom-app view_shipping_methods:jj-custom-app view_connectors_deployments:jj-custom-app manage_audit_log:jj-custom-app view_stores:jj-custom-app manage_checkout_payment_intents:jj-custom-app manage_states:jj-custom-app manage_products:jj-custom-app view_staged_quotes:jj-custom-app manage_my_payments:jj-custom-app manage_my_orders:jj-custom-app manage_my_quotes:jj-custom-app view_messages:jj-custom-app view_customers:jj-custom-app manage_categories:jj-custom-app manage_associate_roles:jj-custom-app view_cart_discounts:jj-custom-app view_categories:jj-custom-app manage_sessions:jj-custom-app view_quote_requests:jj-custom-app manage_tax_categories:jj-custom-app view_payments:jj-custom-app view_project_settings:jj-custom-app view_tax_categories:jj-custom-app view_customer_groups:jj-custom-app manage_payments:jj-custom-app manage_product_selections:jj-custom-app view_states:jj-custom-app manage_project_settings:jj-custom-app view_associate_roles:jj-custom-app introspect_oauth_tokens:jj-custom-app create_anonymous_token:jj-custom-app manage_subscriptions:jj-custom-app manage_api_clients:jj-custom-app view_business_units:jj-custom-app view_types:jj-custom-app manage_my_quote_requests:jj-custom-app view_products:jj-custom-app manage_customers:jj-custom-app manage_business_units:jj-custom-app manage_import_containers:jj-custom-app manage_discount_codes:jj-custom-app view_standalone_prices:jj-custom-app manage_orders:jj-custom-app manage_standalone_prices:jj-custom-app view_quotes:jj-custom-app view_shopping_lists:jj-custom-app manage_my_shopping_lists:jj-custom-app manage_my_profile:jj-custom-app view_order_edits:jj-custom-app manage_shipping_methods:jj-custom-app view_sessions:jj-custom-app view_product_selections:jj-custom-app manage_connectors:jj-custom-app manage_quotes:jj-custom-app manage_shopping_lists:jj-custom-app view_audit_log:jj-custom-app manage_extensions:jj-custom-app manage_attribute_groups:jj-custom-app manage_staged_quotes:jj-custom-app view_import_containers:jj-custom-app manage_quote_requests:jj-custom-app manage_connectors_deployments:jj-custom-app manage_order_edits:jj-custom-app view_discount_codes:jj-custom-app manage_customer_groups:jj-custom-app"