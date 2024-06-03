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
