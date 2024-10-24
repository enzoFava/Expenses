import {
  Button,
  Dialog,
  DialogContent,
  Fade,
  Grid,
  IconButton,
  Typography,
  TextField,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { Box } from "@mui/system";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import React, { forwardRef, useState } from "react";

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />;
});

function ConfirmDialog({
  open,
  closeDialog,
  title,
  deleteFunction,
  user,
  loading,
}) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const password = e.target.value;
    setPassword((prev) => ({ ...prev, password }));
  };

  return (
    <Dialog
      open={open}
      maxWidth="md"
      scroll="body"
      onClose={closeDialog}
      onBackdropClick={closeDialog}
      TransitionComponent={Transition}
    >
      <DialogContent sx={{ position: "relative" }}>
        <IconButton
          size="medium"
          onClick={closeDialog}
          sx={{
            position: "absolute",
            right: "1rem",
            top: "1rem",
            "&:hover": { background: "#fff", color: "black" },
          }}
        >
          X
        </IconButton>

        <Grid container spacing={2}>
          {" "}
          {/* Adjusted spacing for better responsiveness */}
          <Grid item xs={12}>
            <Box
              sx={{
                mb: 3,
                display: "flex",
                justifyContent: "flex-start",
                flexDirection: "column",
              }}
            >
              <Typography
                sx={{ fontFamily: "'Quicksand', sans-serif" }}
                variant="h5"
              >
                Delete {title}
              </Typography>
              <Typography
                sx={{ fontFamily: "'Quicksand', sans-serif" }}
                variant="body1"
              >
                Are you sure you want to delete {title}?
              </Typography>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}
          >
            {user && (
              <TextField
                required
                type={showPassword ? "text" : "password"}
                label="Enter your password"
                variant="outlined"
                onChange={(e) => handleChange(e)}
                InputProps={{
                  sx: {
                    height: "36px", // Match button height
                    padding: 0, // Remove extra padding
                    fontSize: "14px",
                    "&.Mui-focused fieldset": {
                      borderWidth: "2px", // Fix border width when focused
                    },
                    "& input:-webkit-autofill": {
                      WebkitBoxShadow: "0 0 0px 1000px white inset", // Remove yellow autofill background
                      transition: "background-color 5000s ease-in-out 0s", // Avoid flicker
                    },
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        onMouseDown={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  inputProps: {
                    style: {
                      height: "100%",
                      boxSizing: "border-box",
                      padding: "0 10px",
                    },
                  },
                }}
                InputLabelProps={{
                  sx: {
                    top: "-4px",
                    fontSize: "14px",
                    transform: "translate(14px, 12px) scale(1)",
                    "&.MuiInputLabel-shrink": {
                      transform: "translate(14px, -6px) scale(0.75)",
                    },
                  },
                }}
                sx={{
                  minWidth: "200px",
                  ".MuiOutlinedInput-root": {
                    height: "36px",
                    "& fieldset": {
                      borderColor: "gray",
                    },
                    "&:hover fieldset": {
                      borderColor: "black",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "blue",
                    },
                  },
                }}
              >
                ENTER PASSWORD
              </TextField>
            )}

            <Button
              sx={{ fontFamily: "'Quicksand', sans-serif" }}
              onClick={closeDialog}
              size="medium"
              variant="contained"
              color="primary"
            >
              Cancel
            </Button>
            <Button
              sx={{ fontFamily: "'Quicksand', sans-serif" }}
              onClick={() => {
                user ? deleteFunction(password) : deleteFunction();
                //toast.error(`${title} deleted`);
                //closeDialog();
              }}
              size="medium"
              variant="contained"
              color="error"
            >
              {loading ? (
                <CircularProgress size="25px" color="white" />
              ) : (
                "Delete"
              )}
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmDialog;
