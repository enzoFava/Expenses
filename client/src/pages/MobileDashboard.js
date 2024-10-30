import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Grid2,
  Typography,
  Container,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
  getExpenses,
  getIncomes,
  deleteIncome,
  deleteExpense,
} from "../api/expensesAPI";
import { jwtDecode } from "jwt-decode";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import AddIncomeDialog from "../components/dialogs/AddIncomeDialog";
import AddExpenseDialog from "../components/dialogs/AddExpenseDialog";
import EditExpenseDialog from "../components/dialogs/EditExpenseDialog";
import ConfirmDialog from "../components/dialogs/ConfirmDialog";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { toast } from "react-toastify";

ChartJS.register(ArcElement, Tooltip, Legend);

const MobileDashboard = () => {
  const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  };

  const [currentMonth, setCurrentMonth] = useState(
    getCurrentDate().split("-")[1]
  );
  const [openAdd, setOpenAdd] = useState(false);
  const [openIncome, setOpenIncome] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [monthIncome, setMonthIncome] = useState(0);
  const [monthOutcome, setMonthOutcome] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [openConfirm, setOpenConfirm] = useState({
    bool: false,
    type: "",
    id: null,
    title: "",
  });
  const [openEdit, setOpenEdit] = useState({ bool: false, transaction: null });
  const token = localStorage.getItem("token");
  const user = jwtDecode(token);

  const stringCurrentMonth = (currentMonth) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[parseInt(currentMonth, 10) - 1] || "Invalid Month";
  };

  const fetchExpenses = useCallback(async () => {
    try {
      const response = await getExpenses(user.user_id);
      const filteredExpenses = response.data.expenses.filter(
        (expense) =>
          expense.date.split("-")[1].padStart(2, "0") === currentMonth
      );
      setExpenses(filteredExpenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setExpenses([]);
    }
  }, [user.user_id, currentMonth]);

  const fetchIncomes = useCallback(async () => {
    try {
      const response = await getIncomes(user.user_id);
      const filteredIncomes = response.data.incomes.filter(
        (income) => income.date.split("-")[1].padStart(2, "0") === currentMonth
      );
      setIncomes(filteredIncomes);
    } catch (error) {
      console.error("Error fetching incomes:", error);
      setIncomes([]);
    }
  }, [user.user_id, currentMonth]);

  useEffect(() => {
    // if filter historic transactions everything

    const newTransactions = [
      ...expenses?.map((expense) => ({
        type: "exp",
        date: expense.date,
        expense,
      })),
      ...incomes?.map((income) => ({
        type: "inc",
        date: income.date,
        income,
      })),
    ];
    newTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    setTransactions(newTransactions);
  }, [expenses, incomes]);

  useEffect(() => {
    fetchExpenses();
    fetchIncomes();
  }, [fetchExpenses, fetchIncomes]);

  useEffect(() => {
    const incomeAmounts = incomes
      .filter((income) => income.date.split("-")[1] === currentMonth)
      .map((income) => parseInt(income.amount, 10) || 0);
    const totalIncome = incomeAmounts.reduce((sum, item) => sum + item, 0);
    setMonthIncome(totalIncome);

    const outcomeAmounts = expenses
      .filter((expense) => expense.date.split("-")[1] === currentMonth)
      .map((expense) => parseInt(expense.amount, 10) || 0);
    const totalOutcome = outcomeAmounts.reduce((sum, item) => sum + item, 0);
    setMonthOutcome(totalOutcome);
  }, [incomes, expenses, currentMonth]);

  const COLORS = [
    "rgba(255, 99, 132, 1)",
    "rgba(54, 162, 235, 1)",
    "rgba(325, 192, 162, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(153, 102, 255, 1)",
    "rgba(255, 159, 64, 1)",
    "rgba(201, 203, 207, 1)",
    "rgba(0, 255, 127, 1)",
  ];

  const groupedExpenses = expenses.reduce((acc, { category, amount }) => {
    acc[category] = (acc[category] || 0) + (parseFloat(amount) || 0);
    return acc;
  }, {});

  const labels = Object.keys(groupedExpenses);
  const dataValues = Object.values(groupedExpenses);
  const totalExpenses = dataValues.reduce((sum, value) => sum + value, 0);

  const labelsWithPercentage = labels.map((label, index) => {
    const percentage = ((dataValues[index] / totalExpenses) * 100).toFixed(2);
    return `${label} (${percentage}%)`;
  });

  const data = {
    labels: labelsWithPercentage,
    datasets: [
      {
        label: "Expenses ($)",
        data: dataValues,
        backgroundColor: COLORS.slice(0, labels.length),
      },
    ],
  };

  const handleToggle = () => {
    setIsTableVisible((prev) => !prev);
  };

  const onEdit = (transaction) => {
    setOpenEdit({ bool: true, transaction });
  };

  const onDelete = (id, title, type) => {
    setOpenConfirm({ bool: true, id, title, type });
  };

  const handleDelete = async (object) => {
    if (object.type === "exp") {
      try {
        const response = await deleteExpense(object.id, user.user_id);
        setOpenConfirm(false);
        toast.error("Expense deleted");
        if (response.status === 200) {
          fetchExpenses();
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const response = await deleteIncome(object.id, user.user_id);
        setOpenConfirm(false);
        toast.error("Income deleted");
        if (response.status === 200) {
          fetchIncomes();
        }
      } catch (error) {
        console.error(error);
        toast.warn("Error deleting");
      }
    }
  };

  return (
    <>
      <Box
        sx={{
          height: "90vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Grid2
          sx={{
            margin: "1%",
            display: "flex",
            height: "4%",
            marginTop: "20%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <ArrowBackIosIcon
            onClick={() =>
              setCurrentMonth(
                String(parseInt(currentMonth) - 1).padStart(2, "0")
              )
            }
          />
          <Typography
            variant="h5"
            sx={{ fontFamily: "Quicksand", fontWeight: 600, color: "#153316" }}
          >
            {stringCurrentMonth(currentMonth)}
          </Typography>
          <ArrowForwardIosIcon
            onClick={() =>
              setCurrentMonth(
                String(parseInt(currentMonth) + 1).padStart(2, "0")
              )
            }
          />
        </Grid2>

        <Grid2
          sx={{ height: "60%", width: "100%", margin: "auto", marginTop: "5%" }}
        >
          <Pie data={data} />
        </Grid2>

        <Container sx={{ display: "flex", justifyContent: "center" }}>
          <Typography
            sx={{
              width: "25%",
              margin: "5%",
              color: "red",
              fontFamily: "Quicksand, sans-serif",
              fontWeight: 600,
              fontSize: "1.2rem",
            }}
          >
            -$ {monthOutcome}
          </Typography>
          <Typography
            sx={{
              width: "25%",
              margin: "5%",
              color: "darkgreen",
              fontFamily: "Quicksand, sans-serif",
              fontWeight: 600,
              fontSize: "1.2rem",
            }}
          >
            +$ {monthIncome}
          </Typography>
        </Container>

        <Container sx={{ marginTop: "3%", paddingLeft: "1%" }}>
          <Typography
            sx={{
              textAlign: "center",
              color: "#153316",
              fontFamily: "Quicksand, sans-serif",
              fontWeight: 600,
              fontSize: "1.4rem",
            }}
          >
            {stringCurrentMonth(currentMonth)} budget: ${" "}
            {monthIncome - monthOutcome}
          </Typography>
        </Container>

        <Grid2
          size={12}
          sx={{
            margin: "1%",
            display: "flex",
            flexDirection: "row",
            height: "20%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <RemoveCircleIcon
            onClick={() => setOpenAdd(true)}
            sx={{
              marginRight: "3%",
              height: "100%",
              width: "25%",
              color: "red",
              "&:hover": { color: "darkred" },
            }}
          />
          <AddCircleIcon
            onClick={() => setOpenIncome(true)}
            sx={{
              marginLeft: "3%",
              height: "100%",
              width: "25%",
              color: "#4caf50",
              "&:hover": { color: "#388e3c" },
            }}
          />
        </Grid2>

        {/* Slider for Table with user data */}

        <Box
          sx={{
            position: "relative",
            minHeight: "100vh",
            paddingBottom: "10vh",
          }}
        >
          {/* Sliding Table Container */}
          <Box
            sx={{
              position: "fixed",
              bottom: isTableVisible ? "10%" : "-100%", // Slide in/out
              left: 0,
              width: "100%",
              height: "75vh",
              transition: "bottom 0.5s ease-in-out",
              backgroundColor: "white",
              boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
              overflowY: "auto",
            }}
          >
            {/* Close Button (Down Arrow) */}
            <Container
              sx={{ display: "flex", justifyContent: "end", padding: 1 }}
            >
              <IconButton onClick={handleToggle}>
                <KeyboardArrowDownIcon fontSize="large" />
              </IconButton>
            </Container>

            <TableContainer
              component={Paper}
              sx={{
                ...styles.tableContainer,
                overflowX: "auto",
                height: "100%",
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {["Transaction", "Amount ($)", "Edit", "Delete"].map(
                      (header) => (
                        <TableCell key={header} sx={{ ...styles.tableHeader }}>
                          {header}
                        </TableCell>
                      )
                    )}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {transactions.map((transaction) => {
                    const isExpense = transaction.type === "exp";
                    const item = isExpense
                      ? transaction.expense
                      : transaction.income;

                    return (
                      <TableRow key={item.id}>
                        {/* Transaction Column: Category, Date, and Title */}
                        <TableCell
                          sx={{ ...styles.tableCell, width: "40% !important", textAlign: "left", paddingLeft: '2% !important' }}
                        >
                          <span style={{ fontWeight: 700 }}>
                            {item.category}
                          </span>
                          &nbsp;|&nbsp;
                          <span>{stringCurrentMonth(currentMonth)}{new Date(item.date).getDate()}</span>
                          <br />
                          <span style={{ fontSize: "0.8rem", color: "#ccc" }}>
                            {item.title}
                          </span>
                        </TableCell>

                        {/* Amount Column */}
                        <TableCell
                          sx={{ ...styles.tableCell, width: "20% !important", textAlign: "center", fontSize: '1.1rem !important' }}
                        >
                          <span
                            style={{
                              color: isExpense ? "red" : "lightgreen",
                              marginRight: "4px",
                            }}
                          >
                            {isExpense ? "- $" : "+ $"}
                          </span>
                          <span style={{ color: "white" }}>{item.amount}</span>
                        </TableCell>

                        {/* Edit Button Column */}
                        <TableCell
                          sx={{ ...styles.tableCell, width: "20% !important", textAlign: "center" }}
                        >
                          <IconButton
                            sx={styles.editButton}
                            onClick={() => onEdit(transaction)}
                          >
                            <EditNoteIcon fontSize="medium" />
                          </IconButton>
                        </TableCell>

                        {/* Delete Button Column */}
                        <TableCell
                          sx={{ ...styles.tableCell, width: "20% !important", textAlign: "center" }}
                        >
                          <IconButton
                            sx={styles.deleteButton}
                            onClick={() =>
                              onDelete(item.id, item.title, transaction.type)
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Open Button (Up Arrow) - Only shows when table is hidden */}
          {!isTableVisible && (
            <Container
              sx={{ display: "flex", justifyContent: "end", padding: 2 }}
            >
              <IconButton onClick={handleToggle}>
                <KeyboardArrowUpIcon fontSize="large" />
              </IconButton>
            </Container>
          )}
        </Box>
      </Box>

      {/* Dialogs */}
      <AddExpenseDialog
        open={openAdd}
        close={() => setOpenAdd(false)}
        add={fetchExpenses}
      />
      <AddIncomeDialog
        open={openIncome}
        close={() => setOpenIncome(false)}
        add={fetchIncomes}
      />
      <EditExpenseDialog
        open={openEdit.bool}
        close={() => setOpenEdit({ bool: false })}
        edit={[fetchExpenses, fetchIncomes]}
        transaction={openEdit.transaction}
      />
      <ConfirmDialog
        open={openConfirm.bool}
        closeDialog={() => setOpenConfirm({ bool: false })}
        title={openConfirm.title}
        deleteFunction={() => handleDelete(openConfirm)}
      />
    </>
  );
};

const styles = {
  tableContainer: {
    backgroundColor: "#2c2c2c",
    height: "calc(80vh - 25vh)",
    overflowY: "auto",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
    marginBottom: "1rem", // Space between table and other content
  },
  tableHeader: {
    color: "#fff",
    backgroundColor: "#2c2c2c",
    fontWeight: 900,
    fontSize: "1rem", // Slightly smaller for mobile readability
    fontFamily: "Quicksand, sans-serif",
    whiteSpace: "nowrap", // Prevent header text wrapping
    textAlign: "center", // Align headers properly
  },
  tableCell: {
    color: "#fff",
    fontFamily: "Quicksand, sans-serif",
    fontSize: "1.1rem",
    padding: "8px",
    textAlign: "center",
    whiteSpace: "nowrap",
    "@media (max-width: 600px)": {
      fontSize: "0.75rem", // Adjust font size for smaller phones
      padding: "4px", // Tighten padding
    },
  },
  editButton: {
    color: "lightgreen",
    "&:hover": { color: "green" },
    padding: "4px", // Smaller padding for better fit
  },
  deleteButton: {
    color: "red",
    "&:hover": { color: "rgb(142, 20, 20)" },
    padding: "4px", // Smaller padding for better fit
  },
};

export default MobileDashboard;
