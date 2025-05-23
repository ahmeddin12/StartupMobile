# Startup Calls Mobile App

A React Native/Expo mobile application for browsing and interacting with startup calls, accelerator programs, and innovation challenges.

## 🚀 Features

- **Startup Calls Browsing**: View a list of startup calls, accelerator programs, and innovation challenges
- **Call Details**: Get detailed information about each opportunity
- **User Authentication**: Secure login/registration with role-based access
- **Admin Dashboard**: Manage startup calls and applications
- **Dark/Light Theme**: Toggle between dark and light themes for better user experience
- **Drawer Navigation**: Easy access to all application features
- **Live API Integration**: Real-time data from backend APIs

## 📱 Screenshots

(Screenshots to be added)

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation (Stack, Tab, and Drawer navigators)
- **UI Components**: React Native Paper
- **API Client**: Axios
- **State Management**: React Context API
- **Storage**: AsyncStorage for local data persistence
- **Icons**: Expo Vector Icons

## 🏗️ Project Structure

```
mobile/
├── src/
│   ├── components/       # Reusable UI components
│   ├── contexts/         # React Context providers
│   ├── hooks/            # Custom React hooks
│   ├── navigation/       # Navigation configuration
│   ├── screens/          # App screens
│   ├── services/         # API services
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── assets/               # Images, fonts, etc.
├── App.tsx               # Main app component
└── index.ts              # Entry point
```

## ⚙️ Setup & Installation

1. **Prerequisites**:
   - Node.js (v14 or newer)
   - npm or yarn
   - Expo CLI: `npm install -g expo-cli`

2. **Installation**:
   ```bash
   # Clone the repository
   git clone <repository-url>
   
   # Navigate to the project directory
   cd mobile
   
   # Install dependencies
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**:
   Create a `.env` file in the root directory with the following variables:
   ```
   API_URL=http://localhost:3000/api
   ```

## 🚀 Running the App

```bash
# Start the development server
npm start
# or
yarn start
```

This will start the Expo development server. You can run the app on:
- Android Emulator
- iOS Simulator
- Physical device using the Expo Go app
- Web browser using `npm run web`

## 🔄 API Integration

The app connects to a Next.js backend API. Make sure the backend server is running at http://localhost:3000 or update the API_URL in the environment configuration.

## 📝 Drawer Menu Navigation

The app features a comprehensive drawer menu with the following options:
- Home
- Startup Calls
- Startups
- Sponsor Call
- Admin Dashboard
- Events
- Toggle Theme

## 👨‍💻 Development

### Adding New Screens

1. Create a new screen component in `src/screens/`
2. Add the screen to the appropriate navigator in `src/navigation/`
3. Update types in `src/types/` if necessary

### Authentication Flow

The app uses token-based authentication with roles:
- Admin
- Entrepreneur
- Sponsor
- Reviewer

## 📦 Building for Production

```bash
# Build for Android
expo build:android

# Build for iOS
expo build:ios
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
