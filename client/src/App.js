import React, { useState, useEffect } from "react";
import "./App.css";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Charts from "./pages/Charts";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import MobileDashboard from "./pages/MobileDashboard";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authUser, setAuthUser] = useState({});
  const isMobile = useMediaQuery("(max-width:600px)");


  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  function handleLogin(resUser) {
    setIsAuthenticated(true);
    setAuthUser(resUser);
  }

  function handleLogout() {
    setIsAuthenticated(false);
    setAuthUser({});
  }

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        path="/"
        element={<MainLayout auth={isAuthenticated} onLogout={handleLogout} />}
      >
        <Route
          index
          element={
            !isAuthenticated ? (
              <Home
                authUser={authUser}
                auth={isAuthenticated}
                onLogin={handleLogin}
              />
            ) : (
              isMobile ? <MobileDashboard /> : <Dashboard authUser={authUser} auth={isAuthenticated} />
            )
          }
        />
        <Route
          path="/home"
          element={<Home auth={isAuthenticated} onLogin={handleLogin} />}
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              isMobile ? <MobileDashboard authUser={authUser} auth={isAuthenticated}/> : <Dashboard authUser={authUser} auth={isAuthenticated} />
            ) : (
              <Home
                authUser={authUser}
                auth={isAuthenticated}
                onLogin={handleLogin}
              />
            )
          }
        />
        <Route path="/profile" element={<Profile auth={authUser} onLogout={handleLogout} />} />
        <Route path='/charts' element={ <Charts />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
