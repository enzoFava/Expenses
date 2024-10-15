import React, { useState, useEffect, useCallback, memo } from "react";
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
  IconButton,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";
import AddExpenseDialog from "../components/dialogs/AddExpenseDialog";
import AddIncomeDialog from "../components/dialogs/AddIncomeDialog";
import ConfirmDialog from "../components/dialogs/ConfirmDialog";
import EditExpenseDialog from "../components/dialogs/EditExpenseDialog"
import { getExpenses, getIncomes, deleteExpense } from "../api/expensesAPI";
import {jwtDecode} from "jwt-decode";

const Dashboard = ({ authUser }) => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openIncome, setOpenIncome] = useState(false);
  const [openEdit, setOpenEdit] = useState({ bool:false, expense:null });
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [openConfirm, setOpenConfirm] = useState({ bool: false, id: null, title: "" });
  const [monthBudget, setMonthBudget] = useState(0);

  const token = localStorage.getItem("token");
  const user = jwtDecode(token);

  const fetchExpenses = useCallback(async () => {
    try {
      const { data } = await getExpenses(user.user_id);
      setExpenses(data.expenses);
    } catch (error) {
      console.error(error);
    }
  }, [user.user_id]);

  const fetchIncomes = useCallback(async () => {
    try {
      const { data } = await getIncomes(user.user_id);
      setIncomes(data.incomes);
    } catch (error) {
      console.error(error);
    }
  }, [user.user_id]);

  useEffect(() => {
    fetchExpenses();
    fetchIncomes();
  }, [fetchExpenses, fetchIncomes]);

  useEffect(() => {
    const totalExpenses = sumAmounts(expenses);
    const totalIncomes = sumAmounts(incomes);
    setMonthBudget(totalIncomes - totalExpenses);
  }, [expenses, incomes]);

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id, user.user_id);
      fetchExpenses();
    } catch (error) {
      console.error(error);
    }
  };
  
  // EDIT AN EXISTING EXPENSE LOGIC (PUT)

  // const handleEdit = async (id) => {
  //   try {
  //     const response = await editExpense(id, user.user_id, newExpense);
  //     console.log(response)
  //     fetchExpenses();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  const sumAmounts = (items) => items.reduce((acc, item) => acc + parseFloat(item.amount), 0);

  return (
    <>
      <Box sx={{ display: "flex", height: "80vh", marginTop: "5%" }}>
        <Sidebar onAddExpense={() => setOpenAdd(true)} onAddIncome={() => setOpenIncome(true)} />

        <Box sx={styles.mainContent}>
          <InfoCards
            monthBudget={monthBudget}
            totalExpenses={sumAmounts(expenses)}
            totalIncomes={sumAmounts(incomes)}
          />
          <ExpenseTable
            expenses={expenses}
            onEdit={(expense) => setOpenEdit({ bool:true, expense})}
            onDelete={(id, title) => setOpenConfirm({ bool: true, id, title })}
          />
        </Box>
      </Box>

      <AddExpenseDialog open={openAdd} close={() => setOpenAdd(false)} add={fetchExpenses} />
      <AddIncomeDialog open={openIncome} close={() => setOpenIncome(false)} add={fetchIncomes} />
      <EditExpenseDialog open={openEdit.bool} close={() => setOpenEdit({bool: false})} add={fetchExpenses} expense={openEdit.expense}/>
      <ConfirmDialog
        open={openConfirm.bool}
        closeDialog={() => setOpenConfirm({ bool: false })}
        title={openConfirm.title}
        deleteFunction={() => handleDelete(openConfirm.id)}
      />
    </>
  );
};

const Sidebar = memo(({ onAddExpense, onAddIncome }) => (
  <Drawer
    variant="permanent"
    sx={styles.drawer}
  >
    <List>
      <ListItem>
        <Typography variant="h6" sx={styles.sidebarTitle}>Actions</Typography>
      </ListItem>
      <Divider />
      <SidebarMenuItem label="My Wallet" />
      <SidebarMenuItem label="Add New Expenses" onClick={onAddExpense} />
      <SidebarMenuItem label="Add New Incomes" onClick={onAddIncome} />
      <SidebarMenuItem label="Charts" />
      <SidebarMenuItem label="Settings" />
    </List>
  </Drawer>
));

