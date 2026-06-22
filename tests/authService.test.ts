import {
  DUMMY_ADMIN_EMAIL,
  DUMMY_ADMIN_PASSWORD,
  validateAdminCredentials,
} from '../src/features/auth/services/authService.js';

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

assert(validateAdminCredentials(DUMMY_ADMIN_EMAIL, DUMMY_ADMIN_PASSWORD), 'dummy admin credential logs in');
assert(validateAdminCredentials(' ADMIN@SUMA.TEST ', DUMMY_ADMIN_PASSWORD), 'email is normalized before validation');
assert(!validateAdminCredentials(DUMMY_ADMIN_EMAIL, 'wrong-password'), 'wrong password is rejected');
assert(!validateAdminCredentials('customer@suma.test', DUMMY_ADMIN_PASSWORD), 'non-admin email is rejected');
