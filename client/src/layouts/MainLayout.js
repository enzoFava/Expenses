import React from 'react'
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Toast from "../components/Toast";
import { Outlet } from "react-router-dom"

const MainLayout = ({auth, onLogout}) => {
  return (
    <>
        <Navbar auth={auth} onLogout={onLogout}/>
        <Outlet />
        <Toast />
        <Footer />
    </>
  )
}

export default MainLayout