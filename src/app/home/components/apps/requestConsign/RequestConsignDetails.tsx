import { BASE_URL_STORE } from '@/constants/api';
import { useDispatch } from '@/store/hooks';
import { Button, CircularProgress, Switch, TextareaAutosize, Badge } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { IconMessage, IconNotes } from '@tabler/icons-react';
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import Modal from '../../modal';
import {
    requestConsignAddCommentThunk,
    requestConsignByIdThunk,
    requestConsignUpdateCommentVisibilityThunk,
} from '@/features/requestConsign/thunks';
import { CommentsProps, LogsProps } from '@/features/requestConsign/types';
import { localeDate } from '@/utils/locale/date';

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
    logs?: LogsProps[];
    comments?: CommentsProps[];
    approvedBy?: string;
    status: string;
    handleApprove: () => void;
    handleReject: () => void;
    handleCancel: () => void;
    handleOpenStore: () => void;
}

interface SelectModalProps {
    owner: string;
}

export interface CommentsContent {
    requestId: string;
}

export interface LogsContent {
    requestId: string;
}

export const Logs = ({ requestId }: LogsContent) => {
    const dispatch = useDispatch();
    const [logs, setLogs] = useState<LogsProps[]>([]);

    const refresh = async () => {
        const response = await dispatch(requestConsignByIdThunk(requestId));

        setLogs(response.data?.logs || []);
    };

    useEffect(() => {
        refresh();
    }, []);

    const handleColorStatus = (status: string) => {
        if (status === 'failed') return { color: 'red' };
        if (status === 'pending') return { color: 'orange' };
        if (status === 'running') return { color: 'black' };
        if (status === 'finished') return { color: 'green' };

        return { color: 'black' };
    };

    return (
        <Box position="relative">
            <Button
                variant="contained"
                onClick={refresh}
                style={{
                    position: 'fixed',
                    right: 20,
                    top: 30,
                }}
            >
                Refresh
            </Button>

            {logs
                .sort((a, b) => (a.when > b.when ? -1 : 1))
                .map((item, index) => (
                    <Typography
                        key={item.when || index}
                        id="modal-modal-description"
                        sx={{ mt: 2, ...handleColorStatus(item.status) }}
                    >
                        <b>status:</b>
                        {item.status} <br />
                        <b>message:</b>
                        {item.message} <br />
                        <b>when:</b>
                        {item.when || ''} <br />
                    </Typography>
                ))}

            {!logs.length && <Typography id="modal-modal-description">No logs</Typography>}
        </Box>
    );
};

export const Comments = ({ requestId }: CommentsContent) => {
    const dispatch = useDispatch();
    const textRef = useRef<HTMLTextAreaElement>(null);
    const commentsEndRef = useRef<HTMLDivElement>(null);

    const handleAddComment = async () => {
        const comment = textRef.current?.value;
        if (comment) {
            await dispatch(requestConsignAddCommentThunk({ id: requestId, comment }));
            setTimeout(() => {
                refresh();
            }, 1_000);
            textRef.current.value = '';
        }
    };

    const handleChangeVisibility = async (e: ChangeEvent<HTMLInputElement>, commentId: string) => {
        const isPublic = e.target.checked;
        await dispatch(requestConsignUpdateCommentVisibilityThunk({ id: requestId, commentId, isPublic }));
        setTimeout(() => {
            refresh();
        }, 1_000);
    };

    const [comments, setComments] = useState<CommentsProps[]>([]);

    const refresh = async () => {
        const response = await dispatch(requestConsignByIdThunk(requestId));

        setComments(response.data?.comments || []);
    };

    useEffect(() => {
        refresh();
    }, []);

    return (
        <Box position="relative" display="flex" flexDirection="column" justifyContent="space-between" height="100%">
            <Button
                variant="contained"
                onClick={refresh}
                style={{
                    position: 'fixed',
                    right: 20,
                    top: 20,
                }}
            >
                Refresh
            </Button>

            <Box flexGrow={1} overflow="auto" mb={2}>
                {comments.map((item, index) => (
                    <Box key={index} mt={2} border={'1px solid gray'} p={1} borderRadius={1}>
                        <Box display={'flex'} justifyContent={'space-between'}>
                            <Typography color="#763EBD">{item.username || ''}</Typography>
                            <Typography variant="body2" style={{ textAlign: 'right' }}>
                                {localeDate(item.when || '')}
                            </Typography>
                        </Box>
                        <Box display={'flex'} justifyContent={'space-between'}>
                            <Typography fontWeight="bold" ml={2}>
                                {item.comment}
                            </Typography>
                            <Box display={'flex-start'} flexShrink={0}>
                                <Switch onChange={(e) => handleChangeVisibility(e, item.id)} checked={item.isPublic} />
                                <span>Public</span>
                            </Box>
                        </Box>
                    </Box>
                ))}
                {!comments.length && <Typography id="modal-modal-description">No Comments</Typography>}
                <div ref={commentsEndRef} />
            </Box>
            <Box display="flex" justifyContent="space-between" height={'15%'} alignItems={'end'}>
                <TextareaAutosize
                    ref={textRef}
                    aria-label="empty textarea"
                    placeholder="Write a comment"
                    style={{ width: '100%', maxHeight: '100%', overflowY: 'auto', padding: '10px', resize: 'none' }}
                />
                <Button variant="contained" onClick={handleAddComment} sx={{ ml: 2, height: 40 }}>
                    Update
                </Button>
            </Box>
        </Box>
    );
};

