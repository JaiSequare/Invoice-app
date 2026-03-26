import React from "react";
import { DataGrid } from '@mui/x-data-grid';
import { pageCount } from '../utils/constants';
import { Grid } from "@mui/material";

const paginationModel = { page: 0, pageSize: 5 };

// Invoice table component
const InvoiceTable = React.memo((props) => {
    const { columns, tableList } = props;
    return (
        <Grid sx={{ height: 400, width: '100%' }}>
            <DataGrid
                columns={columns}
                rows={tableList}
                getRowId={(row) => row.primaryKeyID}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={pageCount}
                disableColumnMenu
                disableRowSelectionOnClick
            />
        </Grid>
    );
});

export default InvoiceTable;