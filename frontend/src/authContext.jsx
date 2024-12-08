import React, { createContext, useState, useEffect, useContext } from "react";

// Value jo throughout the application use hogi
const AuthContext = createContext();

// Custom hook banaya hai-joh hum use karenge throughout the application
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setCurrentUser(userId);
    }
  }, []);

  const value = {
    currentUser,
    setCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// AuthContext is created using createContext() and acts like a "store" to share authentication-related data (e.g., currentUser) across different components in your application, without needing to pass it through props manually.

// useAuth() is a custom hook that returns the AuthContext value. You can use this hook in any component to access the currentUser and setCurrentUser values.

// AuthProvider is a component that wraps the entire application and provides the AuthContext value to its children. It initializes the currentUser state based on the userId stored in localStorage, if available.

//  How does AuthProvider work?

// useState for User Data:
// currentUser keeps track of the currently logged-in user.
// setCurrentUser is a function to update the user data.

// Retrieve User from Local Storage:
// In useEffect, the app checks localStorage for a saved userId when it loads.
// If a userId exists, it assumes the user is logged in and sets currentUser to that userId.

// Provide Data and Functions:
// The value object contains currentUser (current user data) and setCurrentUser (to update the user data).
// This value is passed to the AuthContext.Provider, making it accessible to any component that uses useAuth().
