import React from "react";
import { Paper, Typography } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const RevenueChart = React.memo(({ data }) => {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="body2" mb={1}>
        Last 12 Months
      </Typography>

      <ResponsiveContainer width="100%" height={150}>
        <LineChart data={data}>
          <XAxis dataKey="invoiceDate" hide />
          <YAxis hide />
          <Tooltip />
          <Line type="monotone" dataKey="invoiceAmount" stroke="#1976d2" />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
});

export default RevenueChart;