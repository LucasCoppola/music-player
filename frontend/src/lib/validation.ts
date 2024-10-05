export function validateEmail(email: string): string {
  if (!/\S+@\S+\.\S+/.test(email)) {
    return "Please enter a valid email address";
  }
  return "";
}

export function validatePassword(password: string): string {
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  return "";
}

export function validateUsername(username: string): string {
  if (username.length < 3) {
    return "Username must be at least 3 characters long";
  }
  return "";
}
