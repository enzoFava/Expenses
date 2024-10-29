import React, { useState, useEffect, useCallback } from "react";
import { Box, Grid2, Typography, Container } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { getExpenses, getIncomes } from "../api/expensesAPI";
import { jwtDecode } from "jwt-decode";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import AddIncomeDialog from "../components/dialogs/AddIncomeDialog";
import AddExpenseDialog from "../components/dialogs/AddExpenseDialog";

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
      </Box>

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
    </>
  );
};

export default MobileDashboard;