export default function RequestConsignDetails({
    requestId,
    username,
    title,
    approvedBy,
    emails,
    assetId,
    status,
    logs = [],
    comments = [],
    handleApprove,
    handleReject,
    handleCancel,
    handleOpenStore,
}: Props) {
    const [open, setOpen] = useState<boolean>(false);
    const [titleModal, setTitleModal] = useState<string>('');
    const handleClose = () => setOpen(false);

    const url = useMemo(() => `${BASE_URL_STORE}/preview/${assetId}/${Date.now()}`, [assetId]);

    const selectModal = ({ owner }: SelectModalProps) => {
        setOpen(true);
        setTitleModal(owner);
    };

    return (
        <>
            <Box p={3} py={2} display={'flex'} alignItems="center">
                <Typography variant="h5">Request Consign Details</Typography>
            </Box>
            <Divider />
            <Box p={2}>
                <Stack gap={0} direction="row" justifyContent="space-between">
                    <Box display="flex" gap={1} alignItems={'center'}>
                        <Button
                            disabled={['approved', 'canceled'].includes(status)}
                            variant="contained"
                            onClick={handleApprove}
                        >
                            {status === 'running' ? 'Re-Approve and Consign' : 'Approve and Consign'}
                        </Button>
                        <Button variant="contained" onClick={handleOpenStore}>
                            Open in New Window
                        </Button>
                        <Tooltip title="Logs">
                            <IconButton onClick={() => selectModal({ owner: 'View Logs' })}>
                                <IconNotes size="18" stroke={1.3} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Comments">
                            <IconButton onClick={() => selectModal({ owner: 'Comments' })}>
                                <Badge badgeContent={comments.length} color="primary">
                                    <IconMessage size="18" stroke={1.3} />
                                </Badge>
                            </IconButton>
                        </Tooltip>
                        {status === 'running' && <CircularProgress size={20} />}
                    </Box>
                    <Box display="flex" gap={2}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleCancel}
                            disabled={!(status === 'pending' || status === 'rejected' || status === 'error')}
                        >
                            Cancel Consign
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleReject}
                            disabled={!(status === 'pending' || status === 'error')}
                        >
                            Reject Consign
                        </Button>
                    </Box>
                </Stack>
            </Box>

            <Box display="flex" gap={1} p={2}>
                <Typography>Title: {title}</Typography>
                <Typography>Username: {username}</Typography>
                {approvedBy && <Typography>Approved by: {approvedBy}</Typography>}

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
            {titleModal.includes('Logs') && (
                <Modal open={open} handleClose={handleClose} title={titleModal}>
                    <Logs requestId={requestId} />
                </Modal>
            )}
            {titleModal.includes('Comments') && (
                <Modal open={open} handleClose={handleClose} title={titleModal}>
                    <Comments requestId={requestId} />
                </Modal>
            )}
        </>
    );
}
