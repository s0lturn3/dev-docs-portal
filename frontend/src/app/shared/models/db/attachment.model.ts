export class AttachmentModel {
  public id: number = 0;
  public page_id: number = 0;
  public file_name: string = '';
  public stored_name: string = '';
  public mime_type: string = '';
  public size_bytes: number = 0;
  public uploaded_by: number = 0;
  public created_at: Date = new Date();
}