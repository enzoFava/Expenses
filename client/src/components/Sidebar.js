import React, { memo } from "react";
import {
  MenuItem,
  Drawer,
  List,
  ListItem,
  Typography,
  Divider,
  FormControl,
  TextField,
  InputLabel,
  NativeSelect,
} from "@mui/material";

const Sidebar = ({
  onAddExpense,
  onAddIncome,
  onCatChange,
  onMonthChange,
  filterMonth,
  filterCat,
}) => {
  const SidebarMenuItem = memo(({ label, onClick }) => (
    <MenuItem sx={styles.menuItem} onClick={onClick}>
      <Typography sx={styles.menuItemText}>{label}</Typography>
    </MenuItem>
  ));

  return (
    <Drawer variant="permanent" sx={styles.drawer}>
      <List>
        <ListItem>
          <Typography variant="h6" sx={styles.sidebarTitle}>
            Actions
          </Typography>
        </ListItem>
        <Divider />
        <FormControl sx={{ margin: "5%" }}>
          <TextField
            name="date"
            type="month"
            value={filterMonth || ""}
            onChange={onMonthChange}
            InputProps={{ sx: { fontFamily: "'Quicksand', sans-serif" } }} // Custom Input styles
          />
        </FormControl>
        <FormControl fullWidth sx={{ margin: "5%" }}>
          <InputLabel variant="standard" htmlFor="uncontrolled-native">
            Filter by Category
          </InputLabel>
          <NativeSelect
            value={filterCat || ""}
            onChange={onCatChange}
            inputProps={{
              name: "Filter",
              id: "uncontrolled-native",
            }}
          >
            <option value={"all"}>All</option>
            <option value={"transport"}>Transport</option>
            <option value={"health"}>Health</option>
            <option value={"food"}>Food</option>
            <option value={"clothes"}>Clothes</option>
            <option value={"pets"}>Pets</option>
            <option value={"gifts"}>Gifts</option>
            <option value={"entertainment"}>Entertainment</option>
            <option value={"house"}>House</option>
            <option value={"salary"}>Salary</option>
            <option value={"deposits"}>Deposits</option>
            <option value={"savings"}>Savings</option>
            <option value={"others"}>Others</option>
          </NativeSelect>
        </FormControl>
        <SidebarMenuItem label="My Wallet" />
        <SidebarMenuItem label="Add New Expenses" onClick={onAddExpense} />
        <SidebarMenuItem label="Add New Incomes" onClick={onAddIncome} />

        <SidebarMenuItem label="Charts" />
        <SidebarMenuItem label="Settings" />
      </List>
    </Drawer>
  );
};

export default Sidebar;

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
  sidebarTitle: {
    color: "#153316",
    fontWeight: 700,
    padding: "16px 0",
    fontFamily: "Quicksand, sans-serif",
  },
  menuItem: { "&:hover": { backgroundColor: "transparent", opacity: "40%" } },
  menuItemText: {
    fontWeight: 700,
    fontFamily: "Quicksand, sans-serif",
    color: "#153316",
  },
};
