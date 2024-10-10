import React, {useState, useEffect} from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { useNavigate, useLocation } from "react-router-dom";
import {toast} from "react-toastify";

const pages = ["Contact", "Dashboard"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

function Navbar({auth}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [scrollToContact, setScrollToContact] = useState(false);

 

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (e) => {
    setAnchorElNav(null);
    const action = e.target.innerHTML.split("")[0];
    if (action === "C") {
      const from = location.pathname;
      if (from === "/") {
        window.scrollTo({
          top: 900,
          behavior: "smooth",
        });
      }
      setScrollToContact(true)
      navigate('/home')
    }
    if (action === "D") {
      navigate("/dashboard");
      if (!auth) {
        toast.warn("Login first")
      }
    }
  };

  useEffect(() => {
    if (scrollToContact && location.pathname === '/home') {
      window.scrollTo({
        top: 900,
        behavior: "smooth",
      });
      setScrollToContact(false) 
    }
  },[location.pathname, scrollToContact])

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <header>
      <AppBar
        position="static"
        sx={{ backgroundColor: "#b9eeba", color: "#153316" }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/home"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "Quicksand, sans-serif",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Expenses Tracker
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: "block", md: "none" } }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography
                      sx={{
                        textAlign: "center",
                        fontFamily: "Quicksand, sans-serif",
                      }}
                    >
                      {page}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "Quicksand, sans-serif",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Tracker
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{
                    fontFamily: "Quicksand, sans-serif",
                    fontWeight: "600",
                    my: 2,
                    color: "#153316",
                    display: "block",
                    background: "transparent",
                    "&:hover": {
                      opacity: "40%",
                    },
                  }}
                >
                  {page}
                </Button>
              ))}
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography sx={{ textAlign: "center" }}>
                      {setting}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </header>
  );
}
export default Navbar;

// import React from "react";
// import "./Navbar.css";
// import { Typography, Button, useMediaQuery } from "@mui/material";

// const Navbar = () => {
//     const isMobile = useMediaQuery("(max-width:600px)");
//   return (
//     <header>
//       <Typography
//         sx={{
//           marginLeft: "1%",
//           color: "#153316",
//           fontFamily: '"Montserrat", sans-serif',
//           fontSize: isMobile ? "1.5rem" : "2rem"
//         }}
//       >
//         Expenses Tracker
//       </Typography>
//       <div className="navbar-button">
//         <Button
//           sx={{
//             textDecoration: "none",
//             fontFamily: "'Montserrat', sans-serif",
//             padding: "6px 12px",
//             boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
//             color: "#fff",
//             backgroundColor: "#4caf50",
//             "&:hover": {
//               backgroundColor: "#317434",
//             },
//             fontSize: isMobile ? "0.9rem" : "1rem", // Responsive font size
//           }}
//         >
//           Login
//         </Button>
//         <Button
//           sx={{
//             textDecoration: "none",
//             fontFamily: "'Montserrat', sans-serif",
//             padding: "6px 16px",
//             boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
//             color: "#fff",
//             backgroundColor: "#4caf50",
//             "&:hover": {
//               backgroundColor: "#317434",
//             },
//             fontSize: isMobile ? "0.9rem" : "1rem", // Responsive font size
//           }}
//         >
//           Register
//         </Button>
//       </div>
//     </header>
//   );
// };

// export default Navbar;
