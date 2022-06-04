import argon2 from 'argon2';
const hashPassword = async (password: string) => {
  const hash = await argon2.hash(password);
  return hash;
};
export default hashPassword;
