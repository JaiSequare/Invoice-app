import React from "react";
import { Paper, Typography } from "@mui/material";

const StatCard = React.memo(({ title, value, sub }) => {
    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant="h6">{value}</Typography>
            <Typography variant="body2">{title}</Typography>
            <Typography variant="caption" color="text.secondary">
                {sub}
            </Typography>
        </Paper>
    );
});

export default StatCard;