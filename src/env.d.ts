/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SECRET_ACCESS_TOKEN: string;
  readonly CLIENT_ID: string;
  readonly CLIENT_SECRET: string;
  readonly CONTENTFUL_SPACE_ID: string;
  readonly CONTENTFUL_DELIVERY_TOKEN: string;
  readonly CONTENTFUL_PREVIEW_TOKEN: string;
  readonly CONTENTFUL_ACCESS_TOKEN: string;
  readonly VITE_API_TOKEN: string;
  readonly GOOGLE_MAPS_API_KEY: string;
  readonly NOETICS_CMS_API_URL: string;
  readonly DG_CMS__TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}