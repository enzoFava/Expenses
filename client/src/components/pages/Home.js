import React, {useState, useEffect} from "react";
import {
  Container,
  Typography,
  Grid2,
  Box,
  Button,
  useMediaQuery,
  Dialog,
} from "@mui/material";
import LoginDialog from "../LoginDialog";
import RegisterDialog from "../RegisterDialog";
import axios from "axios";

const Home = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [ openLogin, setOpenLogin] = useState(false);
  const [ openRegister, setOpenRegister] = useState(false);

  useEffect(() => {
    const getUsers = async () => {
      const response = await axios.get('http://localhost:8000/users')
      console.log(response.data)
    }
    getUsers();
  })

  const handleAuth = (e) => {
    console.log(e.target.value);
    const action = e.target.value;

    if (action === "login") {
      setOpenLogin(true)
    }

    if (action === "register") {
      setOpenRegister(true)
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Grid2 container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid2 size={6}>
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
          <Grid2 size={6}>
            <Container
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-evenly",
                margin: "3%",
                height: "100%",
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
                    fontSize: isMobile ? "0.9rem" : "1rem", // Responsive font size
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
                    fontSize: isMobile ? "0.9rem" : "1rem", // Responsive font size
                  }}
                >
                  Login
                </Button>
              </Container>
            </Container>
          </Grid2>
        </Grid2>
      </Box>
      <LoginDialog open={openLogin} close={() => setOpenLogin(false)} register={() => setOpenRegister(true)}/>
      <RegisterDialog open={openRegister} close={() => setOpenRegister(false)}/>
    </>
  );
};

export default Home;
