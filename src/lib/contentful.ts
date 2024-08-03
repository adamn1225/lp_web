import pkg from "contentful";
import type { EntryFields, Asset } from "contentful";
import dotenv from "dotenv";

dotenv.config();

const { createClient } = pkg;

const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
const spaceId = process.env.CONTENTFUL_SPACE_ID;

if (!accessToken) {
  throw new Error('Expected parameter accessToken');
}

const client = createClient({
  space: spaceId,
  accessToken: accessToken,
});

export const contentfulClient = client;

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

// Example function to fetch blog posts
export const fetchBlogPosts = async () => {
  try {
    const entries = await client.getEntries<BlogPost>({
      content_type: "landingPageblog",
    });
    return entries.items;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    throw error;
  }
};