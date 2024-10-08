import React from 'react'
import {
    Dialog,
    DialogActions,
    DialogContent,
    Button,
    IconButton,
    DialogTitle,
    TextField,
    Zoom
  } from "@mui/material";

const RegisterDialog = ({ open, close }) => {
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
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: "bold",
            fontSize: "1.5em",
            position: "relative",
            width: "80%",
          }}
        >
        Register
        </DialogTitle>
        <DialogContent sx={{ marginTop: 1 }}>
          <form onSubmit={""}>
                <TextField
                  name="firstName"
                  label="First Name"
                  onChange={""}
                  fullWidth
                  margin="normal"
                  required
                  InputProps={{
                    sx: { fontFamily: "'Montserrat', sans-serif" },
                  }} // Custom Input styles
                />
                <TextField
                  name="lastName"
                  label="Last Name"
                  onChange={""}
                  fullWidth
                  margin="normal"
                  required
                  InputProps={{
                    sx: { fontFamily: "'Montserrat', sans-serif" },
                  }} // Custom Input styles
                />
            <TextField
              name="email"
              label="Email"
              type="email"
              onChange={""}
              fullWidth
              margin="normal"
              required
              InputProps={{ sx: { fontFamily: "'Montserrat', sans-serif" } }} // Custom Input styles
            />
            <TextField
              name="password"
              label="Password"
              type="password"
              onChange={""}
              fullWidth
              margin="normal"
              required
              InputProps={{ sx: { fontFamily: "'Montserrat', sans-serif" } }} // Custom Input styles
            />
          </form>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "flex-end", padding: "16px" }}>
          <Button
            type="submit"
            onClick={""}
            sx={{
              fontFamily: "'Montserrat', sans-serif",
              backgroundColor: "#4caf50", // Example color for submit button
              "&:hover": {
                backgroundColor: "#388e3c", // Hover color
              },
            }}
            variant="contained"
          >
            Register
          </Button>
        </DialogActions>
      </Dialog>
  )
}

export default RegisterDialog