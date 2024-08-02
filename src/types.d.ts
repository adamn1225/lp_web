export interface BlogPostFields {
  heroTitle: string;
  content: string;
  date: string;
  mainBlogImage?: {
    fields: {
      file: {
        url: string;
      };
    };
  };
  slug: string;
}

export interface BlogPost {
  fields: BlogPostFields;
}


