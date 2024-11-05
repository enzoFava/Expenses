import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
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
  useMediaQuery,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import ConfirmDialog from "../components/dialogs/ConfirmDialog";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { getUser, updateUser, deleteUser } from "../api/usersAPI";

const Profile = ({ onLogout }) => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const navigate = useNavigate();
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
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
    setError((prevError) => ({ ...prevError, [name]: false }));
  };

  const handleSubmit = async (user) => {
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
      await updateUser(user, user.id);
      setLoading(false);
      toast.success("Data Updated!");
      setShowForm(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const handleDelete = async (password) => {
    try {
      setLoading(true);
      await deleteUser(password.password, user.email, user.id);
      localStorage.removeItem("token");
      toast.error("Account deleted");
      setLoading(false);
      setShowConfirm(false);
      navigate("/");
      onLogout();
    } catch (error) {
      setLoading(false);
      console.error(error);
      if (error.status === 401) {
        toast.warn("Invalid credentials");
      } else if (error.status === 400) {
        toast.warn("User not found");
      } else if (error.status === 403) {
        toast.warn("Can't delete Test user");
      } else {
        toast.warn("Server error");
      }
    }
  };

  return (
    <Grid
      container
      spacing={2}
      sx={{
        marginTop: isMobile? '15%' : "8%",
        marginLeft: "auto",  // Centering the component with margins
        marginRight: "auto",
        paddingBottom: "5%",
        width: "90%", // Restricting width to 90% of the viewport
        maxWidth: "1200px", // Maximum width for larger screens
        opacity: "90%",
      }}
    >
      <Grid
        item
        xs={12}
        sm={6}
        sx={{
          display: "flex",
          justifyContent: "center",
          transition: "transform 0.5s ease-in-out",
        }}
      >
        <Card sx={{ ...styles.card, width: "100%", padding: "2%" }}>
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
              sx={{
                margin: "2%",
                cursor: "pointer",
                color: "lightgreen",
                "&:hover": { color: "green" },
              }}
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
                {user.first_name?.[0].toUpperCase() || "E"}
              </Avatar>
            }
          />
          <CardContent
            sx={{
              textAlign: "end",
              paddingBottom: "2% !important",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Typography sx={{ color: "rgb(73, 71, 71)" }}>
              Delete account
            </Typography>
            <DeleteIcon
              sx={{
                margin: "2%",
                cursor: "pointer",
                color: "rgb(73, 71, 71)",
                "&:hover": { color: "lightgrey" },
              }}
              onClick={() => setShowConfirm(true)}
            />
          </CardContent>
        </Card>
      </Grid>
      <Zoom in={showForm}>
        <Grid item xs={12} sm={6} sx={{ display: "flex", justifyContent: "flex-start" }}>
          <Card
            sx={{
              ...styles.card,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "2%",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                display: "flex",
                flexDirection: "row",
                fontFamily: "Quicksand, sans-serif",
                justifyContent: "space-between",
                padding: "5%",
                paddingBottom: "0%",
                alignItems: "center",
                width: "100%",
              }}
            >
              Edit your data
              <CloseIcon
                onClick={() => setShowForm(false)}
                sx={{ cursor: "pointer", "&:hover": { color: "darkgrey" } }}
              />
            </Typography>

            <CardHeader
              sx={{ padding: "5%", marginBottom: "0%" }}
              title={
                <Typography sx={{ color: "white" }}>{user.email}</Typography>
              }
            />

            <CardContent sx={{ paddingTop: "0%" }}>
              <FormControl fullWidth>
                <TextField
                  name="first_name"
                  label="First Name"
                  value={user.first_name || ""}
                  onChange={handleChange}
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
                  onChange={handleChange}
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
        </Grid>
      </Zoom>
      <ConfirmDialog
        open={showConfirm}
        closeDialog={() => setShowConfirm(false)}
        title={user.email}
        deleteFunction={(password) => handleDelete(password)}
        user={user}
        loading={loading}
      />
    </Grid>
  );
};

export default Profile;

// Styles object
const styles = {
  card: {
    backgroundColor: "#1e1e1e",
    color: "white",
    fontFamily: "Quicksand, sans-serif",
    borderRadius: "10px",
  },
};
