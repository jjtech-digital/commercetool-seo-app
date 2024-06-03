import axios from 'axios';

export const createCtObjToken = async () => {
  try {
    const accessTokenUrl = `https://auth.australia-southeast1.gcp.commercetools.com/oauth/token?grant_type=client_credentials`;
    const basicAuth = Buffer.from(
      `DCPHZDYQ_wKThdKR_iEti3EP:GWq7MCknLhc-Oiu5oLebXqHNMac3zJ85`
    ).toString('base64');
    const requestBody = new URLSearchParams();
    requestBody.append('grant_type', 'client_credentials'); // Use the appropriate grant type
    requestBody.append(
      'scope',
      'manage_discount_codes:jj-seo-app manage_project:jj-seo-app manage_my_payments:jj-seo-app manage_connectors_deployments:jj-seo-app manage_customers:jj-seo-app introspect_oauth_tokens:jj-seo-app manage_cart_discounts:jj-seo-app manage_sessions:jj-seo-app manage_import_containers:jj-seo-app manage_attribute_groups:jj-seo-app manage_my_quote_requests:jj-seo-app manage_my_orders:jj-seo-app view_api_clients:jj-seo-app manage_connectors:jj-seo-app manage_api_clients:jj-seo-app manage_products:jj-seo-app manage_associate_roles:jj-seo-app manage_payments:jj-seo-app create_anonymous_token:jj-seo-app manage_checkout_payment_intents:jj-seo-app manage_my_shopping_lists:jj-seo-app manage_orders:jj-seo-app manage_extensions:jj-seo-app manage_my_business_units:jj-seo-app manage_customer_groups:jj-seo-app manage_audit_log:jj-seo-app manage_business_units:jj-seo-app manage_product_selections:jj-seo-app view_messages:jj-seo-app view_audit_log:jj-seo-app manage_categories:jj-seo-app manage_my_quotes:jj-seo-app manage_order_edits:jj-seo-app manage_my_profile:jj-seo-app'
    );
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
