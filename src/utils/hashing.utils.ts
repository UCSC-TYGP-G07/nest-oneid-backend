import * as bcrypt from 'bcrypt';

// This function hashes a plain text password and returns the hashed password
export async function hashPassword(plainTextPassword: string): Promise<string> {
  const saltRounds = 10; // You can adjust the number of salt rounds as needed
  return bcrypt.hash(plainTextPassword, saltRounds);
}

// This function compares a plain text password with a hashed password and returns true if they match
export async function comparePasswords(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainTextPassword, hashedPassword);
}
