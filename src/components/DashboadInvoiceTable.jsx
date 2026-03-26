import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { lineItems } from '../utils/constants';

const DashboardInvoiceTable = React.memo((props) => {
    const { lines, updateLineItemHandler, deleteRowHandler } = props;

    return (
        <>
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'grey.100' }}>
                            <TableCell>S.No</TableCell>
                            <TableCell>Item *</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell align="right">Qty *</TableCell>
                            <TableCell align="right">Rate *</TableCell>
                            <TableCell align="right">Disc %</TableCell>
                            <TableCell align="right">Amount</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {lines.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                    <TextField
                                        select
                                        fullWidth
                                        size="small"
                                        value={item.item}
                                        onChange={(e) => updateLineItemHandler(index, 'item', e.target.value)}
                                        SelectProps={{ native: true }}
                                    >
                                        <option value="">Select item</option>
                                        {lineItems?.map((val, index) => (
                                            <option key={val.value} value={val.value}>{val.name}</option>
                                        ))};
                                    </TextField>
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        value={item.description}
                                        onChange={(e) => updateLineItemHandler(index, 'description', e.target.value)}
                                        placeholder="Description"
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <TextField
                                        type="number"
                                        size="small"
                                        sx={{ width: 90 }}
                                        value={item.quantity}
                                        onChange={(e) => updateLineItemHandler(index, 'quantity', e.target.value)}
                                        inputProps={{ min: 0, step: 0.01 }}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <TextField
                                        type="number"
                                        size="small"
                                        sx={{ width: 90 }}
                                        value={item.rate}
                                        onChange={(e) => updateLineItemHandler(index, 'rate', e.target.value)}
                                        inputProps={{ min: 0, step: 0.01 }}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <TextField
                                        type="number"
                                        size="small"
                                        sx={{ width: 80 }}
                                        value={item.discountPct}
                                        onChange={(e) => updateLineItemHandler(index, 'discountPct', e.target.value)}
                                        inputProps={{ min: 0, max: 100, step: 0.01 }}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <Typography fontWeight="medium">
                                        ₹{item.amount.toFixed(2)}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        color="error"
                                        size="small"
                                        onClick={() => deleteRowHandler(index)}
                                        disabled={lines?.length <= 1}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
});

export default DashboardInvoiceTable;