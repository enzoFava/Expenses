import React, { useState } from "react";
import {
  Container,
  Typography,
  Grid2,
  Box,
  Button,
  useMediaQuery,
} from "@mui/material";
import LoginDialog from "../components/dialogs/LoginDialog";
import RegisterDialog from "../components/dialogs/RegisterDialog";
import Contact from "./Contact";

const Home = ({ auth, onLogin, authUser }) => {
  const isMobileSmall = useMediaQuery("(max-width:600px)");
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);

  const handleAuth = (e) => {
    const action = e.target.value;

    if (action === "login") {
      setOpenLogin(true);
    }

    if (action === "register") {
      setOpenRegister(true);
    }
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh", // Use minHeight instead of height
          paddingBottom: isMobileSmall ? "10vh" : "5vh", // Add padding
          overflow: "hidden", // Prevent overflow issues
        }}
      >
        <Grid2
          container
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          sx={isMobileSmall && { ...responsiveStyle.grid }}
        >
          <Grid2 size={isMobileSmall ? 12 : 6}>
            <Container
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                margin: "3%",
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontFamily: "'Quicksand', sans-serif",
                  color: "#153316",
                  fontWeight: "900",
                }}
              >
                Take control of your money.
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  color: "#153316",
                  fontWeight: "600",
                  marginTop: "3%",
                }}
              >
                Expense Tracker is a personal finance application that makes
                money management easy. The app is designed to streamline expense
                tracking and help you save money.
              </Typography>
            </Container>
          </Grid2>
          <Grid2 size={isMobileSmall ? 12 : 6}>
            <Container
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-evenly",
                margin: "3%",
                height: "100%",
                width: "unset",
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontFamily: "'Quicksand', sans-serif", color: "#153316" }}
              >
                Register or Login to start.
              </Typography>
              <Container
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  value="register"
                  onClick={handleAuth}
                  sx={{
                    margin: "3%",
                    fontWeight: "600",
                    textDecoration: "none",
                    fontFamily: "'Quicksand', sans-serif",
                    padding: "6px 16px",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                    color: "#153316",
                    backgroundColor: "#b9eeba",
                    "&:hover": {
                      backgroundColor: "#4caf50",
                    },
                    fontSize: isMobileSmall ? "0.9rem" : "1rem",
                  }}
                >
                  Register
                </Button>
                <Button
                  value="login"
                  onClick={handleAuth}
                  sx={{
                    margin: "3%",
                    fontWeight: "600",
                    textDecoration: "none",
                    fontFamily: "'Quicksand', sans-serif",
                    padding: "6px 16px",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                    color: "#153316",
                    backgroundColor: "#b9eeba",
                    "&:hover": {
                      backgroundColor: "#4caf50",
                    },
                    fontSize: isMobileSmall ? "0.9rem" : "1rem",
                  }}
                >
                  Login
                </Button>
              </Container>
            </Container>
          </Grid2>
        </Grid2>
      </Box>

      <Box
        sx={{
          marginTop: "5vh", // Ensure spacing between Home and Contact
        }}
      >
        <Contact />
      </Box>

      <LoginDialog
        open={openLogin}
        close={() => setOpenLogin(false)}
        register={() => setOpenRegister(true)}
        auth={auth}
        onLogin={onLogin}
      />
      <RegisterDialog
        open={openRegister}
        close={() => setOpenRegister(false)}
        auth={auth}
        onLogin={onLogin}
      />
    </>
  );
};

export default Home;

const responsiveStyle = {
  box: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  },
  grid: {
    marginTop: "10%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
};
