import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, CardContent, Grid, InputAdornment, Paper, TextField, Typography, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { emptyCustNameMsg, emptyInvNumMsg, emptyInvoiceDateMsg, initialLineItem, InvalidTaxMsg, invoiceFormData } from '../../utils/constants';
import { useNavigate, useParams } from 'react-router';
import FullPageLoader from '../../components/loader/Loading';
import AlertDialog from '../../components/alertDialogeModal/errorDialoge';
import { fetchItemfromIdApi, saveNewInvoiceApi } from '../../services/apiServices';
import { useSelector } from 'react-redux';
import DashboardInvoiceTable from '../../components/DashboadInvoiceTable';


function InvoiceForm() {
  const navigate = useNavigate();
  const params = useParams();
  const { token } = useSelector(state => state?.auth?.loginDetails);

  // Initial local states
  const [isLoading, setIsloading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [lines, setLineItems] = useState([initialLineItem]);
  const [invoiceForm, setInvoiceForm] = useState(invoiceFormData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (params?.id !== 'new') {
      fetchItemData(params?.id);
    };
  }, []);

  // fethcing all editable data via id params
  const fetchItemData = async (id) => {
    try {
      setIsloading(true);
      const res = await fetchItemfromIdApi(token, id);
      if (res.status === 200 || res.data) {
        const { formDataMap, lineDataMap } = mapInvoiceDataHandler(res.data);
        setInvoiceForm(formDataMap);
        setLineItems(lineDataMap?.length ? lineDataMap : [initialLineItem]);
      } else {
        setOpenModal(true);
        setErrMsg('Unable fetch dashboard item. Please try again.');
      }
      setIsloading(false);
    } catch (error) {
      setIsloading(false);
      setOpenModal(true);
      setErrMsg(error.message || "Failed to load data. Please try again later.");
    }
  };

  // All Tax and Item Calculations
  const subtotal = lines.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = subtotal * (invoiceForm?.taxPercentage / 100);
  const grandTotal = subtotal + taxAmount;

  // Update Per Row according to item counts
  const updateLineItemHandler = useCallback((index, field, value) => {
    const updated = [...lines];
    updated[index] = { ...updated[index], [field]: value };

    const quantity = Number(updated[index].quantity) || 0;
    const rate = Number(updated[index].rate) || 0;
    const disc = Number(updated[index].discountPct) || 0;

    updated[index].amount = quantity * rate * (1 - disc / 100);
    updated[index].rowNo = index + 1;
    setLineItems(updated);
  }, [lines]);

  // Add item line here
  const addRowHandler = () => {
    const newRow = {
      ...initialLineItem,
      rowNo: lines.length + 1
    };
    setLineItems([...lines, newRow]);
  };

  // Delete row hanlder
  const deleteRowHandler = useCallback((index) => {
    if (lines.length <= 1) return;
    const updated = lines.filter((item, indx) => indx !== index);
    const reNumbered = updated.map((item, indx) => ({
      ...item,
      rowNo: indx + 1
    }));
    setLineItems(reNumbered);
  }, [lines]);

  // All inputs single onchange handler
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setInvoiceForm({
      ...invoiceForm,
      [name]: value
    });
  };

  // Validation handler
  const validateHandler = () => {
    let newErrors = {};

    // Header validations
    if (!invoiceForm.invoiceDate) {
      newErrors.invoiceDate = emptyInvoiceDateMsg;
    }

    if (!invoiceForm.customerName?.trim()) {
      newErrors.customerName = emptyCustNameMsg;
    }

    if (invoiceForm.invoiceNo && isNaN(invoiceForm.invoiceNo)) {
      newErrors.invoiceNo = emptyInvNumMsg;
    }

    if (invoiceForm.taxPercentage < 0) {
      newErrors.taxPercentage = InvalidTaxMsg;
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0 ||
      (newErrors.lines &&
        newErrors.lines.every((row) => Object.keys(row).length === 0))
    );
  };

  // Save new invoice
  const submithandler = async () => {
    if (!validateHandler()) return;
    const payload = { ...invoiceForm, lines: lines };
    try {
      setIsloading(true);
      const res = await saveNewInvoiceApi(token, payload, params?.id);
      if (res.status === 201 && res.data) {
        navigate('/invoice/dashboard');
      } else {
        setOpenModal(true);
        setErrMsg('Unable to save invoice. Please try again.');
      }
      setIsloading(false);
    } catch (error) {
      setIsloading(false);
      setOpenModal(true);
      setErrMsg(error.message || "Failed to load data. Please try again later.");
    }
  };

  // Close Dialoge Modal
  const closeDialogModal = useCallback(() => {
    setOpenModal(false);
  }, []);

  // When click back btn
  const backBtnHandler = () => {
    navigate('/invoice/dashboard');
  };

  // Set all editable data in initial states
  const mapInvoiceDataHandler = (apiData) => {
    const formatDate = (date) =>
      date ? new Date(date).toISOString().split("T")[0] : "";

    const formDataMap = {
      invoiceNo: apiData.invoiceNo || "",
      invoiceDate: formatDate(apiData.invoiceDate),
      customerName: apiData.customerName || "",
      city: apiData.city || "",
      address: apiData.address || "",
      notes: apiData.notes || "",
      taxPercentage: apiData.taxPercentage || 0,
    };

    const lineDataMap = apiData.lines.map((item, index) => {
      const quantity = Number(item.quantity) || 0;
      const rate = Number(item.rate) || 0;
      const disc = Number(item.discountPct) || 0;

      return {
        rowNo: index + 1,
        item: item.itemID || "",
        description: item.description || "",
        quantity,
        rate,
        discountPct: disc,
        amount: quantity * rate * (1 - disc / 100),
      };
    });

    return { formDataMap, lineDataMap };
  };

  return (
    <>
      <FullPageLoader open={isLoading} />
      <Grid sx={{ maxWidth: 1100, mx: 'auto', my: 4, p: 3 }}>
        <Grid sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            New Invoice
          </Typography>
          <Grid>
            <Button variant="outlined" sx={{ mr: 2 }} onClick={backBtnHandler}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={submithandler}>
              Save
            </Button>
          </Grid>
        </Grid>

        <Card variant="outlined" sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Invoice Details
            </Typography>

            <Grid container spacing={3}>
              <Grid size={6}>
                <Grid sx={{ mt: 2, textAlign: "justify" }}>
                  <Typography sx={{ mb: 1 }}>Invoice No</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    placeholder="INV-001"
                    name="invoiceNo"
                    value={invoiceForm?.invoiceNo}
                    onChange={onChangeHandler}
                    error={!!errors.invoiceNo}
                    helperText={errors.invoiceNo}
                  />
                </Grid>
              </Grid>

              <Grid size={6}>
                <Grid sx={{ mt: 2, textAlign: "justify" }}>
                  <Typography sx={{ mb: 1 }}>Invoice Date *</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    placeholder="Please enter Invoice Date"
                    type="date"
                    name="invoiceDate"
                    value={invoiceForm?.invoiceDate}
                    onChange={onChangeHandler}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.invoiceDate}
                    helperText={errors.invoiceDate}
                  />
                </Grid>
              </Grid>

              <Grid size={6}>
                <Grid sx={{ mt: 2, textAlign: "justify" }}>
                  <Typography sx={{ mb: 1 }}>Customer Name *</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    placeholder="Enter customer name"
                    name="customerName"
                    value={invoiceForm?.customerName}
                    onChange={onChangeHandler}
                    error={!!errors.customerName}
                    helperText={errors.customerName}
                    inputProps={{ maxLength: 50 }}
                  />
                </Grid>
              </Grid>

              <Grid size={6}>
                <Grid sx={{ mt: 2, textAlign: "justify" }}>
                  <Typography sx={{ mb: 1 }}>City</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    placeholder="Enter city"
                    name="city"
                    value={invoiceForm?.city}
                    onChange={onChangeHandler}
                    inputProps={{ maxLength: 50 }}
                  />
                </Grid>
              </Grid>

              <Grid size={6}>
                <Grid sx={{ mt: 2, textAlign: "justify" }}>
                  <Typography sx={{ mb: 1 }}>Address</Typography>
                  <TextField
                    multiline
                    rows={2}
                    fullWidth
                    size="small"
                    variant="outlined"
                    placeholder="Enter address"
                    name="address"
                    value={invoiceForm?.address}
                    onChange={onChangeHandler}
                    error={!!errors.address}
                    helperText={errors.address}
                    inputProps={{ maxLength: 500 }}
                  />
                </Grid>
              </Grid>

              <Grid size={6}>
                <Grid sx={{ mt: 2, textAlign: "justify" }}>
                  <Typography sx={{ mb: 1 }}>Notes</Typography>
                  <TextField
                    multiline
                    rows={2}
                    fullWidth
                    size="small"
                    variant="outlined"
                    placeholder="Additional notes"
                    name="notes"
                    value={invoiceForm?.notes}
                    onChange={onChangeHandler}
                    error={!!errors.notes}
                    helperText={errors.notes}
                    inputProps={{ maxLength: 500 }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
          <Grid sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Line Items</Typography>
            <Button
              variant="contained"
              color="success"
              startIcon={<AddIcon />}
              onClick={addRowHandler}
              size="small"
            >
              Add Row
            </Button>
          </Grid>

          <DashboardInvoiceTable
            lines={lines}
            updateLineItemHandler={updateLineItemHandler}
            deleteRowHandler={deleteRowHandler}
          />

          <Grid container spacing={2} justifyContent="flex-end">
            <Grid item xs={12} sm={4}>
              <Grid sx={{ textAlign: 'right' }}>
                <Typography variant="subtitle1" gutterBottom>
                  Sub Total
                </Typography>
                <Typography variant="h6" color="primary">
                  ₹{subtotal.toFixed(2)}
                </Typography>

                <Grid sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                  <Typography variant="subtitle1">Tax</Typography>
                  <TextField
                    type="number"
                    size="small"
                    sx={{ width: 120 }}
                    name="taxPercentage"
                    value={invoiceForm?.taxPercentage}
                    onChange={onChangeHandler}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                  <Typography variant="body1" sx={{ ml: 2 }}>
                    ₹{taxAmount.toFixed(2)}
                  </Typography>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h5" fontWeight="bold" color="primary.dark">
                  Invoice Amount: ₹{grandTotal.toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
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
}

export default InvoiceForm;