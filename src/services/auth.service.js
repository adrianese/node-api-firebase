export const authenticate = (email, password, user) =>
  email === user.email && password === user.password;
