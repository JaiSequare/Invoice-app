import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Grid, Typography, TextField, Button, IconButton, Tooltip, Divider } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import AddItemDialog from "./itemDialogeModal";
import InvoiceTable from "../../components/InvoiceTable";
import { AddNewModalApi, DeleteModalApi, ExportItemApi, GetItemsApi, GetPictureThumbnailApi, GetUpdateModalApi, UpdateEditModalApi, UpdatePictureThumbnailApi } from "../../services/apiServices";
import AlertDialog from "../../components/alertDialogeModal/errorDialoge";
import FullPageLoader from "../../components/loader/Loading";
import { formatFormData } from "../../utils/constants";


const ItemList = () => {
    const columns = [
        {
            field: 'image', headerName: 'Picture', width: 120, align: 'center', headerAlign: 'center',
            renderCell: (params) => {
                const imgUrl = params.value;
                if (imgUrl && imgUrl.trim() !== '') {
                    return (
                        <Avatar
                            variant="rounded"
                            src={imgUrl}
                            alt="Product image"
                            sx={{ width: 48, height: 48, borderRadius: 1, border: '1px solid #e0e0e0' }}
                            imgProps={{ loading: 'lazy'}}
                        />
                    );
                }
                return (
                    <Avatar variant="rounded" sx={{ width: 48, height: 48, bgcolor: 'grey.200', borderRadius: 1 }}>
                        <ImageIcon sx={{ color: 'grey.500', fontSize: 32 }} />
                    </Avatar>
                );
            },
        },
        { field: 'itemName', headerName: 'Item Name', width: 300 },
        { field: 'description', headerName: 'Description', width: 400 },
        {
            field: 'salesRate', headerName: 'Sale Rate', width: 160,
            renderCell: (params) => <p style={{ fontSize: '15px' }}>$ {params.value}</p>
        },
        {
            field: 'discountPct', headerName: 'Discount %', width: 160,
            renderCell: (params) => <p style={{ fontSize: '15px' }}>{params.value} %</p>

        },
        {
            field: '', headerName: 'Actions', width: 150,
            sortable: false,
            filterable: false,
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

    const { token } = useSelector(state => state?.auth?.loginDetails);

    const [isLoading, setIsloading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [search, setSearch] = useState("");
    const [modalType, setModalType] = useState(false);
    const [open, setOpen] = useState(false);
    const [itemList, setItemList] = useState([]);
    const [getListData, setGetListData] = useState({});
    const [deleteData, setDeleteData] = useState({});
    const [selectDelete, setSelectDelete] = useState(false);

    useEffect(() => {
        getItemList();
    }, []);

    // Getting the list data
    const getItemList = async () => {
        setIsloading(true);
        try {
            const res = await GetItemsApi(token);
            if (res.status === 200 && res?.data) {
                setItemList(res.data);
            } else {
                setOpenModal(true);
                setErrMsg('Unable to load the list. Please try again.');
            }
            setIsloading(false);
        } catch (error) {
            setIsloading(false);
            setOpenModal(true);
            setErrMsg(error.message || "Failed to load data. Please try again later.");
        }
    };


    // New File Add open diloge modal
    const newItemOpenHandler = () => {
        setModalType(true);
        setOpen(true);
        setGetListData({});
    };

    // Close diloge modal
    const newItemCloseHandler = () => {
        setModalType(false);
        setOpen(false);
        setGetListData({});
    };

    // Add New Item handler
    const saveItemHandler = useCallback(async (initialState) => {
        const payload = {
            itemName: initialState?.itemName,
            description: initialState?.description,
            salesRate: initialState?.salesRate,
            discountPct: initialState?.discountPct,
            file: initialState?.itemPicture
        };
        setIsloading(true);
        try {
            const res = await AddNewModalApi(payload, token);
            if ((res.status === 201 || res.status === 200) && res?.data) {
                getItemList();
            } else {
                setOpenModal(true);
                setErrMsg('Unable to add list. Please try again.');
            }
            setIsloading(false);
        } catch (error) {
            setIsloading(false);
            setOpenModal(true);
            setErrMsg(error.message || "Failed to load data. Please try again later.");
        }
    }, []);

    // Update New Item handler
    const updateItemHandler = useCallback(async (updateState) => {
        if (updateState?.itemPicture) {
            updateThumbnailImageHandler(updateState);
        };

        const payload = {
            updatedOn: updateState?.updatedOn,
            itemID: updateState?.itemID,
            itemName: updateState?.itemName,
            description: updateState?.description,
            salesRate: updateState?.salesRate,
            discountPct: updateState?.discountPct,
        };
        try {
            setIsloading(true);
            const res = await UpdateEditModalApi(payload, token);
            if (res.status === 200 && res?.data) {
                getItemList();
            } else {
                setOpenModal(true);
                setErrMsg('Unable to update list. Please try again.');
            }
            setIsloading(false);
        } catch (error) {
            setIsloading(false);
            setOpenModal(true);
            setErrMsg(error.message || "Failed to load data. Please try again later.");
        }
    }, []);

    // Edit invoice handler
    const handleEdit = async (rowdata) => {
        setModalType(false);
        getThumbnailImageHandler(rowdata);
        try {
            setIsloading(true);
            const res = await GetUpdateModalApi(token, rowdata?.itemID);
            if (res.status === 200 && res?.data) {
                setGetListData(res?.data);
                setModalType(false);
                setOpen(true);
            } else {
                setOpenModal(true);
                setErrMsg('Unable to edit list. Please try again.');
            }
            setIsloading(false);
        } catch (error) {
            setIsloading(false);
            setOpenModal(true);
            setErrMsg(error.message || "Failed to load data. Please try again later.");
        }
    };

    // Get Thumbnail image for update
    const getThumbnailImageHandler = async (rowdata) => {
        try {
            setIsloading(true);
            const res = await GetPictureThumbnailApi(token, rowdata?.itemID);
            if (res.status === 200 && res?.data) {
                console.log("thumbnail_url", res.data);
                // Getting thumbnail Url and use it in preview section (incorrect server url)
            } else {
                setOpenModal(true);
                setErrMsg('Unable to fetch thumbnail image. Please try again.');
            }
            setIsloading(false);
        } catch (error) {
            setIsloading(false);
            setOpenModal(true);
            setErrMsg(error.message || "Failed to load data. Please try again later.");
        }
    };

    // Update Thumbnail image
    const updateThumbnailImageHandler = async (updateState) => {
        const payload = {
            itemID: updateState?.itemID,
            file: updateState?.itemPicture
        };
        const formDatapayload = formatFormData(payload);
        try {
            setIsloading(true);
            const res = await UpdatePictureThumbnailApi(token, formDatapayload);
            if (res.status === 200 && res?.data) {
                console.log("thumbnail_url", res.data);
                // Getting thumbnail Url and use it in preview section (incorrect server url)
            } else {
                setOpenModal(true);
                setErrMsg('Unable to fetch thumbnail image. Please try again.');
            }
            setIsloading(false);
        } catch (error) {
            setIsloading(false);
            setOpenModal(true);
            setErrMsg(error.message || "Failed to load data. Please try again later.");
        }
    };

    // Delete invoice handler
    const handleDelete = async (rowdata) => {
        setDeleteData(rowdata);
        setSelectDelete(true);
        setOpenModal(true);
        setErrMsg(`Are you sure you want to Delete this ${rowdata?.itemName} record?`);
    };

    // Confirm Delete handler
    const confirmDeleteInvoice = useCallback(async () => {
        setSelectDelete(false);
        try {
            setIsloading(true);
            const res = await DeleteModalApi(token, deleteData?.primaryKeyID);
            if (res.status === 200) {
                getItemList();
            } else {
                setOpenModal(true);
                setErrMsg('Unable to delete item. Please try again.');
            }
            setIsloading(false);
            closeDialogModal();
        } catch (error) {
            setIsloading(false);
            setOpenModal(true);
            setErrMsg(error.message || "Failed to load data. Please try again later.");
        }
    }, [deleteData]);

    // Close Dialoge Modal
    const closeDialogModal = useCallback(() => {
        setOpenModal(false);
        setDeleteData({});
    }, []);

    // Search input handler
    const searchHandler = (e) => {
        const { name, value } = e.target;
        setSearch(value);
    };

    // Search the list according to item name and description only
    const filteredData = useMemo(() => {
        if (!search.trim()) {
            return itemList;
        }
        const searchString = search.toLowerCase().trim();
        return itemList.filter((item) =>
            item.itemName?.toLowerCase().includes(searchString) ||
            item.description?.toLowerCase().includes(searchString)
        );
    }, [itemList, search]);

    // Export File handler
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

    return (
        <>
            <FullPageLoader open={isLoading} />
            <Grid sx={{ p: 3, background: "#f5f6f8", minHeight: "100vh" }}>
                <Grid sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Grid>
                        <Typography variant="h5" fontWeight={500} align="justify">
                            Items
                        </Typography>
                        <Typography color="text.secondary">
                            Manage your product and service catalog.
                        </Typography>
                    </Grid>
                </Grid>

                <Divider />

                <Grid sx={{ display: "flex", justifyContent: "space-between", mb: 2, mt: 3 }}>
                    <TextField
                        size="small"
                        placeholder="Search items..."
                        name="search"
                        value={search}
                        onChange={searchHandler}
                        sx={{ width: 300 }}
                        InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
                    />

                    <Grid sx={{ display: "flex", gap: 1 }}>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={newItemOpenHandler}
                        >
                            Add New Item
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<DownloadIcon />}
                            onClick={exportHandler}
                        >
                            Export
                        </Button>
                    </Grid>
                </Grid>

                <Grid sx={{ background: "white" }}>
                    {filteredData?.length === 0
                        ? <p>No items found for "{search}"</p>
                        : <InvoiceTable
                            columns={columns}
                            tableList={filteredData}
                        />
                    }
                </Grid>
            </Grid>

            {open && <AddItemDialog
                open={open}
                modalType={modalType}
                getListData={getListData}
                title={modalType ? "New Item" : "Update Item"}
                closeHanlder={newItemCloseHandler}
                saveHandler={modalType ? saveItemHandler : updateItemHandler}
            />}

            <AlertDialog
                title='Alert'
                descr={errMsg}
                open={openModal}
                close={closeDialogModal}
                onConfirm={selectDelete ? confirmDeleteInvoice : closeDialogModal}
            />
        </>
    );
};

export default ItemList;