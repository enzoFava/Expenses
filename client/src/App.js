import React, { useState, useEffect } from "react";
import "./App.css";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  function handleLogin(){
    setIsAuthenticated(true)
  }

  function handleLogout() {
    setIsAuthenticated(false)
  }

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout auth={isAuthenticated} onLogout={handleLogout}/>}>
        <Route index element={!isAuthenticated ? <Home auth={isAuthenticated} onLogin={handleLogin}/> : <Dashboard auth={isAuthenticated}/>} />
        <Route path="/home" element={<Home auth={isAuthenticated} onLogin={handleLogin}/>} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard auth={isAuthenticated} /> : <Home auth={isAuthenticated} onLogin={handleLogin}/>} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
