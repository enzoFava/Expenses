import React from 'react'
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Toast from "../components/Toast";
import { Outlet } from "react-router-dom"

const MainLayout = ({auth}) => {
  return (
    <>
        <Navbar auth={auth}/>
        <Outlet />
        <Toast />
        <Footer />
    </>
  )
}

export default MainLayout