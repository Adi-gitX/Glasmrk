import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';
import { MarkdownFile } from '../types';

const SECRET_KEY = 'glasmrk2024';
const STORAGE_KEY = 'markdown_files';
const AUTH_KEY = 'admin_token';

export const generateEncryptedId = (): string => {
  const id = uuidv4();
  const encrypted = CryptoJS.AES.encrypt(id, SECRET_KEY).toString();
  return encrypted.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

export const decryptId = (encryptedId: string): string => {
  try {
    // Add padding if needed
    let restored = encryptedId.replace(/-/g, '+').replace(/_/g, '/');
    while (restored.length % 4) {
      restored += '=';
    }
    const bytes = CryptoJS.AES.decrypt(restored, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return '';
  }
};

export const saveFile = (file: Omit<MarkdownFile, 'id' | 'encryptedId' | 'createdAt'>): MarkdownFile => {
  const files = getFiles();
  const id = uuidv4();
  const encryptedId = generateEncryptedId();
  const newFile: MarkdownFile = {
    ...file,
    id,
    encryptedId,
    createdAt: new Date().toISOString()
  };
  
  files.push(newFile);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
  return newFile;
};

export const getFiles = (): MarkdownFile[] => {
  try {
    const files = localStorage.getItem(STORAGE_KEY);
    return files ? JSON.parse(files) : [];
  } catch {
    return [];
  }
};

export const getFileByEncryptedId = (encryptedId: string): MarkdownFile | null => {
  const files = getFiles();
  const foundFile = files.find(file => file.encryptedId === encryptedId);
  if (!foundFile) {
    // Try to find by decrypted ID as fallback
    const decryptedId = decryptId(encryptedId);
    return files.find(file => file.id === decryptedId) || null;
  }
  return foundFile;
};

export const deleteFile = (id: string): boolean => {
  const files = getFiles();
  const filteredFiles = files.filter(file => file.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredFiles));
  return filteredFiles.length < files.length;
};

export const saveAuthToken = (token: string): void => {
  localStorage.setItem(AUTH_KEY, token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_KEY);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem(AUTH_KEY);
};

// Demo admin credentials
export const ADMIN_CREDENTIALS = {
  email: 'admin@markdown.app',
  password: 'admin123'
};

export const generateToken = (): string => {
  return CryptoJS.AES.encrypt(`${ADMIN_CREDENTIALS.email}_${Date.now()}`, SECRET_KEY).toString();
};

export const validateToken = (token: string): boolean => {
  try {
    const bytes = CryptoJS.AES.decrypt(token, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted.includes(ADMIN_CREDENTIALS.email);
  } catch {
    return false;
  }
};