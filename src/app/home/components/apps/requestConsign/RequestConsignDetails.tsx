import { BASE_URL_STORE } from '@/constants/api';
import { useSelector } from '@/store/hooks';
import { Button, CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { IconMessage, IconNotes } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import Modal from '../../modal';

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

export interface LogsProps {
    status: string;
    message: string;
    when: string;
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
    const logs: LogsProps[] = useSelector((state) => state.requestConsign.byId[requestId]?.logs || []);
    const statusRequestConsign = useSelector((state) => state.requestConsign.byId[requestId]?.status || '');

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
                                <IconNotes size="18" stroke={1.3} />
                                {statusRequestConsign === 'running' && <CircularProgress size={20} />}
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Comments">
                            <IconButton>
                                <IconMessage size="18" stroke={1.3} />
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
            <Modal open={open} handleClose={handleClose} title="View Logs" content={logs} />
        </>
    );
}
