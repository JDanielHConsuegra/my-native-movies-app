# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Project Description

This is a React Native mobile application built with Expo, designed as a movie discovery and management platform. The app allows users to browse, search, and save their favorite movies, with a focus on providing a seamless user experience across iOS and Android devices.

### Key Features

- **User Authentication**: Secure login and registration system powered by Appwrite, ensuring user data privacy and session management.
- **Movie Browsing**: Explore a curated collection of movies with detailed information, including ratings, descriptions, and posters.
- **Search Functionality**: Advanced search bar to find movies by title, genre, or keywords.
- **Favorites Management**: Users can save and manage their favorite movies for quick access.
- **Profile Management**: Personalized user profiles to view saved movies and account settings.
- **Dynamic Routing**: File-based routing for efficient navigation between screens, including individual movie detail pages.
- **Responsive UI**: Styled with NativeWind (Tailwind CSS for React Native) for a modern, responsive design.

### Tech Stack

- **Framework**: React Native with Expo for cross-platform development.
- **Language**: TypeScript for type safety and better developer experience.
- **Styling**: NativeWind (Tailwind CSS adaptation) for utility-first styling.
- **Backend**: Appwrite for authentication, database, and backend services.
- **State Management**: React Context for managing authentication and favorites state.
- **API Integration**: Custom hooks and services for fetching movie data from external APIs.
- **Navigation**: Expo Router for file-based routing and tab navigation.

### Project Structure

- `app/`: Main application screens and layouts, organized with file-based routing.
  - `(auth)/`: Authentication screens (login, register).
  - `(tabs)/`: Tab-based navigation (home, search, saved, profile).
  - `movies/`: Movie-related screens, including dynamic routes for individual movies.
- `components/`: Reusable UI components like MovieCard, SearchBar, and TabIcon.
- `contexts/`: React contexts for global state management (Auth and Favorites).
- `hooks/`: Custom hooks, including user authentication checks.
- `services/`: API services for data fetching and Appwrite integration.
- `assets/`: Images, icons, and fonts used in the app.
- `constants/`: Centralized constants for icons and images.

The app is currently in development, with ongoing tasks including UI refinements (e.g., back button styling, logo sizing), implementation of authentication flows, and debugging/testing phases.

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

# change back button

# reduce logo size

#hook que verifique si hay usuario logeado, sino, dirige a login
#pantalla de login
#pantalla de registro
#funcionalidades con appwrite de login y registro
#implementacion
#debugin y testeo
