export class PageModel {
  public id: number = 0;
  public category_id: number = 0;
  public title: string = '';
  public slug: string = '';
  public content_md: string = '';
  public created_by: number = 0;
  public updated_by?: number;
  public created_at: Date = new Date();
  public updated_at?: Date;
}