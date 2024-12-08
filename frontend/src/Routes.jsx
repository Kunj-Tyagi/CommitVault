import React, { useEffect } from "react";
import { useNavigate, useRoutes } from "react-router-dom";

// Pages List
import Dashboard from "./Components/dashboard/Dashboard";
import Profile from "./Components/user/Profile";
import Login from "./Components/auth/Login";
import Signup from "./Components/auth/Signup";

// Auth Context
import { useAuth } from "./authContext";

const ProjectRoutes = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("userId");

    if (userIdFromStorage && !currentUser) {
      setCurrentUser(userIdFromStorage);
    }

    if (
      !userIdFromStorage &&
      !["/auth", "/signup"].includes(window.location.pathname)
    ) {
      navigate("/auth");
    }

    if (userIdFromStorage && window.location.pathname === "/auth") {
      navigate("/");
    }
  }, [currentUser, navigate, setCurrentUser]);

  let element = useRoutes([
    {
        path:"/",
        element:<Dashboard/>
    },
    {
        path:"/auth",
        element:<Login/>
    },
    {
        path:"/signup",
        element:<Signup/>
    },
    {
        path:"/profile",
        element:<Profile/>
    }
  ]);
  return element;
};

export default ProjectRoutes;
