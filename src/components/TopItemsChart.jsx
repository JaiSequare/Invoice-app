import React from "react";
import { Paper, Typography } from "@mui/material";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import { colors } from "../utils/constants";

const TopItemsChart = React.memo(({ data = [] }) => {

    const customerMap = data.reduce((acc, curr) => {
        const customer = curr.customerName || "Unknown";
        const amount = Number(curr.invoiceAmount) || 0;
        acc[customer] = (acc[customer] || 0) + amount;
        return acc;
    }, {});

    const chartData = Object.entries(customerMap)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8);

    if (chartData.length === 0) {
        return (
            <Paper sx={{ p: 2, textAlign: "center", color: "text.secondary" }}>
                <Typography variant="body2">No customer data available</Typography>
            </Paper>
        );
    };

    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant="body2" mb={1}>
                Top Items
            </Typography>

            <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                    <Pie data={chartData} dataKey="value" outerRadius={50}>
                        {chartData.map((_, i) => (
                            <Cell key={i} fill={colors[i % colors.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </Paper>
    );
});

export default TopItemsChart;