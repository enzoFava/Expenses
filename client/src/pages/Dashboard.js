import React, { useState, useEffect } from "react";
import {
  MenuItem,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from "@mui/material";
import AddDialog from "../components/dialogs/AddDialog";
import IncomeDialog from "../components/dialogs/IncomeDialog";
import { getExpenses, getIncomes } from "../api/expensesAPI";
import { jwtDecode } from "jwt-decode";

const Dashboard = ({ authUser }) => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openIncome, setOpenIncome] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([])
  const token = localStorage.getItem("token");
  const user = jwtDecode(token);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await getExpenses(user.user_id);
        const expenses_list = response.data.expenses;
        setExpenses(expenses_list);
        console.log("EXPENSES : " + expenses)
      } catch (error) {
        console.log(error);
      }
    };
    const fetchIncomes = async () => {
      try {
        const response = await getIncomes(user.user_id);
        const incomes_list = response.data.incomes;
        setIncomes(incomes_list);
        console.log("INCOMES : " + incomes)
      } catch (error) {
        console.log(error)
      }
    }
    fetchExpenses();
    fetchIncomes(); 
  }, []);

  const handleAdd = (newExpense) => {
    setOpenAdd(true);
  };

  const handleIncome = () => {
    setOpenIncome(true);
  };

  return (
    <>
      <Box sx={{ display: "flex", height: "80vh", marginTop: "5%" }}>
        {/* Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              marginTop: "5%",
              width: 240,
              boxSizing: "border-box",
              backgroundColor: "transparent", // Dark background
              color: "#153316", // White text color
              border: "none",
            },
          }}
        >
          <List>
            <ListItem>
              <Typography
                variant="h6"
                sx={{
                  color: "#153316",
                  fontWeight: 700,
                  padding: "16px 0",
                  fontFamily: "Quicksand, sans-serif",
                }}
              >
                Actions
              </Typography>
            </ListItem>
            <Divider />
            <MenuItem
              sx={{
                "&:hover": { backgroundColor: "transparent", opacity: "40%" },
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  fontFamily: "Quicksand, sans-serif",
                  color: "#153316",
                }}
              >
                My Wallet
              </Typography>
            </MenuItem>
            <MenuItem
              onClick={handleAdd}
              sx={{
                "&:hover": { backgroundColor: "transparent", opacity: "40%" },
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  fontFamily: "Quicksand, sans-serif",
                  color: "#153316",
                }}
              >
                Add New Expenses
              </Typography>
            </MenuItem>
            <MenuItem
              onClick={handleIncome}
              sx={{
                "&:hover": { backgroundColor: "transparent", opacity: "40%" },
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  fontFamily: "Quicksand, sans-serif",
                  color: "#153316",
                }}
              >
                Add New Incomes
              </Typography>
            </MenuItem>
            <MenuItem
              sx={{
                "&:hover": { backgroundColor: "transparent", opacity: "40%" },
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  fontFamily: "Quicksand, sans-serif",
                  color: "#153316",
                }}
              >
                Charts
              </Typography>
            </MenuItem>
            <MenuItem
              sx={{
                "&:hover": { backgroundColor: "transparent", opacity: "40%" },
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  fontFamily: "Quicksand, sans-serif",
                  color: "#153316",
                }}
              >
                Settings
              </Typography>
            </MenuItem>
          </List>
        </Drawer>

        {/* Main content */}
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            backgroundColor: "#1e1e1e",
            opacity: "90%",
            color: "#fff",
            height: "80vh",
            overflow: "hidden",
            marginRight: "1%",
          }}
        >
          {/* Top Info */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 2,
              maxHeight: "20%",
            }}
          >
            <Card sx={{ backgroundColor: "#2c2c2c", width: "30%" }}>
              <CardContent sx={{ color: "white" }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 900,
                    fontFamily: "Quicksand, sans-serif",
                    fontSize: "1.5rem",
                  }}
                >
                  Total Budget
                </Typography>
                <Typography variant="h5">€ 5,525.00</Typography>
              </CardContent>
            </Card>
            <Card sx={{ backgroundColor: "#2c2c2c", width: "30%" }}>
              <CardContent sx={{ color: "white" }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 900,
                    fontFamily: "Quicksand, sans-serif",
                    fontSize: "1.5rem",
                  }}
                >
                  Month Outcome
                </Typography>
                <Typography variant="h5">€ 1,230.27</Typography>
              </CardContent>
            </Card>
            <Card sx={{ backgroundColor: "#2c2c2c", width: "30%" }}>
              <CardContent sx={{ color: "white" }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 900,
                    fontFamily: "Quicksand, sans-serif",
                    fontSize: "1.5rem",
                  }}
                >
                  Month Income
                </Typography>
                <Typography variant="h5">€ 3,250.03</Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Data Table */}
          <TableContainer
            component={Paper}
            sx={{
              backgroundColor: "#2c2c2c",
              height: "calc(80vh - 25vh)",
              overflowY: "auto",
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      color: "#fff",
                      backgroundColor: "#2c2c2c",
                      fontWeight: 900,
                      fontFamily: "Quicksand, sans-serif",
                      fontSize: "1.5rem",
                    }}
                  >
                    Title
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#fff",
                      backgroundColor: "#2c2c2c",
                      fontWeight: 900,
                      fontFamily: "Quicksand, sans-serif",
                      fontSize: "1.5rem",
                    }}
                  >
                    Amount ($)
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#fff",
                      backgroundColor: "#2c2c2c",
                      fontWeight: 900,
                      fontFamily: "Quicksand, sans-serif",
                      fontSize: "1.5rem",
                    }}
                  >
                    Category
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#fff",
                      backgroundColor: "#2c2c2c",
                      fontWeight: 900,
                      fontFamily: "Quicksand, sans-serif",
                      fontSize: "1.5rem",
                    }}
                  >
                    Date
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#fff",
                      backgroundColor: "#2c2c2c",
                      fontWeight: 900,
                      fontFamily: "Quicksand, sans-serif",
                      fontSize: "1.5rem",
                    }}
                  >
                    xx
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#fff",
                      backgroundColor: "#2c2c2c",
                      fontWeight: 900,
                      fontFamily: "Quicksand, sans-serif",
                      fontSize: "1.5rem",
                    }}
                  >
                    xa
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expenses.toReversed().map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell
                      sx={{
                        color: "#fff",
                        fontFamily: "Quicksand, sans-serif",
                      }}
                    >
                      {expense.title}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#fff",
                        fontFamily: "Quicksand, sans-serif",
                      }}
                    >
                      $ {expense.amount}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#fff",
                        fontFamily: "Quicksand, sans-serif",
                      }}
                    >
                      {expense.category}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#fff",
                        fontFamily: "Quicksand, sans-serif",
                      }}
                    >
                      {expense.date}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#fff",
                        fontFamily: "Quicksand, sans-serif",
                      }}
                    >
                      xx
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#fff",
                        fontFamily: "Quicksand, sans-serif",
                      }}
                    >
                      xa
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
      <AddDialog
        add={handleAdd}
        open={openAdd}
        close={() => setOpenAdd(false)}
      />
      <IncomeDialog
        add={handleIncome}
        open={openIncome}
        close={() => setOpenIncome(false)}
      />
    </>
  );
};

export default Dashboard;

/* <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Grid2 container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} size={12}>
          <Grid2 size={2}>
            <Container
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography>
                Container 1
              </Typography>
            </Container>
          </Grid2>
          <Grid2 size={10}>
            <Container
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography>
                Container 2
              </Typography>
            </Container>
          </Grid2>
      </Grid2>
    </Box> */
