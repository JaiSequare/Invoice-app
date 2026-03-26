import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import {
  Grid,
  Container,
  Paper,
  TextField,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  CircularProgress
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { emailRegex, emptyEmailMsg, emptyPassMsg, initialLoginState, invalidEmailMsg, invalidPassMsg, passwordRegex } from "../../utils/constants";
import { LoginApi } from "../../services/apiServices";
import { loginInfo } from "../../redux/slices/loginSLice";
import FullPageLoader from "../../components/loader/Loading";
import AlertDialog from "../../components/alertDialogeModal/errorDialoge";


const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const [isLoading, setIsloading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [loginForm, setLoginForm] = useState(initialLoginState);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Onchange handler
  const onChangeHandler = (e) => {
    const { name, value, checked, type } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: ""
    }));
  };

  // Validation function
  const validateHandler = () => {
    const newErrors = {};

    // Email validation
    if (!loginForm?.email) {
      newErrors.email = emptyEmailMsg;
    } else if (!emailRegex.test(loginForm?.email)) {
      newErrors.email = invalidEmailMsg;
    };

    // Password validation
    if (!loginForm?.password) {
      newErrors.password = emptyPassMsg;
    } else if (!passwordRegex.test(loginForm?.password)) {
      newErrors.password = invalidPassMsg
    };

    return newErrors;
  };

  // Submit form handler
  const submitHandler = async (e) => {
    e.preventDefault();
    const validationErrors = validateHandler();

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    };

    try {
      setIsloading(true);
      const res = await LoginApi(loginForm);
      if (res.status === 200 && res.data) {
        dispatch(loginInfo(res.data));
        navigate('/invoice/dashboard');
      } else {
        setOpenModal(true);
        setErrMsg('Unable to login user. Please try again.');
      }
      setIsloading(false);
    } catch (error) {
      setIsloading(false);
      setOpenModal(true);
      setErrMsg(error.message || "Failed to load data. Please try again later.");
    }
  };

  // Navigate registertation page 
  const registerPageHandler = useCallback(() => {
    navigate("/signup");
  }, []);

  // Close Dialoge Modal
  const closeDialogModal = useCallback(() => {
    setOpenModal(false);
  }, []);

  return (
    <>
      <FullPageLoader open={isLoading} />
      <Grid sx={{ minHeight: "100vh", background: "#f5f5f5" }}>
        <Grid sx={{ fontSize: "25px", textAlign: "center", padding: 2, borderBottom: "1px solid #ddd", fontWeight: 600 }}>
          InvoiceApp
        </Grid>

        <Container maxWidth="xs" sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Paper elevation={3} sx={{ width: "100%", padding: 4, borderRadius: 2 }}>
            <Typography sx={{ fontSize: 28, align: "center", fontWeight: 600 }}>
              Welcome Back
            </Typography>

            <Typography sx={{ mb: 3, align: "center", color: "#666666" }}>
              Log in to your account
            </Typography>

            <form onSubmit={submitHandler}>
              <Grid sx={{ mt: 2, mb: 3, textAlign: "justify" }}>
                <Typography sx={{ mb: 1 }}>Email Address *</Typography>
                <TextField
                  fullWidth
                  placeholder="Enter your email"
                  name="email"
                  value={loginForm?.email}
                  onChange={onChangeHandler}
                  error={Boolean(errors?.email)}
                  helperText={errors?.email}
                />
              </Grid>

              <Grid sx={{ mt: 3, mb: 3, textAlign: "justify" }}>
                <Typography sx={{ mb: 1 }}>Password *</Typography>
                <TextField
                  fullWidth
                  placeholder="Enter password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={loginForm.password}
                  onChange={onChangeHandler}
                  error={Boolean(errors.password)}
                  helperText={errors.password || ""}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>

              <Grid sx={{ mt: 2, mb: 3, textAlign: "justify" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="rememberMe"
                      checked={loginForm.rememberMe}
                      onChange={onChangeHandler}
                    />
                  }
                  label="Remember me"
                />
              </Grid>

              {isLoading
                ? <CircularProgress />
                : <Button
                  sx={{ mt: 2, backgroundColor: "#555", "&:hover": { backgroundColor: "#333" } }}
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                >
                  Login
                </Button>
              }
            </form>

            <Link sx={{ mt: 2, fontSize: 14 }} underline="hover" onClick={registerPageHandler}>
              Create account
            </Link>
          </Paper>
        </Container>

        {/* Footer */}
        <Grid sx={{ textAlign: "center", padding: 2, fontSize: 12, borderTop: "1px solid #ddd", color: "#777" }}>
          © 2025 InvoiceApp. All rights reserved.

          <Grid sx={{ mt: 1 }}>
            <Link sx={{ mx: 1 }} underline="hover">Privacy Policy</Link>
            <Link sx={{ mx: 1 }} underline="hover">Terms of Service</Link>
            <Link sx={{ mx: 1 }} underline="hover">Support</Link>
          </Grid>
        </Grid>
      </Grid>

      <AlertDialog
        title='Error'
        descr={errMsg}
        open={openModal}
        close={closeDialogModal}
        onConfirm={closeDialogModal}
      />
    </>
  );
};

export default React.memo(Login);