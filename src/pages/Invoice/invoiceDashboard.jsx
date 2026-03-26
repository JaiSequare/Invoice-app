import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Grid,
    Typography,
    Button,
    TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import SearchIcon from "@mui/icons-material/Search";
import Tooltip from '@mui/material/Tooltip';
import StatCard from "../../components/StatCard";
import RevenueChart from "../../components/RevenueChart";
import InvoiceTable from "../../components/InvoiceTable";
import TopItemsChart from "../../components/TopItemsChart";
import { useNavigate } from "react-router";
import { deleteInvoiceApi, ExportItemApi, getAllDashDataApi, getNetricesApi } from "../../services/apiServices";
import { useSelector } from "react-redux";
import FullPageLoader from "../../components/loader/Loading";
import AlertDialog from "../../components/alertDialogeModal/errorDialoge";
import { formatDate } from "../../utils/constants";

const InvoiceDashboard = () => {
    // Static Column name for Invoide dahboard table
    const columns = [
        {
            field: 'invoiceNo', headerName: 'Invoice No', width: 100,
            renderCell: (params) => <p style={{ fontSize: '15px' }}>INV-{params.value}</p>
        },
        {
            field: 'invoiceDate', headerName: 'Date', width: 200,
            renderCell: (params) => <p style={{ fontSize: '15px' }}>{formatDate(params.value)}</p>
        },
        { field: 'customerName', headerName: 'Customer', width: 250 },
        { field: 'totalItems', headerName: 'Items', width: 100 },
        {
            field: 'subTotal', headerName: 'Sub Total', width: 150,
            renderCell: (params) => <p style={{ fontSize: '15px' }}>$ {params.value}</p>
        },
        { field: 'taxPercentage', headerName: 'Tax %', width: 100 },
        {
            field: 'taxAmount', headerName: 'Tax Amt', width: 150,
            renderCell: (params) => <p style={{ fontSize: '15px' }}>$ {params.value}</p>
        },
        {
            field: 'invoiceAmount', headerName: 'Total', width: 110,
            renderCell: (params) => <p style={{ fontSize: '15px' }}>$ {params.value}</p>
        },
        {
            field: '', headerName: 'Actions', width: 150, sortable: false, filterable: false,
            disableColumnMenu: true,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => {
                const rowdata = params.row;
                return (
                    <div style={{ display: 'flex', gap: 8 }}>
                        <Tooltip title="Edit Invoice">
                            <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleEdit(rowdata)}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Print Invoice">
                            <IconButton
                                size="small"
                                color="default"
                                onClick={() => handlePrint(rowdata)}
                            >
                                <PrintIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete Invoice">
                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDelete(rowdata)}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </div>
                );
            }
        },
    ];
    const navigate = useNavigate();
    const { token } = useSelector(state => state?.auth?.loginDetails);

    // Initial local states
    const [isLoading, setIsloading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [range, setRange] = useState("today");
    const [search, setSearch] = useState("");
    const [invoiceList, setInvoiceList] = useState([]);
    const [metrice, setMetrice] = useState([]);
    const [recall, setRecall] = useState(false);
    const [deleteData, setDeleteData] = useState({});
    const [selectDelete, setSelectDelete] = useState(false);

    // Initial Call List and dashboard API
    useEffect(() => {
        getDashboardData();
        getMetriceData();
    }, [recall]);

    // Get dashboard invoice lists 
    const getDashboardData = async () => {
        try {
            setIsloading(true);
            const formdate = ["2025-09-01", "2025-10-01"];
            const res = await getAllDashDataApi(token, formdate);
            if (res.status === 200 || res.data) {
                setInvoiceList(res.data);
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

    // Get dashboard total count and invoice 
    const getMetriceData = async () => {
        try {
            setIsloading(true);
            const res = await getNetricesApi(token);
            if (res.status === 200 || res.data) {
                const obj = res.data?.[0] || {};
                setMetrice(obj);
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

    // search handler
    const searchHandler = (e) => {
        const { name, value } = e.target;
        setSearch(value);
    };

    // filter by search
    const filteredInvoices = useMemo(() => {
        if (!search.trim()) return invoiceList;

        const term = search.toLowerCase();
        return invoiceList.filter(inv =>
            inv.invoiceNo?.includes(term) ||
            inv.customerName?.toLowerCase().includes(term) ||
            inv.invoiceDate?.includes(term) ||
            String(inv.invoiceAmount || 0).includes(term)
        );
    }, [search, invoiceList]);

    // Day wise Search handler
    const dayWiseSearchHandler = (dayname) => {
        console.log("Selected_Time", dayname);
    };

    // Open new invoice modal
    const openNewInvoicedialoge = () => {
        navigate("/invoice/new");
    };

    // Export invoice table
    const exportHandler = async () => {
        const payload = {};
        try {
            setIsloading(true);
            const res = await ExportItemApi(token, payload);
            if (res.status === 200) {
                // Download CSV file Here (API not given in Docs)
            } else {
                setOpenModal(true);
                setErrMsg('Unable to export item. Please try again.');
            }
            setIsloading(false);
        } catch (error) {
            setIsloading(false);
            setOpenModal(true);
            setErrMsg(error.message || "Failed to load data. Please try again later.");
        }
    };

    // Edit invoice handler
    const handleEdit = async (rowdata) => {
        navigate(`/invoice/${rowdata?.invoiceID}`);
    };

    // Print invoice handler
    const handlePrint = (rowdata) => {
        window.print();
    };

    // Delete invoice handler /  open diloge modal
    const handleDelete = async (rowdata) => {
        setDeleteData(rowdata);
        setSelectDelete(true);
        setOpenModal(true);
        setErrMsg(`Are you sure you want to Delete this ${rowdata?.invoiceID} record?`);
    };

    // Confirm Delete Handler
    const confirmDeleteInvoice = useCallback(async () => {
        setSelectDelete(false);
        try {
            setIsloading(true);
            const res = await deleteInvoiceApi(token, deleteData?.invoiceID);
            if (res.status === 200 || res.data) {
                setRecall(true);
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
    }, [deleteData]);

    // Close Dialoge Modal
    const closeDialogModal = useCallback(() => {
        setOpenModal(false);
    }, []);

    // Redirect to invoice item page
    const invoiceItemHandler = () => {
        navigate('/invoice/items');
    };

    return (
        <>
            <FullPageLoader open={isLoading} />
            <Grid sx={{ p: 3, background: "#f5f6f8", minHeight: "100vh" }}>
                <Grid sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                    <Typography variant="h5">Invoices</Typography>
                    <Grid
                        size="small"
                        value={range}
                        onChange={(e, val) => val && setRange(val)}
                    >
                        <Button variant="outlined" size="small" value="today" onClick={() => dayWiseSearchHandler("today")}>Today</Button>
                        <Button variant="outlined" size="small" value="week" onClick={() => dayWiseSearchHandler("week")}>Week</Button>
                        <Button variant="outlined" size="small" value="month" onClick={() => dayWiseSearchHandler("month")}>Month</Button>
                        <Button variant="outlined" size="small" value="year" onClick={() => dayWiseSearchHandler("year")}>Year</Button>
                        <Button variant="outlined" size="small" value="custom" onClick={() => dayWiseSearchHandler("custom")}>Custom</Button>
                    </Grid>
                </Grid>

                <Grid sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 2, mb: 3 }}>
                    <StatCard title="Invoices" value={metrice.invoiceCount} sub="Today" />
                    <StatCard title="Total Amount" value={`$${metrice.totalAmount}`} sub="Today" />
                    <RevenueChart data={filteredInvoices} />
                    <TopItemsChart data={filteredInvoices} />
                </Grid>

                <Grid sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <TextField
                    sx={{width:"30%"}}
                        size="small"
                        placeholder="Search Invoice No, Customer..."
                        value={search}
                        onChange={searchHandler}
                        InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
                    />

                    <Grid sx={{ display: "flex", gap: 1 }}>
                        <Button variant="contained" startIcon={<AddIcon />} onClick={openNewInvoicedialoge}>
                            New Invoice
                        </Button>
                        <Button variant="outlined" startIcon={<DownloadIcon />} onClick={exportHandler}>
                            Export
                        </Button>
                         <Button variant="outlined" startIcon={<DownloadIcon />} onClick={invoiceItemHandler}>
                            Invoice Items
                        </Button>
                    </Grid>
                </Grid>

                {/* TABLE PLACEHOLDER */}
                <InvoiceTable
                    columns={columns}
                    tableList={filteredInvoices}
                />
            </Grid>

            <AlertDialog
                title={'Alert'}
                descr={errMsg}
                open={openModal}
                close={closeDialogModal}
                onConfirm={selectDelete ? confirmDeleteInvoice : closeDialogModal}
            />
        </>
    );
};

export default InvoiceDashboard;