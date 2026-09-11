export class CategoryModel {
  public id?: number;
  public name: string = '';
  public slug: string = '';
  public parent_id: number = 0;
  public sort_order: number = 0;
}