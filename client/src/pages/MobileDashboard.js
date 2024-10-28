import React, { useState, useEffect, useCallback } from "react";
import { Box, Grid2, Container, Typography } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { getExpenses } from "../api/expensesAPI";
import { jwtDecode } from "jwt-decode";

const MobileDashboard = () => {
  ChartJS.register(ArcElement, Tooltip, Legend);
  const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  };

  const [currentMonth, setCurrentMonth] = useState(
    getCurrentDate().split("-")[1]
  );
  const [expenses, setExpenses] = useState([]);
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
    if (parseInt(currentMonth) >= 1 && parseInt(currentMonth) <= 12) {
      return months[parseInt(currentMonth, 10) - 1];
    } else if (parseInt(currentMonth) >= 12) {
      setCurrentMonth("12");
    } else {
      setCurrentMonth("01");
    }
  };

  const fetchExpenses = useCallback(async () => {
    try {
      const response = await getExpenses(user.user_id);

      const filteredExpenses = response.data.expenses.filter((expense) => {
        const expenseMonth = expense.date.split("-")[1].padStart(2, "0");
        return expenseMonth === currentMonth;
      });

      setExpenses(filteredExpenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setExpenses([]);
    }
  }, [user.user_id, currentMonth]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

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
        label: "Expenses",
        data: dataValues,
        backgroundColor: COLORS.slice(0, labels.length),
      },
    ],
  };

  return (
    <Box
      sx={{
        height: "90vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Grid2
        size={12}
        sx={{
          margin: "1%",
          display: "flex",
          flexDirection: "row",
          height: "4%",
          marginTop: "20%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <ArrowBackIosIcon
          onClick={() =>
            setCurrentMonth(
              String(parseInt(currentMonth, 10) - 1).padStart(2, "0")
            )
          }
        />
        <Typography
          variant="h5"
          sx={{
            fontFamily: "Quicksand, sans-serif",
            fontWeight: 600,
            color: "#153316",
          }}
        >
          {stringCurrentMonth(currentMonth)}
        </Typography>
        <ArrowForwardIosIcon
          onClick={() =>
            setCurrentMonth(
              String(parseInt(currentMonth, 10) + 1).padStart(2, "0")
            )
          }
        />
      </Grid2>

      <Grid2 size={12}>
        <Pie data={data} />
      </Grid2>
    </Box>
  );
};

export default MobileDashboard;
