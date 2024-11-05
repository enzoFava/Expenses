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
    setPassword(e.target.value);
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
          <Grid item xs={12}>
            <Box
              sx={{
                mb: 3,
                display: "flex",
                justifyContent: "flex-start",
                flexDirection: "column",
              }}
            >
              <Typography sx={{ fontFamily: "'Quicksand', sans-serif" }} variant="h5">
                Delete {title}
              </Typography>
              <Typography sx={{ fontFamily: "'Quicksand', sans-serif" }} variant="body1">
                Are you sure you want to delete {title}?
              </Typography>
            </Box>
          </Grid>

          {user && (
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { xs: "center", md: "flex-end" },
                justifyContent: { xs: "center", md: "flex-end" },
                gap: "1rem",
              }}
            >
              <TextField
                required
                type={showPassword ? "text" : "password"}
                label="Enter your password"
                variant="outlined"
                onChange={handleChange}
                InputProps={{
                  sx: {
                    height: "36px",
                    padding: 0,
                    fontSize: "14px",
                    "&.Mui-focused fieldset": {
                      borderWidth: "2px",
                    },
                    "& input:-webkit-autofill": {
                      WebkitBoxShadow: "0 0 0px 1000px white inset",
                      transition: "background-color 5000s ease-in-out 0s",
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
              />

              <Box
                sx={{
                  display: "flex",
                  gap: "1rem",
                  mt: { xs: 2, md: 0 }, // Add top margin on mobile for spacing
                  justifyContent: { xs: "center", md: "flex-end" },
                }}
              >
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
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmDialog;
