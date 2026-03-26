import React from "react";
import { Backdrop, CircularProgress, Typography } from "@mui/material";

const FullPageLoader = React.memo(({ open, text = "Loading..." }) => {
    return (
        <Backdrop
            open={open}
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 999,
                color: "#fff",
                backgroundColor: "rgba(0, 0, 0, 0.5)", // light black shadow
                display: "flex",
                flexDirection: "column",
                gap: 2,
            }}
        >
            <CircularProgress color="inherit" />
            <Typography variant="h6">{text}</Typography>
        </Backdrop>
    );
});

export default FullPageLoader;