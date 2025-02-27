import React, { useState, useEffect } from "react";
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
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { getUser } from "../api/usersAPI";
import { useMediaQuery } from "@mui/material";

const pages = ["Home", "Contact", "Dashboard", "Analytics"];
const settings = ["Profile", "Logout"];


function Navbar({ auth, onLogout }) {
  const isMobile = useMediaQuery("(max-width:600px)");
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [scrollToContact, setScrollToContact] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const user = jwtDecode(token);
        const id = user.user_id;
        const response = await getUser(id);
        if (response.data) {
          setUser(response.data.user);
        }
      }
    };
    fetchUser();
  }, [auth]);

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
        window.scrollTo(!isMobile ? {
          top: 650,
          behavior: "smooth",
        } : {
          top: 850,
          behavior: 'smooth',
        });
      }
      setScrollToContact(true);
      navigate("/home");
    }
    if (action === "D") {
      navigate("/dashboard");
      if (!auth) {
        toast.warn("Login first");
      }
    }
    if (action === "H") {
      navigate("/home");
    }
    if (action === "A") {
      if (!auth) {
        toast.warn("Login first");
      } else {
        navigate("/charts");
      }
    }
  };

  useEffect(() => {
    if (scrollToContact && location.pathname === "/home") {
      window.scrollTo(!isMobile ? {
        top: 650,
        behavior: "smooth",
      } : {
        top: 850,
        behavior: 'smooth',
      });
      setScrollToContact(false);
    }
  }, [location.pathname, scrollToContact, isMobile]);

  const handleCloseUserMenu = (setting) => {
    setAnchorElUser(null);
    if (setting === "Logout") {
      const token = localStorage.getItem("token");
      if (token) {
        localStorage.removeItem("token");
        toast.success("Good bye!");
        navigate("/");
        onLogout();
      }
    }

    if (setting === "Profile" && auth) {
      navigate("/profile");
    }
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
              href="/home"
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
            {auth && (
              <>
                <Box sx={{ flexGrow: 0 }}>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      {anchorElUser && user.first_name}
                      <Avatar>
                        {user.first_name
                          ? user.first_name[0].toUpperCase()
                          : "U"}
                      </Avatar>
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
                      <MenuItem
                        key={setting}
                        onClick={() => handleCloseUserMenu(setting)}
                      >
                        <Typography sx={{ textAlign: "center" }}>
                          {setting}
                        </Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </header>
  );
}
export default Navbar;
