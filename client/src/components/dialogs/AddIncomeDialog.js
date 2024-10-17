import React, { useState, useEffect } from "react";
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
import { addIncome } from "../../api/expensesAPI";

const IncomeDialog = ({ open, close, add }) => {
  // GET TODAY DATE //
  const getCurrentDate = () => {
    const date = new Date();
    return date.toISOString();
  };


  const [newIncome, setNewIncome] = useState({
    title: "",
    amount: "",
    category: "",
    date: getCurrentDate(),
  });
  const [category, setCategory] = useState("");

  const token = localStorage.getItem("token");
  const user = jwtDecode(token);

  useEffect(() => {
    if (open) {
      setNewIncome((prev) => ({ ...prev, date: getCurrentDate()}))
    }
  },[open])

  const handleCategory = (e) => {
    const selectedCat = e.target.value;
    setCategory(selectedCat);
    setNewIncome((prev) => ({ ...prev, category: selectedCat }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewIncome((prev) => {
      // If the input being changed is "date", combine it with the original time.
      if (name === "date") {
        const originalTime = new Date(prev.date).toISOString().split("T")[1]; // Extract time part.
        const combinedDateTime = new Date(
          `${value}T${originalTime}`
        ).toISOString();
        return {
          ...prev,
          [name]: combinedDateTime,
        };
      }

      // For other inputs, update normally.
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addIncome(newIncome, user.user_id);
      console.log(response.data.newExpense);
      add();
      close();
    } catch (error) {
      console.error("ERROR ADDING INCOME : " + error);
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
            InputProps={{ sx: { fontFamily: "'Quicksand', sans-serif" } }} // Custom Input styles
          />
          <TextField
            name="amount"
            label="Amount"
            type="number"
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            InputProps={{ sx: { fontFamily: "'Quicksand', sans-serif" } }} // Custom Input styles
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
            value={newIncome.date.split("T")[0] || getCurrentDate().split("T")[0]}
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
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default IncomeDialog;
