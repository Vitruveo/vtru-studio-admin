import { Box, Button, Dialog, DialogContent, DialogTitle } from '@mui/material';

interface ModalConfirmProps {
    yesClick: () => void;
    noClick?: () => void;
    show: boolean;
    handleClose: () => void;
}

export const ModalConfirm = ({ handleClose, yesClick, noClick, show }: ModalConfirmProps) => {
    const handleChangePage = () => {
        if (noClick) noClick();
        handleClose();
    };

    return (
        <Dialog maxWidth="lg" open={show} onClose={handleClose}>
            <DialogTitle color="GrayText">Add to Allow List?</DialogTitle>
            <DialogContent>
                <Box marginTop={3} width="100%" justifyContent="center" display="flex">
                    <Button
                        color="error"
                        variant="outlined"
                        size="small"
                        style={{ width: '122px', marginRight: '20px' }}
                        onClick={handleChangePage}
                    >
                        Cancel
                    </Button>
                    <Button
                        size="small"
                        style={{ width: '122px' }}
                        variant="contained"
                        color="primary"
                        onClick={yesClick}
                    >
                        Add
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};
