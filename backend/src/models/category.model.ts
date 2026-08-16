type CategoryModel = {
  id?: number;
  name: string;
  slug: string;
  parent_id: number;
  sort_order: number;
};

export default CategoryModel