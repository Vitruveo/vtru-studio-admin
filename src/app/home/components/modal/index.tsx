import { Box, Modal as MuiModal, Typography } from '@mui/material';
import { LogsProps } from '../apps/requestConsign/RequestConsignDetails';

interface ModalProps {
    open: boolean;
    handleClose: () => void;
    title: string;
    content: LogsProps[];
}

export default function Modal({ open, handleClose, title, content }: ModalProps) {
    const handleColorStatus = (status: string) => {
        if (status === 'failed') return { color: 'red' };
        if (status === 'pending') return { color: 'orange' };
        if (status === 'running') return { color: 'black' };
        if (status === 'finished') return { color: 'green' };

        return { color: 'black' };
    };

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
                <Box
                    sx={{
                        width: '100%',
                        height: 500,
                        overflowY: 'auto',
                    }}
                >
                    {content
                        .map((item, index) => (
                            <Typography
                                key={index}
                                id="modal-modal-description"
                                sx={{ mt: 2, ...handleColorStatus(item.status) }}
                            >
                                <b>status:</b>
                                {item.status} <br />
                                <b>message:</b>
                                {item.message} <br />
                                <b>when:</b>
                                {item.when} <br />
                            </Typography>
                        ))
                        .reverse()}

                    {!content.length && <Typography id="modal-modal-description">No logs</Typography>}
                </Box>
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
