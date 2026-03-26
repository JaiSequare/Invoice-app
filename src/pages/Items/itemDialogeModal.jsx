import React, { useState, useCallback, useMemo } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography, IconButton, InputAdornment, Grid } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { decimalRegex, invaliditemnameMsg, emptyitemnameMsg, emptysalerateMsg, initialItemState, invalidsalerateMsg, emptydiscountMsg, imageType, invalidnumsalerateMsg, mex500Char } from "../../utils/constants";

const AddItemDialog = React.memo((props) => {
    const { open, modalType, getListData, title, closeHanlder, saveHandler } = props;

    const [itemForm, setItemForm] = useState(modalType ? initialItemState : getListData);
    const [errors, setErrors] = useState({});

    // OnChange Function
    const onChangeHandler = useCallback((e) => {
        const { name, value, files } = e.target;
        // For numeric fields
        if (name?.toLowerCase() === "salerate" || name?.toLowerCase() === "discountpct") {
            const validNum = checkNumberHandler(value);
            if (validNum === null) return;
            setItemForm((prev) => ({
                ...prev,
                [name]: validNum
            }));
            return;
        };

        // For image upload
        if (name?.toLowerCase() === "itempicture") {
            const file = files[0];
            if (!file) return;
            // Validate image type before uploading
            if (!imageType?.includes(file.type)) {
                setErrors((prev) => ({
                    ...prev,
                    itemPicture: "Only PNG/JPG format allowed"
                }));
                return;
            };
            // Check image upload size
            if (file.size > 5 * 1024 * 1024) {
                setErrors((prev) => ({
                    ...prev,
                    itemPicture: "Max size 5MB allowed"
                }));
                return;
            };
            const preview = URL.createObjectURL(file);
            setItemForm((prev) => ({
                ...prev,
                itemPicture: file.name,
                preview
            }));
            setErrors((prev) => ({ ...prev, itemPicture: "" }));
        } else {
            setItemForm((prev) => ({
                ...prev,
                [name]: value
            }));
        };
    }, []);

    // Validation handler for all inputs
    const validateHandler = useCallback(() => {
        let tempVar = {};

        // validate name
        if (!itemForm?.itemName.trim()) {
            tempVar.itemName = emptyitemnameMsg;
        } else if (itemForm?.itemName?.length > 50) {
            tempVar.itemName = invaliditemnameMsg;
        };

        // validate sale rate with NAN (char/special char not allowed)
        if (itemForm?.salesRate === "") {
            tempVar.salesRate = emptysalerateMsg;
        } else if (isNaN(Number(itemForm?.salesRate))) {
            tempVar.salesRate = invalidnumsalerateMsg;
        } else if (Number(itemForm?.salesRate) < 0) {
            tempVar.salesRate = invalidsalerateMsg;
        }

        // validate discount
        if (itemForm?.discountPct !== "") {
            const val = Number(itemForm?.discountPct);
            if (val < 0 || val > 100) {
                tempVar.discountPct = emptydiscountMsg;
            }
        };

        // validate discription
        if (itemForm?.description?.length > 500) {
            tempVar.description = mex500Char;
        };

        setErrors(tempVar);
        return Object.keys(tempVar)?.length === 0;
    }, [itemForm]);

    // Number input handler with decimal regex
    const checkNumberHandler = (value, maxLength = 10) => {
        if (!decimalRegex.test(value)) return null;
        if (value.length > maxLength) return null;
        return value;
    };

    // Submit handler
    const submitHandler = useCallback(async () => {
        if (!validateHandler()) return;
        await saveHandler(itemForm);
        setItemForm(initialItemState);
        setErrors({});
        closeHanlder();
    }, [itemForm, validateHandler, saveHandler, closeHanlder]);

    // Preview url
    const previewUrl = useMemo(() => itemForm.preview, [itemForm.preview]);

    return (
        <Dialog open={open} onClose={closeHanlder}>
            <DialogTitle> {title}
                <IconButton onClick={closeHanlder} sx={{ position: "absolute", right: 10, top: 10 }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Grid sx={{ mt: 2, mb: 3 }}>
                    <Typography sx={{ mb: 1 }}>Item Picture</Typography>
                    <Grid sx={{ display: "flex", gap: 2, mb: 2 }}>
                        <Grid sx={{
                            width: 100,
                            height: 85,
                            border: "1px dashed #ccc",
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden"
                        }}>
                            {previewUrl
                                ? <img src={previewUrl} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                : <Typography variant="caption">Preview</Typography>
                            }
                        </Grid>
                        <TextField
                            type="file"
                            name="itemPicture"
                            onChange={onChangeHandler}
                            fullWidth
                            helperText={errors.itemPicture || "PNG or JPG, max 5MB"}
                            error={!!errors.itemPicture}
                            inputProps={{ accept: "image/png, image/jpeg" }}
                        />
                    </Grid>
                </Grid>

                <Grid sx={{ mt: 2, mb: 3 }}>
                    <Typography sx={{ mb: 1 }}>Item Name *</Typography>
                    <TextField
                        fullWidth
                        placeholder="Enter item Name"
                        name="itemName"
                        value={itemForm.itemName}
                        onChange={onChangeHandler}
                        error={!!errors.itemName}
                        helperText={errors.itemName}
                    />
                </Grid>

                <Grid sx={{ mt: 2, mb: 3 }}>
                    <Typography sx={{ mb: 1 }}>Description</Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        placeholder="Enter item description"
                        name="description"
                        value={itemForm.description}
                        onChange={onChangeHandler}
                        error={!!errors.description}
                        helperText={errors.description || "0/500 characters"}
                    />
                </Grid>

                <Grid sx={{ mt: 2, mb: 3 }}>
                    <Typography sx={{ mb: 1 }}>Sale Rate *</Typography>
                    <TextField
                        fullWidth
                        type="text"
                        placeholder="0.00"
                        name="salesRate"
                        value={itemForm.salesRate}
                        onChange={onChangeHandler}
                        error={!!errors.salesRate}
                        helperText={errors.salesRate}
                        inputProps={{
                            inputMode: "decimal",
                            style: { textAlign: "right" }
                        }}
                        sx={{
                            "& input[type=number]": { MozAppearance: "textfield" },
                            "& input[type=number]::-webkit-outer-spin-button": { WebkitAppearance: "none", margin: 0 },
                            "& input[type=number]::-webkit-inner-spin-button": { WebkitAppearance: "none", margin: 0 }
                        }}
                    />
                </Grid>

                <Grid sx={{ mt: 2, mb: 3 }}>
                    <Typography sx={{ mb: 1 }}>Discount %</Typography>
                    <TextField
                        fullWidth
                        type="text"
                        placeholder="0"
                        name="discountPct"
                        value={itemForm.discountPct}
                        onChange={onChangeHandler}
                        error={!!errors.discountPct}
                        helperText={errors.discountPct}
                        inputProps={{
                            inputMode: "decimal",
                            style: { textAlign: "right" }
                        }}
                        InputProps={{
                            endAdornment: (<InputAdornment position="end"> % </InputAdornment>)
                        }}
                        sx={{
                            "& input[type=number]": {
                                MozAppearance: "textfield"
                            },
                            "& input[type=number]::-webkit-outer-spin-button": {
                                WebkitAppearance: "none",
                                margin: 0
                            },
                            "& input[type=number]::-webkit-inner-spin-button": {
                                WebkitAppearance: "none",
                                margin: 0
                            }
                        }}
                    />
                </Grid>
            </DialogContent>

            <DialogActions sx={{ px: 3 }}>
                <Button onClick={closeHanlder} variant="text">Cancel</Button>
                <Button variant="contained" onClick={submitHandler}>Save</Button>
            </DialogActions>
        </Dialog>
    );
});

export default AddItemDialog;