export interface AdminUser {
  name: string;
  email: string;
  branch: string;
  role: 'admin';
}

export const AUTH_STORAGE_KEY = 'suma_dummy_admin_auth';
export const DUMMY_ADMIN_EMAIL = 'admin@suma.test';
export const DUMMY_ADMIN_PASSWORD = 'admin123';

export const DUMMY_ADMIN_USER: AdminUser = {
  name: 'Owner Suma',
  email: DUMMY_ADMIN_EMAIL,
  branch: 'Suma Barbershop - Cabang Utama',
  role: 'admin',
};

export function validateAdminCredentials(email: string, password: string) {
  return email.trim().toLowerCase() === DUMMY_ADMIN_EMAIL && password === DUMMY_ADMIN_PASSWORD;
}

export function readStoredAdmin(storage: Storage = window.localStorage): AdminUser | null {
  const rawValue = storage.getItem(AUTH_STORAGE_KEY);
  if (!rawValue) return null;

  try {
    const parsed = JSON.parse(rawValue) as AdminUser;
    return parsed?.role === 'admin' && parsed.email ? parsed : null;
  } catch {
    storage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function persistAdmin(user: AdminUser, storage: Storage = window.localStorage) {
  storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredAdmin(storage: Storage = window.localStorage) {
  storage.removeItem(AUTH_STORAGE_KEY);
}
