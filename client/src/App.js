import React, { useState, useEffect } from "react";
import "./App.css";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
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
        console.log("auth");
      } else {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout auth={isAuthenticated}/>}>
        <Route index element={!isAuthenticated ? <Home auth={isAuthenticated}/> : <Dashboard auth={isAuthenticated}/>} />
        <Route path="/home" element={<Home auth={isAuthenticated}/>} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard auth={isAuthenticated} /> : <Home auth={isAuthenticated}/>} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
