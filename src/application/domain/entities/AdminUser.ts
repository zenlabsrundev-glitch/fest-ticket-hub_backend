export class AdminUser {
  id!: string;
  name!: string;
  email!: string;
  password!: string; // hashed
  createdAt!: Date;
  updatedAt!: Date;
}
