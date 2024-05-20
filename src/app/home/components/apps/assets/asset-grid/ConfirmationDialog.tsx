import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Box } from '@mui/material';
import React, { useState } from 'react';

interface ConfirmationDialogProps {
    onConfirm: () => void;
    title?: string;
    description?: string;
    children?: (open: () => void, close: () => void) => React.ReactNode;
}

export const ConfirmationDialog = ({ onConfirm, title, description, children }: ConfirmationDialogProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const onOpen = () => {
        setIsOpen(true);
    };

    const onClose = () => {
        setIsOpen(false);
    };

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <Box>
            <Dialog
                open={isOpen}
                onClose={onClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">{description}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="error" onClick={onClose}>
                        No
                    </Button>
                    <Button onClick={handleConfirm} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
            {children?.(onOpen, onClose)}
        </Box>
    );
};
