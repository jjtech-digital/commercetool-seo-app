// Make sure to import the helper functions from the `ssr` entry point.
export const apiBaseUrl = 'https://ct-custom-seo-be.vercel.app';

export const titlePattern = /(SEO Title:|Title:)\s*(.+)/;
export const descriptionPattern = /(SEO Description:|Description:)\s*(.+)/;

// tslint:disable-next-line:S5852
export const normalDescPattern =
  /\*Description\*:\s*([^*]+)\s*\*Key Features\*:/s;
  
export const featuresPattern = /\*Key Features\*:\s*(.+)/s;

export const LS_KEY = {
  CT_OBJ_TOKEN: 'token',
  OPEN_AI_KEY: 'openAIKey',
};

export const CTP_CUSTOM_OBJ_SEO_CONTAINER_NAME = 'ct-seo-container';
export const CTP_CUSTOM_OBJ_SEO_CONTAINER_KEY = 'ct-seo-key';

export const CTP_CUSTOM_OBJ_DESCRIPTION_CONTAINER_NAME =
  'ct-description-container';
export const CTP_CUSTOM_OBJ_DESCRIPTION_CONTAINER_KEY = 'ct-description-key';

export const CTP_CUSTOM_OBJ_KEYFEATURES_CONTAINER_NAME =
  'ct-keyFeatures-container';
export const CTP_CUSTOM_OBJ_KEYFEATURES_CONTAINER_KEY = 'ct-keyFeatures-key';

export const CTP_CUSTOM_OBJ_AI_CONTAINER_NAME = 'ct-seo-ai-container';
export const CTP_CUSTOM_OBJ_AI_CONTAINER_KEY = 'ct-seo-ai-key';

