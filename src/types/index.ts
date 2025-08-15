export interface MarkdownFile {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  encryptedId: string;
}

export interface User {
  id: string;
  email: string;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}