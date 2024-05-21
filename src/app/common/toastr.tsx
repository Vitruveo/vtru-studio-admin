import * as React from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

export interface CustomizedSnackbarState {
    type: '' | 'success' | 'info' | 'warning' | 'error';
    open: boolean;
    message: string | React.ReactNode;
    autoClose?: boolean;
}

interface CustomizedSnackbarProps extends CustomizedSnackbarState {
    setOpenState: (state: CustomizedSnackbarState) => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CustomizedSnackbar({
    type,
    open,
    message,
    autoClose = true,
    setOpenState,
}: CustomizedSnackbarProps) {
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenState({ open: false, type: '', message: '' });
    };

    return (
        <Stack spacing={2} sx={{ width: '100%' }}>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={open}
                autoHideDuration={autoClose ? 5000 : null}
                onClose={handleClose}
            >
                {!type || !type.length ? (
                    <div />
                ) : (
                    <Alert onClose={handleClose} severity={type} sx={{ width: '100%', color: 'white' }}>
                        {message}
                    </Alert>
                )}
            </Snackbar>
        </Stack>
    );
}
