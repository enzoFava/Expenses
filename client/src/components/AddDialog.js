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
  Select,
  FormControl,
  MenuItem,
  InputLabel,
} from "@mui/material";

const AddDialog = ({ open, close }) => {
      // GET TODAY DATE //
  const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const date = getCurrentDate();

  const [newExpense, setNewExpense] = useState({
    user: "",
    title: "",
    amount: "",
    category: "",
    date: date,
  });
  const [category, setCategory] = useState("");



  const handleCategory = (e) => {
    const selectedCat = e.target.value;
    setCategory(selectedCat)
    setNewExpense((prev) => ({ ...prev, category: selectedCat }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(newExpense);
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
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: "bold",
            fontSize: "1.5em",
            position: "relative",
            width: "80%",
          }}
        >
          Add New Expense
        </DialogTitle>
        <DialogContent sx={{ marginTop: 1 }}>
          <TextField
            name="title"
            label="Title"
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            InputProps={{ sx: { fontFamily: "'Montserrat', sans-serif" } }} // Custom Input styles
          />
          <TextField
            name="amount"
            label="Amount"
            type="number"
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            InputProps={{ sx: { fontFamily: "'Montserrat', sans-serif" } }} // Custom Input styles
          />
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Category</InputLabel>
            <Select
              onChange={handleCategory}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={category}
              label="Category"
            >
              <MenuItem value={"clothes"}>Clothes</MenuItem>
              <MenuItem value={"entertainment"}>Entertainment</MenuItem>
              <MenuItem value={"food"}>Food</MenuItem>
              <MenuItem value={"gifts"}>Gifts</MenuItem>
              <MenuItem value={"health"}>Health</MenuItem>
              <MenuItem value={"house"}>House</MenuItem>
              <MenuItem value={"pets"}>Pets</MenuItem>
              <MenuItem value={"transport"}>Transport</MenuItem>
            </Select>
          </FormControl>
          <TextField
            name="date"
            type="date"
            label="Select date"
            value={newExpense.date || date}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            InputProps={{ sx: { fontFamily: "'Montserrat', sans-serif" } }} // Custom Input styles
          />
          <Typography
            variant="body2"
            sx={{ fontFamily: "'Montserrat', sans-serif", marginTop: 2 }}
          >
            Don't have an account?{" "}
            <Button
              onClick={() => {
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
              fontFamily: "'Montserrat', sans-serif",
              backgroundColor: "#4caf50", // Example color for submit button
              "&:hover": {
                backgroundColor: "#388e3c", // Hover color
              },
            }}
            variant="contained"
          >
            Log In
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddDialog;
