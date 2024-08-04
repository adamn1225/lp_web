import pkg from "contentful";
import type { EntryFields, Asset } from "contentful";

const { createClient } = pkg;

export interface BlogPost {
  contentTypeId: "landingPageblog";
  fields: {
    heroTitle: EntryFields.Text;
    slug: EntryFields.Text;
    content: EntryFields.RichText;
    date: EntryFields.Date;
    mainBlogImage?: {
      fields: {
        file: {
          url: string;
        };
      };
    };
  };
}

const spaceId = import.meta.env.CONTENTFUL_SPACE_ID || "your_space_id";
const previewToken = import.meta.env.CONTENTFUL_PREVIEW_TOKEN || "your_preview_token";
const deliveryToken = import.meta.env.CONTENTFUL_DELIVERY_TOKEN || "your_delivery_token";
const isDev = import.meta.env.DEV;

export const contentfulClient = createClient({
  space: spaceId,
  accessToken: isDev ? previewToken : deliveryToken,
  host: isDev ? "preview.contentful.com" : "cdn.contentful.com",
});