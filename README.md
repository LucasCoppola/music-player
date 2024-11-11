# Music Player

## Overview

This is a music player where you can upload, organize, and play your own tracks.
The frontend is built with React and TypeScript, the backend uses NestJS with PostgreSQL.

## Features

### Storage

- **File System & Docker Volumes**:
  - Uses the file system for storing images and audio files.
  - The audio files are streamed to the client given its size, and the images are served directly.
  - In production, it uses Docker volumes to persist the data.

### Image Handling

- **Optimized Images**:
  - Images are compressed to reduce file size and optimize their quality.
  - Different image sizes are stored and served based on where they're being displayed (e.g., smaller
    versions for lists and larger ones for detailed views), improving performance and load times.

### User Authentication

- **JWT-based Authentication**: Secure login and authentication using JSON Web Tokens.

### Music Management

- **Upload Tracks**: Add your music to the server with support for various audio formats.
- **Track Playback**: Play tracks with basic controls, including play, pause, and skip.
- **Edit Tracks**: Modify track details such as title and artist.
- **Search Tracks**: Search for tracks by title or artist to quickly find your music.

### Playlist Management

- **Create Playlists**: Build and organize playlists to manage your music collection.
- **Add/Remove Tracks**: Easily add or remove tracks from your playlists.
- **Favorite Tracks**: Mark tracks as favorites.

### Responsive Design

- **Cross-Platform Compatibility**: Designed to work on desktop and mobile devices.

## Tech Stack

### Frontend

- **React**: For building user interfaces.
- **Vite**: For fast and efficient development.
- **Tailwind CSS**: For styling and responsive design.
- **TanStack Router**: For routing and navigation.
- **Shadcn/ui**: For UI components.
- **React Query**: For efficient data fetching and caching.

### Backend

- **NestJS**: For building scalable and maintainable server-side applications.
- **PostgreSQL**: For storing and managing data.
- **Fluent-FFmpeg**: For processing and handling audio files.
- **Sharp**: For image manipulation and optimization.

### DevOps

- **Docker**: For containerization and deployment.
- **GitHub Actions and GitHub Runners**: For CI/CD.
- **AWS EC2**: For hosting the application on a virtual private server.
