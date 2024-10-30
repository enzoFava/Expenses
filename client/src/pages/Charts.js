import React, { useState, useEffect } from "react";
import { getUser } from "../api/usersAPI";
import { getExpenses, getIncomes } from "../api/expensesAPI";
import { jwtDecode } from "jwt-decode";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Chart } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";

const Charts = () => {
  const isMobile = useMediaQuery("(max-width:600px)");

  const outCat = [
    "clothes",
    "entertainment",
    "food",
    "gifts",
    "health",
    "house",
    "pets",
    "transport",
  ];
  const year = [
    "Jan",
    "Feb",
    "Mar",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const [user, setUser] = useState({});
  const [outcomes, setOutcomes] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const getCurrentDate = () => {
    const date = new Date();
    return date.toISOString();
  };
  const currentMonth = getCurrentDate().split("-")[1];
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

    return months[parseInt(currentMonth, 10) - 1];
  };
  const generateLabels = (currentMonth) => {
    const startMonth = parseInt(currentMonth, 10) - 4; // 3 months before
    const labels = [];

    for (let i = startMonth; i <= parseInt(currentMonth, 10) - 1; i++) {
      // Adjusting index to wrap around if it goes below 0 (e.g., 'January')
      const monthIndex = (i + 12) % 12;
      labels.push(
        stringCurrentMonth(String(monthIndex + 1).padStart(2, "0")).substring(
          0,
          3
        )
      );
    }

    return labels;
  };

  useEffect(() => {
    const onload = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        const user_id = decoded.user_id;
        const response = await getUser(user_id);
        if (response.data) {
          setUser(response.data.user);
        }
      }
    };
    onload();
  }, []);

  useEffect(() => {
    const onload = async () => {
      if (user) {
        try {
          const responseExp = await getExpenses(user.id);
          if (responseExp.data) {
            setOutcomes(responseExp.data.expenses);
          }
          const responseInc = await getIncomes(user.id);
          if (responseInc.data) {
            setIncomes(responseInc.data.incomes);
          }
        } catch (error) {
          console.error(error);
        }
      }
    };
    onload();
  }, [user]);

  const getMonthlySum = (data, month) => {
    if (!Array.isArray(data)) return 0;
    return data
      .filter((item) => item.date.split("-")[1] === month)
      .reduce((sum, item) => sum + parseInt(item.amount, 10), 0);
  };

  const getCategorySum = (data, month, category) => {
    if (!Array.isArray(data)) return 0;
    return data
      .filter(
        (item) =>
          item.date.split("-")[1] === month && item.category === category
      )
      .reduce((sum, item) => sum + parseInt(item.amount, 10), 0);
  };

  const getMonthlyTotals = (data) => {
    const monthlyTotals = Array(12).fill(0);

    data.forEach((item) => {
      const monthIndex = new Date(item.date).getMonth() - 1;
      monthlyTotals[monthIndex] += parseFloat(item.amount);
    });

    return monthlyTotals;
  };

  const budget =
    getMonthlyTotals(incomes).reduce((partialSum, a) => partialSum + a, 0) -
    getMonthlyTotals(outcomes).reduce((partialSum, a) => partialSum + a, 0);

  return (
    <>
      <Box
        sx={{
          height: "50%",
          width: "100%",
          marginTop: "7%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card
          sx={{
            height: "65%",
            width: "65%",
            opacity: "85%",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          <CardHeader
            title={
              <Typography
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  fontSize: "1.5rem",
                  fontWeight: "900",
                }}
              >
                Yearly Budget: {budget}
              </Typography>
            }
          />
          <CardContent sx={{ height: "80%", paddingTop: "0%" }}>
            <Line
              options={{
                elements: {
                  line: {
                    tension: 0.3,
                  },
                },
                responsive: true, // Makes the chart responsive
                maintainAspectRatio: false, // Allows the chart to stretch
              }}
              data={{
                labels: year,
                datasets: [
                  {
                    label: "incomes",
                    data: getMonthlyTotals(incomes),
                    backgroundColor: "lightgreen",
                    color: "lightgreen",
                    borderColor: "lightgreen",
                  },
                  {
                    label: "outcomes",
                    data: getMonthlyTotals(outcomes),
                    backgroundColor: "red",
                    color: "red",
                    borderColor: "red",
                  },
                ],
              }}
            />
          </CardContent>
        </Card>
      </Box>
      <Box
        sx={{
          height: "50%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
          marginTop: "2%",
        }}
      >
        <Card
          sx={{
            height: "65%",
            width: "30%",
            opacity: "85%",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          <CardHeader
            title={
              <Typography
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  fontSize: "1.5rem",
                  fontWeight: "900",
                }}
              >
                Last quarter balance:
              </Typography>
            }
          />
          <CardContent sx={{ height: "80%", paddingTop: "0%" }}>
            <Bar
              options={{
                responsive: true, // Makes the chart responsive
                maintainAspectRatio: false, // Allows the chart to stretch
              }}
              data={{
                labels: generateLabels(currentMonth),
                datasets: [
                  {
                    label: "Incomes",
                    backgroundColor: "lightgreen",
                    borderRadius: 4,
                    data: [
                      getMonthlySum(incomes, "07"),
                      getMonthlySum(incomes, "08"),
                      getMonthlySum(incomes, "09"),
                      getMonthlySum(incomes, "10"),
                    ],
                  },
                  {
                    label: "Outcomes",
                    backgroundColor: "red",
                    borderRadius: 4,
                    data: [
                      getMonthlySum(outcomes, "07"),
                      getMonthlySum(outcomes, "08"),
                      getMonthlySum(outcomes, "09"),
                      getMonthlySum(outcomes, "10"),
                    ],
                  },
                ],
              }}
            />
          </CardContent>
        </Card>

        {!isMobile && (
          <Card
            sx={{
              height: "65%",
              width: "30%",
              opacity: "85%",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
            }}
          >
            <CardHeader
              title={
                <Typography
                  sx={{
                    fontFamily: "Quicksand, sans-serif",
                    fontSize: "1.3rem",
                    fontWeight: "900",
                  }}
                >
                  {stringCurrentMonth(currentMonth)} expenses:
                </Typography>
              }
            />
            <CardContent sx={{ height: "80%", paddingTop: "0%" }}>
              <Doughnut
                options={{
                  responsive: true, // Makes the chart responsive
                  maintainAspectRatio: false, // Allows the chart to stretch
                  plugins: {
                    legend: {
                      position: "top", // Legend at top to save horizontal space
                      labels: { boxWidth: 12, padding: 10 },
                    },
                  },
                }}
                data={{
                  labels: outCat.map((cat) => cat),
                  datasets: [
                    {
                      label: "sum",
                      data: outCat.map((cat) =>
                        getCategorySum(outcomes, currentMonth, cat)
                      ),
                      borderRadius: 7,
                    },
                  ],
                }}
              />
            </CardContent>
          </Card>
        )}
      </Box>
    </>
  );
};

export default Charts;
