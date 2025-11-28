export interface User {
  id: string;
  email: string;
  name: string;

  // Implement authentication
  password: string;
  refreshToken?: string | null;

  createdAt: Date;
}
