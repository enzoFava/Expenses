import React, { useState, useEffect } from "react";
import {
  Grid2,
  Card,
  Typography,
  Avatar,
  CardContent,
  FormControl,
  Zoom,
  TextField,
  CardHeader,
  Button,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { getUser, updateUser } from "../api/usersAPI";

const Profile = () => {
  const [user, setUser] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState({ first_name: false, last_name: false });
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const fetchUser = async () => {
        const user = jwtDecode(token);
        const user_id = user.user_id;
        try {
          const response = await getUser(user_id);
          if (response.data.user) {
            setUser(response.data.user);
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchUser();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
    setError((prevError) => ({ ...prevError, [name]: false }));
  };

  const handleSubmit = async (user) => {
    console.log(user);
    if (user.first_name.trim() === "") {
      setError((prevError) => ({ ...prevError, first_name: true }));
      return;
    }

    if (user.last_name.trim() === "") {
      setError((prevError) => ({ ...prevError, last_name: true }));
      return;
    }
    try {
      setLoading(true);
      const response = await updateUser(user, user.id);
      console.log(response);
      setLoading(false);
      toast.success("Data Updated!");
      setShowForm(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <Grid2
      container
      sx={{
        ...styles.grid12,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Grid2
        size={6}
        sx={{
          ...styles.grid6,
          transform: showForm ? "translateX(0)" : "translateX(50%)",
          transition: "transform 0.2s ease-in-out",
        }}
      >
        <Card sx={{ ...styles.card, width: "60%", height: "fit-content" }}>
          <Typography
            variant="h5"
            sx={{
              display: "flex",
              fontFamily: "Quicksand, sans-serif",
              justifyContent: "space-between",
              padding: "5%",
              paddingBottom: "0%",
            }}
          >
            Personal details
            <EditIcon
              sx={{ margin: "2%", cursor: "pointer", color: "lightgreen" }}
              onClick={() => setShowForm(!showForm)}
            />
          </Typography>

          <CardHeader
            sx={{ padding: "5%" }}
            title={`${user.first_name} ${user.last_name} ( ${user.age || ""} )`}
            subheader={
              <Typography sx={{ color: "white" }}>{user.email}</Typography>
            }
            avatar={
              <Avatar
                onClick={() => toast.success("Avatar Clicked")}
                sx={{ width: 86, height: 86, cursor: "pointer" }}
              >
                {user.first_name?.[0] || "E"}
              </Avatar>
            }
          />
          <CardContent
            sx={{ textAlign: "end", paddingBottom: "2% !important" }}
          >
            <DeleteIcon
              sx={{ margin: "2%", cursor: "pointer", color: "red" }}
              onClick={() => setShowConfirm(true)}
            />
          </CardContent>
        </Card>
      </Grid2>
      <Zoom in={showForm}>
        <Grid2 size={6} sx={{ ...styles.grid6, justifyContent: "flex-start" }}>
          <Card
            sx={{
              ...styles.card,
              width: "60%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CardHeader
              sx={{ padding: "5%", marginBottom: "0%" }}
              title={
                <Typography
                  variant="h5"
                  sx={{ fontFamily: "Quicksand, sans-serif" }}
                >
                  Edit your data
                </Typography>
              }
            />
            <CardContent>
              <FormControl>
                <TextField
                  name="first_name"
                  label="First Name"
                  value={user.first_name || ""}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  error={error.first_name}
                  helperText={error.first_name ? "First Name is required." : ""}
                  required
                  InputLabelProps={{
                    sx: {
                      color: "white",
                      fontFamily: "'Quicksand', sans-serif",
                    },
                  }}
                  InputProps={{
                    sx: {
                      fontFamily: "'Quicksand', sans-serif",
                      color: "white",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white",
                      },
                    },
                  }}
                />
                <TextField
                  name="last_name"
                  label="Last Name"
                  value={user.last_name || ""}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  error={error.last_name}
                  helperText={error.last_name ? "Last Name is required." : ""}
                  required
                  InputLabelProps={{
                    sx: {
                      color: "white",
                      fontFamily: "'Quicksand', sans-serif",
                    },
                  }}
                  InputProps={{
                    sx: {
                      fontFamily: "'Quicksand', sans-serif",
                      color: "white",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white",
                      },
                    },
                  }}
                />
                <TextField
                  name="age"
                  label="Age"
                  type="number"
                  value={user.age || ""}
                  //defaultValue={user.last_name}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    sx: {
                      color: "white",
                      fontFamily: "'Quicksand', sans-serif",
                    },
                  }}
                  InputProps={{
                    sx: {
                      fontFamily: "'Quicksand', sans-serif",
                      color: "white",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white",
                      },
                    },
                  }}
                />
                <Button
                  type="submit"
                  onClick={() => handleSubmit(user)}
                  sx={{
                    color: "black",
                    fontWeight: "600",
                    alignSelf: "center",
                    width: "50%",
                    marginTop: "15%",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                    fontSize: "1rem",
                    fontFamily: "'Quicksand', sans-serif",
                    backgroundColor: "#4caf50",
                    "&:hover": {
                      backgroundColor: "#388e3c",
                    },
                  }}
                  variant="contained"
                >
                  {loading ? <CircularProgress size="25px" /> : "Save"}
                </Button>
              </FormControl>
            </CardContent>
          </Card>
        </Grid2>
      </Zoom>
    </Grid2>
  );
};

export default Profile;

// Styles object
const styles = {
  grid12: {
    marginTop: "8%",
    opacity: "90%",
  },
  grid6: {
    padding: "1%",
    display: "flex",
    justifyContent: "center",
    transition: "transform 0.5s ease-in-out",
  },
  card: {
    backgroundColor: "#1e1e1e",
    color: "white",
    fontFamily: "Quicksand, sans-serif",
    borderRadius: '10px'
  },
  text: {
    color: "white",
  },
};
