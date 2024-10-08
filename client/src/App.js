import React from "react";
import NavBar from "./components/Navbar";
import "./App.css";
import Home from "./components/pages/Home";
import Contact from './components/pages/Contact'

function App() {
  return (
    <>
      <NavBar />
      <Home />
      <Contact />
    </>
  );
}

export default App;
