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

export const contentfulClient = createClient({
  space: import.meta.env.CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.DEV
    ? import.meta.env.CONTENTFUL_PREVIEW_TOKEN
    : import.meta.env.CONTENTFUL_DELIVERY_TOKEN,
  host: import.meta.env.DEV ? "preview.contentful.com" : "cdn.contentful.com",
});