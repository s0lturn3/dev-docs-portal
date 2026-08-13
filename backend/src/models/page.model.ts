type PageModel = {
  id: number;
  category_id: number;
  title: string;
  slug: string;
  content_md: string;
  created_by: number;
  updated_by?: number;
  created_at: Date;
  updated_at?: Date;
  
};

export default PageModel