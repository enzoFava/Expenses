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
import { editTransaction } from "../../api/expensesAPI";
import { toast } from "react-toastify";

const EditDialog = ({ open, close, edit, transaction }) => {
  // GET TODAY DATE //
  const getCurrentDate = () => {
    const date = new Date();
    return date.toISOString();
  };
  const [updateTransaction, setUpdateTransaction] = useState(
    transaction
      ? transaction.expense
        ? transaction.expense
        : transaction.income
      : {}
  );
  const [category, setCategory] = useState(transaction ? (transaction.expense ? transaction.expense.category : transaction.income.category) : "");
  const token = localStorage.getItem("token");
  const user = jwtDecode(token);

  useEffect(() => {
    if (transaction) {
      if (transaction.type === "exp") {
        setUpdateTransaction({
          ...transaction.expense,
          date: transaction.expense.date,
        });
        setCategory(transaction.expense.category) // .split('T')[0]
      } else {
        setUpdateTransaction({
          ...transaction.income,
          date: transaction.income.date,
        });
        setCategory(transaction.income.category) // .split('T')[0]
      }
    }
  }, [transaction]);

  const handleCategory = (e) => {
    const selectedCat = e.target.value;
    setCategory(selectedCat);
    setUpdateTransaction((prev) => ({ ...prev, category: selectedCat }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateTransaction((prev) => {
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

      // For other inputs, return the updated object.
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const transactionWithType = {
      ...updateTransaction,
      type: transaction?.type || "unknown",
    };
    try {
      const response = await editTransaction(transactionWithType, user.user_id);
      console.log(response.data);
      const [fetchExpenses, fetchIncomes] = edit;
      fetchExpenses();
      fetchIncomes();
      close();
      toast.success("Updated!");
    } catch (error) {
      console.error("ERROR UPDATING EXP : " + error);
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
          Edit Transaction
        </DialogTitle>
        <DialogContent sx={{ marginTop: 1 }}>
          <TextField
            name="title"
            label="title"
            value={transaction ? updateTransaction.title : ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            InputProps={{ sx: { fontFamily: "'Quicksand', sans-serif" } }} // Custom Input styles
          />
          <TextField
            name="amount"
            label="Amount"
            value={transaction ? updateTransaction.amount : ""}
            type="float"
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
              value={category || ""}
              label="Category"
            >
              {transaction?.type === "exp"
                ? [
                    <MenuItem key="clothes" value="clothes">
                      Clothes
                    </MenuItem>,
                    <MenuItem key="entertainment" value="entertainment">
                      Entertainment
                    </MenuItem>,
                    <MenuItem key="food" value="food">
                      Food
                    </MenuItem>,
                    <MenuItem key="gifts" value="gifts">
                      Gifts
                    </MenuItem>,
                    <MenuItem key="health" value="health">
                      Health
                    </MenuItem>,
                    <MenuItem key="house" value="house">
                      House
                    </MenuItem>,
                    <MenuItem key="pets" value="pets">
                      Pets
                    </MenuItem>,
                    <MenuItem key="transport" value="transport">
                      Transport
                    </MenuItem>,
                  ]
                : [
                    <MenuItem key="salary" value="salary">
                      Salary
                    </MenuItem>,
                    <MenuItem key="deposits" value="deposits">
                      Deposits
                    </MenuItem>,
                    <MenuItem key="savings" value="savings">
                      Savings
                    </MenuItem>,
                    <MenuItem key="others" value="others">
                      Others
                    </MenuItem>,
                  ]}
            </Select>
          </FormControl>
          <TextField
            name="date"
            type="date"
            label="Select date"
            value={
              transaction && updateTransaction.date
                ? updateTransaction.date.split("T")[0]
                : getCurrentDate().split("T")[0]
            }
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
            Edit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditDialog;
