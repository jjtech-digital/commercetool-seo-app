export const getProductDetails = (): string => {
    return `
    query ($id: String, $Locale: Locale, $LocaleProjection:[Locale!]) {
      product(id: $id, localeProjection: $LocaleProjection) {
        id
        key
        masterData {
          current {
            name(locale: $Locale)
            nameAllLocales {
              locale
              value
            }
            metaTitle(locale: $Locale)
            metaDescription(locale: $Locale)
            metaTitleAllLocales {
              locale
              value
            }
            metaDescriptionAllLocales {
              locale
              value
            }
            categories {
              name(locale: $Locale)
              slug(locale: $Locale)
            }
          }
        }
        skus
      }
    }
      `;
  };