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

export function validateTrackTitle(title: string): string {
  if (!title) {
    return "Title is required";
  } else if (title.length < 3 && title.length > 20) {
    return "Title must be between 3 and 20 characters";
  }
  return "";
}

export function validateTrackArtist(artist: string): string {
  if (!artist) {
    return "Artist is required";
  } else if (artist.length < 3 && artist.length > 20) {
    return "Artist must be between 3 and 20 characters";
  }
  return "";
}
