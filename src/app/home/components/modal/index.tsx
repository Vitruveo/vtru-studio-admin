import React from 'react';
import { Box, Modal as MuiModal, Typography } from '@mui/material';

interface ModalProps {
    open: boolean;
    handleClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function Modal({ open, handleClose, title, children }: ModalProps) {
    return (
        <MuiModal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {title}
                </Typography>
                <Box>{children}</Box>
            </Box>
        </MuiModal>
    );
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
