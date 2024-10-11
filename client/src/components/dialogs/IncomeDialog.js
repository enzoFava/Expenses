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
  Select,
  FormControl,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { addIncome } from '../../api/expensesAPI'

const IncomeDialog = ({ open, close, add }) => {
  // GET TODAY DATE //
  const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const date = getCurrentDate();

  const [newIncome, setNewIncome] = useState({
    title: "",
    amount: "",
    category: "",
    date: date,
  });
  const [category, setCategory] = useState("");

  const token = localStorage.getItem("token");
  const user = jwtDecode(token);

  const handleCategory = (e) => {
    const selectedCat = e.target.value;
    setCategory(selectedCat);
    setNewIncome((prev) => ({ ...prev, category: selectedCat }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewIncome((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addIncome(newIncome, user.user_id);
      console.log(response.data.newExpense)
      close()
    } catch (error) {
      console.error("ERROR ADDING INCOME : " + error)
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
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: "bold",
            fontSize: "1.5em",
            position: "relative",
            width: "80%",
          }}
        >
          Add New Income
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
              <MenuItem value={"salary"}>Salary</MenuItem>
              <MenuItem value={"deposits"}>Deposits</MenuItem>
              <MenuItem value={"savings"}>Savings</MenuItem>
              <MenuItem value={"other"}>Other</MenuItem>
            </Select>
          </FormControl>
          <TextField
            name="date"
            type="date"
            label="Select date"
            value={newIncome.date || date}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            InputProps={{ sx: { fontFamily: "'Montserrat', sans-serif" } }} // Custom Input styles
          />
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
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default IncomeDialog;