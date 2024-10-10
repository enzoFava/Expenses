import React, {useState} from "react";
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
import AddDialog from "../components/AddDialog";

const Dashboard = () => {

  const [openAdd, setOpenAdd] = useState(false)

  const handleAdd = () => {
    setOpenAdd(true)
  }

  return (
    <>
    <Box sx={{ display: "flex", height: "100vh", marginTop: "5%" }}>
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
          <MenuItem sx={{ '&:hover':{backgroundColor: 'transparent', opacity: '40%'}}}>
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
            sx={{ '&:hover':{backgroundColor: 'transparent', opacity: '40%'}}}>
            <Typography
              sx={{
                fontWeight: 700,
                fontFamily: "Quicksand, sans-serif",
                color: "#153316",
                
              }}
            >
              Add Expenses
            </Typography>
          </MenuItem>
          <MenuItem sx={{ '&:hover':{backgroundColor: 'transparent', opacity: '40%'}}}>
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
          <MenuItem sx={{ '&:hover':{backgroundColor: 'transparent', opacity: '40%'}}}>
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
        sx={{ flexGrow: 1, p: 3, backgroundColor: "#1e1e1e", opacity: '90%', color: "#fff" }}
      >
        {/* Top Info */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 2,
          }}
        >
          <Card sx={{ backgroundColor: "#2c2c2c", width: "30%" }}>
            <CardContent sx={{color:'white'}}>
              <Typography variant="h6">Total Budget</Typography>
              <Typography variant="h4">€ 5,525.00</Typography>
            </CardContent>
          </Card>
          <Card sx={{ backgroundColor: "#2c2c2c", width: "30%" }}>
            <CardContent sx={{color:'white'}}>
              <Typography variant="h6">Month Outcome</Typography>
              <Typography variant="h4">€ 1,230.27</Typography>
            </CardContent>
          </Card>
          <Card sx={{ backgroundColor: "#2c2c2c", width: "30%" }}>
            <CardContent sx={{color:'white'}}>
              <Typography variant="h6">Month Income</Typography>
              <Typography variant="h4">€ 3,250.03</Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Data Table */}
        <TableContainer component={Paper} sx={{ backgroundColor: "#2c2c2c" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#fff" }}>Title</TableCell>
                <TableCell sx={{ color: "#fff" }}>Amount</TableCell>
                <TableCell sx={{ color: "#fff" }}>Category</TableCell>
                <TableCell sx={{ color: "#fff" }}>Date</TableCell>
                <TableCell sx={{ color: "#fff" }}>xx</TableCell>
                <TableCell sx={{ color: "#fff" }}>xa</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                {
                  title: "Dinner friday",
                  amount: "$1250.85",
                  category: "Food",
                  date: "10-10-2024",
                  xx: "xx",
                  xa: "xa",
                },
                {
                  title: "Example DR",
                  amount: "Quote",
                  category: "2025-023",
                  date: "To send",
                  xx: "1 Aug 2025",
                  xa: "€ 32,00",
                },
                {
                  title: "Newly SR",
                  amount: "Invoice",
                  category: "2025-022",
                  date: "Overdue",
                  xx: "2 Jun 2025",
                  xa: "€ 8,10",
                },
                {
                  title: "KB Starter",
                  amount: "Invoice",
                  category: "2025-021",
                  date: "Paid",
                  xx: "30 Apr 2025",
                  xa: "€ 32,00",
                },
                {
                  title: "Tesla Inc.",
                  amonut: "Quote",
                  category: "2025-020",
                  date: "To send",
                  xx: "25 Jun 2025",
                  xa: "€ 32,00",
                },
                {
                  title: "Starbucks",
                  amount: "Invoice",
                  category: "2025-019",
                  date: "Overdue",
                  xx: "30 Apr 2025",
                  xa: "€ 8,10",
                },
              ].map((row) => (
                <TableRow key={row.number}>
                  <TableCell sx={{ color: "#fff" }}>{row.title}</TableCell>
                  <TableCell sx={{ color: "#fff" }}>{row.amount}</TableCell>
                  <TableCell sx={{ color: "#fff" }}>{row.category}</TableCell>
                  <TableCell sx={{ color: "#fff" }}>{row.date}</TableCell>
                  <TableCell sx={{ color: "#fff" }}>{row.xx}</TableCell>
                  <TableCell sx={{ color: "#fff" }}>{row.xa}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
    <AddDialog open={openAdd} close={() => setOpenAdd(false)}/>
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
