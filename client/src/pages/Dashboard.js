import React, { useState, useEffect, useCallback, memo } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  IconButton,
  TableHead,
  TableRow,
  Paper,
  Link,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";
import AddExpenseDialog from "../components/dialogs/AddExpenseDialog";
import AddIncomeDialog from "../components/dialogs/AddIncomeDialog";
import ConfirmDialog from "../components/dialogs/ConfirmDialog";
import EditExpenseDialog from "../components/dialogs/EditExpenseDialog";
import {
  getExpenses,
  getIncomes,
  deleteExpense,
  deleteIncome,
} from "../api/expensesAPI";
import Sidebar from "../components/Sidebar";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const Dashboard = ({ authUser }) => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openIncome, setOpenIncome] = useState(false);
  const [openEdit, setOpenEdit] = useState({ bool: false, transaction: null });
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedTab, setSelectedTab] = useState("All");
  const [openConfirm, setOpenConfirm] = useState({
    bool: false,
    type: "",
    id: null,
    title: "",
  });

  
  const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); 
    return `${year}-${month}`;
  };

  const [monthBudget, setMonthBudget] = useState(0);
  const [filterMonth, setFilterMonth] = useState(getCurrentDate());
  const [filterCat, setFilterCat] = useState("all");

  const token = localStorage.getItem("token");
  const user = jwtDecode(token);


  const fetchExpenses = useCallback(async () => {
    try {
      const { data } = await getExpenses(user.user_id);
      setExpenses(
        filterCat !== 'all' ?
        data.expenses.filter(
          (expense) => expense.date.split("-")[1] === filterMonth.split("-")[1] && expense.category === filterCat
        ) :
        data.expenses.filter(
          (expense) => expense.date.split("-")[1] === filterMonth.split("-")[1]
        )
      );
    } catch (error) {
      console.error(error);
      setExpenses([]);
    }
  }, [user.user_id, filterMonth, filterCat]);

  const fetchIncomes = useCallback(async () => {
    try {
      const { data } = await getIncomes(user.user_id);
      setIncomes(
        filterCat !== 'all' ?
        data.incomes.filter(
          (income) => income.date.split("-")[1] === filterMonth.split("-")[1] && income.category === filterCat // add cat filter
        ) :
        data.incomes.filter(
          (income) => income.date.split("-")[1] === filterMonth.split("-")[1]
        )
      );
    } catch (error) {
      console.error(error);
      setIncomes([]);
    }
  }, [user.user_id, filterMonth, filterCat]);

  useEffect(() => {
    fetchExpenses();
    fetchIncomes();
  }, [fetchExpenses, fetchIncomes]);

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
  }, [expenses, incomes, filterMonth, filterCat]);

  useEffect(() => {
    const totalExpenses = sumAmounts(expenses);
    const totalIncomes = sumAmounts(incomes);
    setMonthBudget(totalIncomes - totalExpenses);
  }, [expenses, incomes]);

  const handleDelete = async (object) => {
    if (object.type === "exp") {
      try {
        const response = await deleteExpense(object.id, user.user_id);
        setOpenConfirm(false)
        toast.error('Expense deleted')
        if (response.status === 200) {
          fetchExpenses();
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const response = await deleteIncome(object.id, user.user_id);
        setOpenConfirm(false)
        toast.error('Income deleted')
        if (response.status === 200) {
          fetchIncomes();
        }
      } catch (error) {
        console.error(error);
        toast.warn('Error deleting')
      }
    }
  };

  const sumAmounts = (items) =>
    items.reduce((acc, item) => acc + parseFloat(item.amount), 0);

  return (
    <>
      <Box sx={{ display: "flex", height: "80vh", marginTop: "5%" }}>
        <Sidebar
          onAddExpense={() => setOpenAdd(true)}
          onAddIncome={() => setOpenIncome(true)}
          onCatChange={(e) => setFilterCat(e.target.value)}
          onMonthChange={(e) => setFilterMonth(e.target.value)}
          filterMonth={filterMonth}
          filterCat={filterCat}
        />

        <Box sx={styles.mainContent}>
          <InfoCards
            monthBudget={monthBudget}
            totalExpenses={sumAmounts(expenses)}
            totalIncomes={sumAmounts(incomes)}
          />
          <ExpenseTable
            expenses={expenses}
            incomes={incomes}
            transactions={transactions}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            onEdit={(transaction) => setOpenEdit({ bool: true, transaction })}
            onDelete={(id, title, type) =>
              setOpenConfirm({ bool: true, id, title, type })
            }
          />
        </Box>
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

const InfoCards = memo(({ monthBudget, totalExpenses, totalIncomes }) => (
  <Box sx={styles.infoCardsContainer}>
    <InfoCard
      title="Total Budget"
      value={monthBudget}
      isNegative={monthBudget < 0}
    />
    <InfoCard title="Total Outcome" value={totalExpenses} />
    <InfoCard sx={{ textAlign: 'center'}} title="Total Income" value={totalIncomes} />
  </Box>
));

const InfoCard = memo(({ title, value, isNegative }) => (
  <Card sx={styles.infoCard}>
    <CardContent sx={{textAlign: 'center'}}>
      <Typography variant="h6" sx={styles.cardTitle}>
        {title}
      </Typography>
      <Typography variant="h5" sx={{ color: isNegative ? "red" : "inherit" }}>
        $ {value}
      </Typography>
    </CardContent>
  </Card>
));

const ExpenseTable = memo(
  ({
    incomes,
    expenses,
    onEdit,
    onDelete,
    transactions,
    selectedTab,
    setSelectedTab,
  }) => (
    <TableContainer component={Paper} sx={styles.tableContainer}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {["All", "Expenses", "Incomes"].map((tab) => (
              <TableCell
                key={tab}
                colSpan={2}
                sx={{
                  ...styles.tableHeader,
                  margin: 0,
                  padding: 0,
                  border: "solid",
                  textAlign: "center",
                  width: `${100 / 3}%`,
                }}
              >
                <Link
                  onClick={() => setSelectedTab(tab)}
                  sx={{
                    textDecoration: "none",
                    color: selectedTab === tab ? "white" : "#153316",
                    background: selectedTab === tab ? "#153316" : "#b9eeba",
                    cursor: "pointer",
                    display: "block", // Make the link take full width and height
                    width: "100%",
                    height: "100%",
                    "&:hover": {
                      backgroundColor: "#275b29",
                      color: "white",
                    },
                  }}
                >
                  {tab}
                </Link>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableHead>
          <TableRow>
            {["Title", "Amount ($)", "Category", "Date", "Edit", "Delete"].map(
              (header) => (
                <TableCell key={header} sx={{ ...styles.tableHeader }}>
                  {header}
                </TableCell>
              )
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {(selectedTab === "All"
            ? transactions
            : selectedTab === "Expenses"
            ? [...expenses]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((expense) => ({
                  type: "exp",
                  expense,
                }))
            : [...incomes]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((income) => ({
                  type: "inc",
                  income,
                }))
          ).map((transaction) => (
            <TableRow
              key={
                transaction.type === "exp"
                  ? transaction.expense.id
                  : transaction.income.id
              }
            >
              {["title", "amount", "category", "date"].map((key) => {
                const isExpense = transaction.type === "exp";
                const item = isExpense
                  ? transaction.expense
                  : transaction.income;

                return (
                  <TableCell
                    key={key}
                    sx={{
                      ...styles.tableCell,
                      color:
                        key === "amount"
                          ? isExpense
                            ? "red"
                            : "lightgreen"
                          : "white",
                    }}
                  >
                    {key === "date" ? (
                      new Date(item.date).toISOString().split("T")[0] // Format the date correctly
                    ) : key === "amount" ? (
                      <span>
                        <span
                          style={{
                            color: isExpense ? "red" : "lightgreen",
                            marginRight: "4px",
                          }}
                        >
                          {isExpense ? "- $" : "+ $"}
                        </span>
                        <span style={{ color: "white" }}>{item[key]}</span>
                      </span>
                    ) : (
                      item[key]
                    )}
                  </TableCell>
                );
              })}

              <TableCell sx={styles.tableCell}>
                <IconButton
                  sx={styles.editButton}
                  onClick={() => onEdit(transaction)}
                >
                  <EditNoteIcon fontSize="medium" />
                </IconButton>
              </TableCell>
              <TableCell sx={styles.tableCell}>
                <IconButton
                  sx={styles.deleteButton}
                  onClick={() =>
                    onDelete(
                      transaction.type === "exp"
                        ? transaction.expense.id
                        : transaction.income.id,
                      transaction.type === "exp"
                        ? transaction.expense.title
                        : transaction.income.title,
                      transaction.type
                    )
                  }
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
);

const styles = {
  mainContent: {
    flexGrow: 1,
    p: 3,
    backgroundColor: "#1e1e1e",
    opacity: "90%",
    color: "#fff",
    height: "80vh",
    overflow: "hidden",
    marginRight: "1%",
  },
  infoCardsContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 2,
    maxHeight: "20%",
  },
  infoCard: { backgroundColor: "#2c2c2c", width: "30%", color: "white" },
  cardTitle: {
    fontWeight: 900,
    fontFamily: "Quicksand, sans-serif",
    fontSize: "1.5rem",
  },
  tableContainer: {
    backgroundColor: "#2c2c2c",
    height: "calc(80vh - 25vh)",
    overflowY: "auto",
  },
  tableHeader: {
    color: "#fff",
    backgroundColor: "#2c2c2c",
    fontWeight: 900,
    fontSize: "1.2rem",
    fontFamily: "Quicksand, sans-serif",
  },
  tableCell: { color: "#fff", fontFamily: "Quicksand, sans-serif" },
  editButton: { color: "lightgreen", '&:hover': {color: 'green'} },
  deleteButton: { color: "red", '&:hover': {color: 'rgb(142, 20, 20)'} },
};

export default Dashboard;
