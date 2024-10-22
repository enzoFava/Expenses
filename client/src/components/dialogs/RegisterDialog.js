import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  IconButton,
  DialogTitle,
  TextField,
  Zoom,
  CircularProgress,
} from "@mui/material";
import { register } from "../../api/usersAPI";
import { toast } from "react-toastify";

const RegisterDialog = ({ open, close, onLogin }) => {
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await register(user);
      const newUser = response.data;
      setLoading(false);
      toast.success(`Welcome ${newUser.user.first_name}!`);
      close(); ////////////////////////////////////////////////////////////////////////////////////////////
      localStorage.setItem("token", newUser.access);
      onLogin(newUser);
    } catch (error) {
      setLoading(false);
      if (error.status === 400) {
        console.error("Email already exists : " + error);
        toast.error("Email already exists. Try a different one");
      } else {
        console.error("Something went wrong" + error);
        toast.error("Something went worng");
      }
    }
  };

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      scroll="body"
      onClose={close}
      TransitionComponent={Zoom}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "10px",
          padding: "16px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
          width: "90%" /* Make dialog width responsive */,
          maxWidth: "500px" /* Limit maximum width */,
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <IconButton
          size="medium"
          onClick={close}
          sx={{
            position: "absolute",
            right: "1rem",
            top: "1rem",
            "&:hover": { background: "#fff", color: "black" },
          }}
        >
          X
        </IconButton>
        <DialogTitle
          sx={{
            fontFamily: "'Quicksand', sans-serif",
            fontWeight: "bold",
            fontSize: "1.5em",
            position: "relative",
            width: "80%",
          }}
        >
          Register
        </DialogTitle>
        <DialogContent sx={{ marginTop: 1 }}>
          <TextField
            name="first_name"
            label="First Name"
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            InputProps={{
              sx: { fontFamily: "'Quicksand', sans-serif" },
            }} // Custom Input styles
          />
          <TextField
            name="last_name"
            label="Last Name"
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            InputProps={{
              sx: { fontFamily: "'Quicksand', sans-serif" },
            }} // Custom Input styles
          />
          <TextField
            name="email"
            label="Email"
            type="email"
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            InputProps={{ sx: { fontFamily: "'Quicksand', sans-serif" } }} // Custom Input styles
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            InputProps={{ sx: { fontFamily: "'Quicksand', sans-serif" } }} // Custom Input styles
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "flex-end", padding: "16px" }}>
          <Button
            type="submit"
            sx={{
              fontFamily: "'Quicksand', sans-serif",
              backgroundColor: "#4caf50", // Example color for submit button
              "&:hover": {
                backgroundColor: "#388e3c", // Hover color
              },
            }}
            variant="contained"
          >
            {loading ? (
              <CircularProgress size="25px" color="white" />
            ) : (
              "Register"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RegisterDialog;
