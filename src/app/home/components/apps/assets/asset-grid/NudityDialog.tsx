import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    Box,
    Typography,
    Radio,
    RadioGroup,
    FormControlLabel,
} from '@mui/material';
import React, { useState } from 'react';

interface NudityDialogProps {
    children?: (open: () => void, close: () => void) => React.ReactNode;
    onConfirm: (option: string) => void;
    assets: string[];
}

export const NudityDialog = ({ onConfirm, children, assets }: NudityDialogProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [option, setOption] = useState('');

    const onOpen = () => {
        setIsOpen(true);
    };

    const onClose = () => {
        setOption('');
        setIsOpen(false);
    };

    const handleConfirm = () => {
        if (!option) return;

        onConfirm(option);
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
                <DialogTitle id="alert-dialog-title">You are about to modify the following assets</DialogTitle>
                <DialogContent>
                    <DialogContentText
                        id="alert-dialog-description"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Box
                            sx={{
                                width: '100%',
                                maxHeight: 200,
                                overflowY: 'auto',
                                marginBottom: 3,
                            }}
                        >
                            {assets.map((asset) => (
                                <Typography key={asset}>{asset}</Typography>
                            ))}
                        </Box>
                        <Typography>What do you want to do?</Typography>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue="female"
                            name="radio-buttons-group"
                            style={{ flexDirection: 'row' }}
                            onChange={(e) => setOption(e.target.value)}
                        >
                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="no" control={<Radio />} label="No" />
                        </RadioGroup>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="error" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="outlined" disabled={!option.length} onClick={handleConfirm}>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
            {children?.(onOpen, onClose)}
        </Box>
    );
};
