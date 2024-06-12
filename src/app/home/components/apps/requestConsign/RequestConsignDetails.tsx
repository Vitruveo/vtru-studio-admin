import { BASE_URL_STORE } from '@/constants/api';
import { useSelector } from '@/store/hooks';
import { Button, CircularProgress, Modal } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { IconNotes, IconPencil, IconTrash } from '@tabler/icons-react';
import { useMemo, useState } from 'react';

interface Props {
    requestId: string;
    username: string;
    title: string;
    assetId: string;
    emails: {
        email: string;
        codeHash: string | null;
        checkedAt: Date | null;
    }[];
    handleApprove: () => void;
    handleReject: () => void;
    handleOpenStore: () => void;
}

export default function RequestConsignDetails({
    requestId,
    username,
    title,
    emails,
    assetId,
    handleApprove,
    handleReject,
    handleOpenStore,
}: Props) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const url = useMemo(() => `${BASE_URL_STORE}/preview/${assetId}/${Date.now()}`, [assetId]);
    const logs = useSelector((state) => state.requestConsign.byId[requestId]?.logs || []);
    const statusRequestConsign = useSelector((state) => state.requestConsign.byId[requestId]?.status || '');

    const handleColorStatus = (status: string) => {
        if (status === 'failed') return { color: 'red' };
        if (status === 'pending') return { color: 'orange' };
        if (status === 'running') return { color: 'black' };
        if (status === 'finished') return { color: 'green' };

        return { color: 'black' };
    };

    return (
        <>
            <Box p={3} py={2} display={'flex'} alignItems="center">
                <Typography variant="h5">Request Consign Details</Typography>
            </Box>
            <Divider />
            <Box p={2}>
                <Stack gap={0} direction="row" justifyContent="space-between">
                    <Box display="flex" gap={1}>
                        <Button variant="contained" onClick={handleApprove}>
                            Approve and Consign
                        </Button>
                        <Button variant="contained" onClick={handleOpenStore}>
                            Open in New Window
                        </Button>
                        <Tooltip title="Logs">
                            <IconButton onClick={handleOpen}>
                                <IconNotes size="18" stroke={1.3} style={{ marginRight: 5 }} />
                                {statusRequestConsign === 'running' && <CircularProgress size={20} />}
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleReject}
                        disabled={statusRequestConsign !== 'pending'}
                    >
                        Reject
                    </Button>
                </Stack>
            </Box>

            <Box display="flex" gap={1} p={2}>
                <Typography>Title: {title}</Typography>
                <Typography>Username: {username}</Typography>

                {emails.map((item) => (
                    <Typography key={item.email}>Email: {item.email}</Typography>
                ))}
            </Box>

            <Box
                p={2}
                sx={{
                    overflowY: 'auto',
                    height: 'calc(100vh - 460px)',
                    width: '100%',
                }}
            >
                <iframe
                    src={url}
                    title="Viorika Art"
                    width="100%"
                    height="3000px"
                    frameBorder="0"
                    scrolling="no"
                    allow="fullscreen"
                    style={{ border: 'none' }}
                />
            </Box>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        View logs
                    </Typography>
                    <Box
                        sx={{
                            width: '100%',
                            height: 500,
                            overflowY: 'auto',
                        }}
                    >
                        {logs
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

                        {!logs.length && <Typography id="modal-modal-description">No logs</Typography>}
                    </Box>
                </Box>
            </Modal>
        </>
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
