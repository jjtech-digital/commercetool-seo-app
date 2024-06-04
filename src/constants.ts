// Make sure to import the helper functions from the `ssr` entry point.
import { entryPointUriPathToPermissionKeys } from '@commercetools-frontend/application-shell/ssr';

export const entryPointUriPath = 'custom-seo';

export const PERMISSIONS = entryPointUriPathToPermissionKeys(entryPointUriPath);

export const apiBaseUrl = 'https://ct-custom-seo-be.vercel.app';

export const titlePattern = /(SEO Title:|Title:)\s*(.+)/;
export const descriptionPattern = /(SEO Description:|Description:)\s*(.+)/;

export const LS_KEY = {
  CT_OBJ_TOKEN: 'token',
  OPEN_AI_KEY: 'openAIKey',
};

export const OPENAI_API_KEY="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"

export const CTP_CUSTOM_OBJ_CONTAINER_NAME="ct-seo-container"
export const CTP_CUSTOM_OBJ_CONTAINER_KEY="ct-seo-key"

export const CTP_CUSTOM_OBJ_AI_CONTAINER_NAME="ct-seo-ai-container"
export const CTP_CUSTOM_OBJ_AI_CONTAINER_KEY="ct-seo-ai-key"

export const APPLICATION_ID="clukw6xob001mliooc1pc4t5q"
export const CTP_PROJECT_KEY="jj-seo-app"
export const CTP_CLIENT_SECRET="GWq7MCknLhc-Oiu5oLebXqHNMac3zJ85"
export const CTP_CLIENT_ID="DCPHZDYQ_wKThdKR_iEti3EP"
export const CTP_AUTH_URL="https://auth.australia-southeast1.gcp.commercetools.com"
export const CTP_API_URL="https://api.australia-southeast1.gcp.commercetools.com"
export const CTP_SCOPES="manage_discount_codes:jj-seo-app manage_project:jj-seo-app manage_my_payments:jj-seo-app manage_connectors_deployments:jj-seo-app manage_customers:jj-seo-app introspect_oauth_tokens:jj-seo-app manage_cart_discounts:jj-seo-app manage_sessions:jj-seo-app manage_import_containers:jj-seo-app manage_attribute_groups:jj-seo-app manage_my_quote_requests:jj-seo-app manage_my_orders:jj-seo-app view_api_clients:jj-seo-app manage_connectors:jj-seo-app manage_api_clients:jj-seo-app manage_products:jj-seo-app manage_associate_roles:jj-seo-app manage_payments:jj-seo-app create_anonymous_token:jj-seo-app manage_checkout_payment_intents:jj-seo-app manage_my_shopping_lists:jj-seo-app manage_orders:jj-seo-app manage_extensions:jj-seo-app manage_my_business_units:jj-seo-app manage_customer_groups:jj-seo-app manage_audit_log:jj-seo-app manage_business_units:jj-seo-app manage_product_selections:jj-seo-app view_messages:jj-seo-app view_audit_log:jj-seo-app manage_categories:jj-seo-app manage_my_quotes:jj-seo-app manage_order_edits:jj-seo-app manage_my_profile:jj-seo-app"