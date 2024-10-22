import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  IconButton,
  DialogTitle,
  TextField,
  Typography,
  Zoom,
  CircularProgress,
} from "@mui/material";
import { login } from "../../api/usersAPI";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LoginDialog = ({ open, close, register, onLogin }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const response = await login(user);
      const resUser = response.data;
      setLoading(false)
      toast.success(`Welcome ${resUser.first_name}!`);
      close(); ///////////////////////////////////////////////////////////////////////////////////
      localStorage.setItem("token", resUser.access);
      onLogin(resUser);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Incorrect email or password");
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
          Log In
        </DialogTitle>
        <DialogContent sx={{ marginTop: 1 }}>
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
          <Typography
            variant="body2"
            sx={{ fontFamily: "'Quicksand', sans-serif", marginTop: 2 }}
          >
            Don't have an account?{" "}
            <Button
              onClick={() => {
                register();
                close();
              }}
              sx={{
                textDecoration: "underline",
                padding: 0,
                color: "#3f51b5", // Change this to your desired color
                "&:hover": {
                  color: "#303f9f", // Hover color
                },
              }}
            >
              Register
            </Button>
          </Typography>
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
            {loading ? <CircularProgress size='25px' color='white'/> : 'Log In'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LoginDialog;
