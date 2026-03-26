import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  Grid,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  InputAdornment,
  IconButton
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { allowedCurrencies, emailRegex, emptyaddressMsg, emptycityMsg, emptycompanynameMsg, emptycurrencyMsg, emptyEmailMsg, emptyfnameMsg, emptylnameMsg, emptyPassMsg, emptyzipcodeMsg, formatFormData, initialSignupState, invalidEmailMsg, invalidPassMsg, invalidzipcodeMsg, passwordRegex, textRegex, zipRegex } from "../../utils/constants";
import { RegisterApi } from "../../services/apiServices";
import FullPageLoader from "../../components/loader/Loading";
import AlertDialog from "../../components/alertDialogeModal/errorDialoge";

const Signup = () => {
  const naviagate = useNavigate();

  const [isLoading, setIsloading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [signForm, setSignForm] = useState(initialSignupState);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [preview, setPreview] = useState(null);

  // Onchange handler
  const onChangeHandler = (e) => {
    const { name, value, files } = e.target;

    // for text handling
    if (
      (name === "firstName" || name === "lastName" || name === "city") &&
      !textRegex.test(value)) {
      return;
    };

    // for file handling
    if (files && files[0]) {
      const file = files[0];
      setSignForm((prev) => ({
        ...prev,
        [name]: file.name
      }));

      setPreview(URL.createObjectURL(file));
      return;
    }

    setSignForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: ""
    }));
  };

  // Validation function
  const validateHandler = () => {
    const newErrors = {};

    if (!signForm?.firstName) newErrors.firstName = emptyfnameMsg;
    if (!signForm?.lastName) newErrors.lastName = emptylnameMsg;

    if (!signForm?.email) newErrors.email = emptyEmailMsg;
    else if (!emailRegex.test(signForm?.email))
      newErrors.email = invalidEmailMsg;

    if (!signForm?.password) newErrors.password = emptyPassMsg;
    else if (!passwordRegex.test(signForm?.password))
      newErrors.password = invalidPassMsg;

    if (!signForm?.companyName) newErrors.companyName = emptycompanynameMsg;
    if (!signForm?.address) newErrors.address = emptyaddressMsg;
    if (!signForm?.city) newErrors.city = emptycityMsg;

    if (!signForm?.zipCode) newErrors.zipCode = emptyzipcodeMsg;
    else if (!zipRegex.test(signForm?.zipCode))
      newErrors.zipCode = invalidzipcodeMsg;

    if (!signForm?.currencySymbol) newErrors.currencySymbol = emptycurrencyMsg;
    else if (!allowedCurrencies.includes(signForm?.currencySymbol)) {
      newErrors.currencySymbol = emptycurrencyMsg;
    }

    return newErrors;
  };

  // On Submit Handler
  const submitHandler = async (e) => {
    e.preventDefault();
    const validationErr = validateHandler();
    if (Object.keys(validationErr).length) {
      setErrors(validationErr);
      return;
    };

    const formDatapayload = formatFormData(signForm);
    try {
      setIsloading(true);
      const res = await RegisterApi(formDatapayload);
      if (res.status === 200 && res.data) {
        naviagate("/");
      } else {
        setOpenModal(true);
        setErrMsg('Unable to register user. Please try again.');
      }
      setIsloading(false);
    } catch (error) {
      setIsloading(false);
      setOpenModal(true);
      setErrMsg(error.message || "Failed to load data. Please try again later.");
    }
  };

  // Navigate Login page
  const loginPageHandler = useCallback(() => {
    naviagate("/");
  }, []);

  // Close Dialoge Modal
  const closeDialogModal = useCallback(() => {
    setOpenModal(false);
  }, []);

  return (
    <>
      <FullPageLoader open={isLoading} />
      <Grid sx={{ minHeight: "100vh", background: "#f4f6f8", }}>
        <Grid sx={{ fontSize: "25px", textAlign: "center", padding: 2, borderBottom: "1px solid #ddd", fontWeight: 600 }}>
          InvoiceApp
        </Grid>

        <Container
          // maxWidth="md"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flex: 1
          }}
        >
          <Paper sx={{ p: 4, width: "100%" }} elevation={2}>
            <Typography variant="h5" align="center" fontWeight={600}>
              Create Your Account
            </Typography>

            <Typography align="center" color="text.secondary" sx={{ mb: 3 }}>
              Set up your company and start invoicing in minutes.
            </Typography>

            <form onSubmit={submitHandler}>
              <Grid container spacing={4}>
                <Grid size={6}>
                  <Typography fontWeight={600} mb={2}>
                    User Information
                  </Typography>

                  <Grid sx={{ mt: 2, mb: 3, textAlign: "justify" }}>
                    <Typography sx={{ mb: 0 }}>First Name*</Typography>
                    <TextField
                      fullWidth
                      placeholder="Enter first name"
                      name="firstName"
                      value={signForm.firstName}
                      onChange={onChangeHandler}
                      error={!!errors.firstName}
                      helperText={errors.firstName}
                      inputProps={{ maxLength: 50 }}
                    />
                  </Grid>

                  <Grid sx={{ mt: 2, mb: 3, textAlign: "justify" }}>
                    <Typography sx={{ mb: 0 }}>Last Name*</Typography>
                    <TextField
                      fullWidth
                      placeholder="Enter last name"
                      name="lastName"
                      value={signForm.lastName}
                      onChange={onChangeHandler}
                      error={!!errors.lastName}
                      helperText={errors.lastName}
                      inputProps={{ maxLength: 50 }}
                    />
                  </Grid>

                  <Grid sx={{ mt: 2, mb: 3, textAlign: "justify" }}>
                    <Typography sx={{ mb: 0 }}>Email*</Typography>
                    <TextField
                      fullWidth
                      placeholder="Enter your email"
                      name="email"
                      value={signForm.email}
                      onChange={onChangeHandler}
                      error={!!errors.email}
                      helperText={errors.email}
                    />
                  </Grid>

                  <Grid sx={{ mt: 2, mb: 3, textAlign: "justify" }}>
                    <Typography sx={{ mb: 0 }}>Password*</Typography>
                    <TextField
                      fullWidth
                      placeholder="Enter password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={signForm.password}
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
                      inputProps={{ maxLength: 20 }}
                    />
                  </Grid>

                </Grid>
                <Grid size={6}>
                  <Typography fontWeight={600} mb={2}>
                    Company Information
                  </Typography>

                  <Grid sx={{ mt: 2, mb: 3, textAlign: "justify" }}>
                    <Typography sx={{ mb: 0 }}>Company Name*</Typography>
                    <TextField
                      fullWidth
                      placeholder="Enter company name"
                      name="companyName"
                      value={signForm.companyName}
                      onChange={onChangeHandler}
                      error={!!errors.companyName}
                      helperText={errors.companyName}
                      inputProps={{ maxLength: 100 }}
                    />
                  </Grid>

                  <Grid sx={{ mt: 2, mb: 3, textAlign: "justify" }}>
                    <Typography sx={{ mb: 0 }}>Company Logo</Typography>
                    <Grid sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Grid
                        sx={{
                          width: 60,
                          height: 60,
                          border: "1px solid #ddd",
                          borderRadius: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                          background: "#f5f5f5"
                        }}
                      >
                        {preview ? (
                          <img
                            src={preview}
                            alt="logo preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              alignItems: "baseline"
                            }}
                          />
                        ) : (
                          <Typography fontSize={12} color="text.secondary">
                            Preview
                          </Typography>
                        )}
                      </Grid>

                      <TextField
                        fullWidth
                        type="file"
                        name="companyLogo"
                        onChange={onChangeHandler}
                        helperText="Max 2-5 MB"
                        inputProps={{
                          accept: 'image/png, image/jpeg, .png, .jpg, .jpeg', // Accepts PNG and JPG/JPEG files
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Grid sx={{ mt: 2, mb: 3, textAlign: "justify" }}>
                    <Typography sx={{ mb: 0 }}>Address*</Typography>
                    <TextField
                      fullWidth
                      placeholder="Enter company address"
                      name="address"
                      value={signForm.address}
                      onChange={onChangeHandler}
                      error={!!errors.address}
                      helperText={errors.address}
                      multiline
                      rows={4}
                      inputProps={{ maxLength: 500 }}
                    />
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid Grid size={6} sx={{ mt: 2, mb: 3, textAlign: "justify" }}>
                      <Typography sx={{ mb: 0 }}>City*</Typography>
                      <TextField
                        fullWidth
                        placeholder="Enter city"
                        name="city"
                        value={signForm.city}
                        onChange={onChangeHandler}
                        error={!!errors.city}
                        helperText={errors.city}
                        inputProps={{ maxLength: 50 }}
                      />
                    </Grid>
                    <Grid Grid size={6} sx={{ mt: 2, mb: 3, textAlign: "justify" }}>
                      <Typography sx={{ mb: 0 }}>Zip Code*</Typography>
                      <TextField
                        fullWidth
                        placeholder="6 digit zip code"
                        name="zipCode"
                        value={signForm.zipCode}
                        onChange={onChangeHandler}
                        error={!!errors.zipCode}
                        helperText={errors.zipCode}
                        inputProps={{ maxLength: 6 }}
                      />
                    </Grid>
                  </Grid>

                  <Grid sx={{ mt: 2, mb: 3, textAlign: "justify" }}>
                    <Typography sx={{ mb: 0 }}>Industry</Typography>
                    <TextField
                      fullWidth
                      placeholder="Industry type"
                      name="industry"
                      value={signForm.industry}
                      onChange={onChangeHandler}
                      inputProps={{ maxLength: 50 }}
                    />
                  </Grid>

                  {/* Currency Dropdown */}
                  <Grid sx={{ mt: 2, mb: 3, textAlign: "justify" }}>
                    <Typography sx={{ mb: 0 }}>Currency Symbol*</Typography>
                    <TextField
                      fullWidth
                      placeholder="$, ₹, €, AED"
                      name="currencySymbol"
                      value={signForm.currencySymbol?.toUpperCase()}
                      onChange={onChangeHandler}
                      error={!!errors.currencySymbol}
                      helperText={errors.currencySymbol}
                      inputProps={{ maxLength: 5 }}
                    />
                  </Grid>

                </Grid>
              </Grid>

              <Grid textAlign="right" mt={3}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: "#555",
                    "&:hover": { backgroundColor: "#333" }
                  }}
                >
                  Sign Up
                </Button>
              </Grid>

              <Typography align="center" mt={2} fontSize={14}>
                Already have an account?
                <Link sx={{ mx: 1 }} underline="hover" onClick={loginPageHandler}>Login</Link>
              </Typography>
            </form>
          </Paper>
        </Container>

        {/* Footer */}
        <Grid
          sx={{
            textAlign: "center",
            borderTop: "1px solid #ddd",
            p: 2,
            fontSize: 12,
            color: "#777"
          }}
        >
          © 2025 InvoiceApp. All rights reserved.
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

export default React.memo(Signup);