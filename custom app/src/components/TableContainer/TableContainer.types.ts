export interface LocaleType {
  locale: string;
  value: string;
}
export interface CategoriesType {
  name: string | null;
  slug: string | null;
}
export interface MasterDataCurrentType {
  masterVariant?: any;
  name?: string;
  nameAllLocales?: LocaleType[];
  title?: string | null;
  description?: string | null;
  categories?: CategoriesType[];
  metaTitle?: string | null;
  metaDescription?: string | null;
  keyFeatures?: string | null;
}
export interface MasterDataType {
  current: MasterDataCurrentType;
}
export interface IProduct {
  id: string;
  key: string;
  masterData: MasterDataType;
  version: number;
}
export interface IFetchrawData {
  data: IProduct[];
  limit: string;
  message: string;
  offset: string;
  status: number;
  total: number;
}

export interface IResponseFromAi {
  id: string | null | undefined;
  title?: string | null;
  description: string | null | undefined;
  version: number | null | undefined;
  keyFeatures?: string | null;
}

export enum NavItems {
  SEO = 'SEO',
  DESCRIPTION = 'Description',
}

