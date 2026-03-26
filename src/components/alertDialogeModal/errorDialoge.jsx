import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const AlertDialog = (props) => {
    const { title, descr, open, close, onConfirm } = props;

    return (
        <React.Fragment>
            <Dialog
                open={open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {descr}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={close} autoFocus>
                        Cancel
                    </Button>
                    <Button onClick={onConfirm} autoFocus>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default AlertDialog;