export class UserModel {
  public id?: number;
  public name: string = '';
  public email: string = '';
  public password_hash: string = '';
  public created_at: Date = new Date();
}