const SidebarMenuItem = memo(({ label, onClick }) => (
  <MenuItem sx={styles.menuItem} onClick={onClick}>
    <Typography sx={styles.menuItemText}>{label}</Typography>
  </MenuItem>
));

const InfoCards = memo(({ monthBudget, totalExpenses, totalIncomes }) => (
  <Box sx={styles.infoCardsContainer}>
    <InfoCard title="Month Budget" value={monthBudget} isNegative={monthBudget < 0} />
    <InfoCard title="Month Outcome" value={totalExpenses} />
    <InfoCard title="Month Income" value={totalIncomes} />
  </Box>
));

const InfoCard = memo(({ title, value, isNegative }) => (
  <Card sx={styles.infoCard}>
    <CardContent>
      <Typography variant="h6" sx={styles.cardTitle}>{title}</Typography>
      <Typography variant="h5" sx={{ color: isNegative ? "red" : "inherit" }}>
        $ {value}
      </Typography>
    </CardContent>
  </Card>
));

const ExpenseTable = memo(({ expenses, onEdit, onDelete }) => (
  <TableContainer component={Paper} sx={styles.tableContainer}>
    <Table stickyHeader>
      <TableHead>
        <TableRow>
          {["Title", "Amount ($)", "Category", "Date", "Edit", "Delete"].map((header) => (
            <TableCell key={header} sx={styles.tableHeader}>{header}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {expenses.slice().reverse().map((expense) => (
          <TableRow key={expense.id}>
            {["title", "amount", "category", "date"].map((key) => (
              <TableCell key={key} sx={styles.tableCell}>{expense[key]}</TableCell>
            ))}
            <TableCell sx={styles.tableCell}>
              <IconButton onClick={() => onEdit(expense)} sx={styles.editButton}>
                <EditNoteIcon fontSize="medium" />
              </IconButton>
            </TableCell>
            <TableCell sx={styles.tableCell}>
              <IconButton onClick={() => onDelete(expense.id, expense.title)} sx={styles.deleteButton}>
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
));

const styles = {
  drawer: {
    width: 240,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      marginTop: "5%",
      width: 240,
      boxSizing: "border-box",
      backgroundColor: "transparent",
      color: "#153316",
      border: "none",
    },
  },
  sidebarTitle: { color: "#153316", fontWeight: 700, padding: "16px 0", fontFamily: "Quicksand, sans-serif" },
  menuItem: { "&:hover": { backgroundColor: "transparent", opacity: "40%" } },
  menuItemText: { fontWeight: 700, fontFamily: "Quicksand, sans-serif", color: "#153316" },
  mainContent: {
    flexGrow: 1, p: 3, backgroundColor: "#1e1e1e", opacity: "90%", color: "#fff", height: "80vh", overflow: "hidden", marginRight: "1%",
  },
  infoCardsContainer: { display: "flex", justifyContent: "space-between", marginBottom: 2, maxHeight: "20%" },
  infoCard: { backgroundColor: "#2c2c2c", width: "30%", color: "white" },
  cardTitle: { fontWeight: 900, fontFamily: "Quicksand, sans-serif", fontSize: "1.5rem" },
  tableContainer: { backgroundColor: "#2c2c2c", height: "calc(80vh - 25vh)", overflowY: "auto" },
  tableHeader: { color: "#fff", backgroundColor: "#2c2c2c", fontWeight: 900, fontSize: "1.2rem", fontFamily: "Quicksand, sans-serif" },
  tableCell: { color: "#fff", fontFamily: "Quicksand, sans-serif" },
  editButton: { color: "#64ffda" },
  deleteButton: { color: "red" },
};

export default Dashboard;
