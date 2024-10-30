import React, { useState } from "react";
import {
  Container,
  Typography,
  Grid2,
  Box,
  Button,
  useMediaQuery,
  TextField,
} from "@mui/material";

const Contact = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [error, setError] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
  });

  const isMobile = useMediaQuery("(max-width:600px)");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError((prevError) => ({ ...prevError, [name]: false }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.firstName.trim() === "") {
      setError((prevError) => ({ ...prevError, firstName: true }));
      return;
    }

    if (formData.lastName.trim() === "") {
      setError((prevError) => ({ ...prevError, lastName: true }));
      return;
    }

    if (formData.email.trim() === "") {
      setError((prevError) => ({ ...prevError, email: true }));
      return;
    }

    if (formData.password.trim() === "") {
      setError((prevError) => ({ ...prevError, password: true }));
      return;
    }

    // IF THERE IS NO ERROR; CONTACT INFO LOGIC HERE:
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "85vh",
        }}
      >
        <Grid2 container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid2 size={12} sx={{ display: "flex" }}>
            <Container
              sx={
                isMobile ? {...responsiveStyle.container} :
                {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                margin: "3%",
              }}
            >
              <Typography
                variant= {isMobile ? 'h3' : "h2"}
                sx={{
                  fontFamily: "'Quicksand', sans-serif",
                  color: "#153316",
                  fontWeight: "900",
                }}
              >
                Contact us!
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  color: "#153316",
                  fontWeight: "600",
                }}
              >
                We're here to help and answer any questions you might have.
              </Typography>
              <form>
                <Container
                  sx={
                    isMobile ? {...responsiveStyle.form} :
                    {
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    margin: "3%",
                    width: "auto",
                  }}
                >
                  <Grid2 size={isMobile ? 12 : 6}>
                    <TextField
                      name="firstName"
                      label="First Name"
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                      required
                      variant="outlined"
                      InputProps={{
                        sx: { fontFamily: "'Quicksand', sans-serif" },
                      }} // Custom Input styles
                      error={error.firstName}
                      helperText={
                        error.firstName ? "First Name is required." : ""
                      }
                    />
                    <TextField
                      name="lastName"
                      label="Last Name"
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                      required
                      variant="outlined"
                      InputProps={{
                        sx: { fontFamily: "'Quicksand', sans-serif" },
                      }} // Custom Input styles
                      error={error.lastName}
                      helperText={
                        error.lastName ? "Last Name is required." : ""
                      }
                    />
                    <TextField
                      name="email"
                      label="Email"
                      type="email"
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                      required
                      variant="outlined"
                      InputProps={{
                        sx: { fontFamily: "'Quicksand', sans-serif" },
                      }} // Custom Input styles
                      error={error.email}
                      helperText={error.email ? "Email is required." : ""}
                    />
                    <TextField
                      name="password"
                      label="Password"
                      type="password"
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                      required
                      variant="outlined"
                      InputProps={{
                        sx: { fontFamily: "'Quicksand', sans-serif" },
                      }} // Custom Input styles
                      error={error.password}
                      helperText={error.password ? "Password is required." : ""}
                    />
                  </Grid2>

                  <Grid2 size={isMobile? 12 : 6} sx={{ alignSelf: "flex-start" }}>
                    <TextField
                      sx={{ marginBottom: "2%" }}
                      label="Enter your message"
                      multiline
                      rows={!isMobile ? 10.4 : 3}
                      fullWidth
                      margin="normal"
                      name="content"
                      required
                      variant="outlined"
                      onChange={handleChange}
                      error={error.content}
                      helperText={error.content ? "Content is required." : ""}
                    />
                  </Grid2>
                </Container>

                <Grid2
                  size={12}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Button
                    type="submit"
                    onClick={handleSubmit}
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
                    Send
                  </Button>
                </Grid2>
              </form>
            </Container>
          </Grid2>
        </Grid2>
      </Box>
    </>
  );
};

export default Contact;

const responsiveStyle = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    margin: "3%",
    width: "auto",
    fontSize: '1rem',
    height: '89vh'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
};
