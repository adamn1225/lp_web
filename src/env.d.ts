/// <reference path="../.astro/types.d.ts" />
///<reference types="astro/client" />

interface ImportMetaEnv {
  readonly SECRET_ACCESS_TOKEN: string;
  readonly CLIENT_ID: string;
  readonly CLIENT_SECRET: string;
  readonly CONTENTFUL_SPACE_ID: string;
  readonly CONTENTFUL_DELIVERY_TOKEN: string;
  readonly CONTENTFUL_PREVIEW_TOKEN: string;
  readonly CONTENTFUL_ACCESS_TOKEN: string;
  // readonly SECRET_OPEN_PASSWORD: string;
  // readonly FIREBASE_PRIVATE_KEY_ID: string;
  // readonly FIREBASE_PRIVATE_KEY: string;
  // readonly FIREBASE_PROJECT_ID: string;
  // readonly FIREBASE_CLIENT_EMAIL: string;
  // readonly FIREBASE_CLIENT_ID: string;
  // readonly FIREBASE_AUTH_URI: string;
  // readonly FIREBASE_TOKEN_URI: string;
  // readonly FIREBASE_AUTH_CERT_URL: string
  // readonly FIREBASE_CLIENT_CERT_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  VITE_API_TOKEN: string;
}
