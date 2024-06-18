import { BASE_URL_STORE } from '@/constants/api';
import { useDispatch, useSelector } from '@/store/hooks';
import { Button, CircularProgress, TextareaAutosize } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { IconMessage, IconNotes } from '@tabler/icons-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import Modal from '../../modal';
import { requestConsignAddCommentThunk } from '@/features/requestConsign/thunks';
import { CommentsProps, LogsProps } from '@/features/requestConsign/types';

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

interface SelectModalProps {
    owner: string;
}

export interface CommentsContent {
    content: CommentsProps[];
    requestId: string;
}

export interface LogsContent {
    content: LogsProps[];
}

export const Logs = ({ content }: LogsContent) => {
    const handleColorStatus = (status: string) => {
        if (status === 'failed') return { color: 'red' };
        if (status === 'pending') return { color: 'orange' };
        if (status === 'running') return { color: 'black' };
        if (status === 'finished') return { color: 'green' };

        return { color: 'black' };
    };

    return (
        <>
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
        </>
    );
};

export const Comments = ({ content, requestId }: CommentsContent) => {
    const dispatch = useDispatch();
    const textRef = useRef<HTMLTextAreaElement>(null);
    const commentsEndRef = useRef<HTMLDivElement>(null);

    const handleAddComment = () => {
        const comment = textRef.current?.value;
        if (comment) {
            const comments = [...content, { comment }];
            dispatch(requestConsignAddCommentThunk({ requestId, comments }));
            textRef.current.value = '';
        }
    };

    useEffect(() => {
        commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [content]);

    return (
        <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
            <Box flexGrow={1} overflow="auto">
                {content.map((item, index) => (
                    <Typography key={index} id="modal-modal-description" sx={{ mt: 2 }}>
                        {item.comment}
                    </Typography>
                ))}
                {!content.length && <Typography id="modal-modal-description">No Comments</Typography>}
                <div ref={commentsEndRef} />
            </Box>
            <Box display="flex" justifyContent="space-between" height={'15%'} alignItems={'end'}>
                <TextareaAutosize
                    ref={textRef}
                    aria-label="empty textarea"
                    placeholder="Write a comment"
                    style={{ width: '100%', height: '100%', padding: '10px', resize: 'none' }}
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
    emails,
    assetId,
    handleApprove,
    handleReject,
    handleOpenStore,
}: Props) {
    const [open, setOpen] = useState<boolean>(false);
    const [titleModal, setTitleModal] = useState<string>('');
    const handleClose = () => setOpen(false);

    const url = useMemo(() => `${BASE_URL_STORE}/preview/${assetId}/${Date.now()}`, [assetId]);
    const logs: LogsProps[] = useSelector((state) => state.requestConsign.byId[requestId]?.logs || []);
    const comments: CommentsProps[] = useSelector((state) => state.requestConsign.byId[requestId]?.comments || []);
    const statusRequestConsign = useSelector((state) => state.requestConsign.byId[requestId]?.status || '');

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
                        <Button variant="contained" onClick={handleApprove}>
                            Approve and Consign
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
                                <IconMessage size="18" stroke={1.3} />
                            </IconButton>
                        </Tooltip>
                        {statusRequestConsign === 'running' && <CircularProgress size={20} />}
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
            {titleModal.includes('Logs') && (
                <Modal open={open} handleClose={handleClose} title={titleModal}>
                    <Logs content={logs} />
                </Modal>
            )}
            {titleModal.includes('Comments') && (
                <Modal open={open} handleClose={handleClose} title={titleModal}>
                    <Comments content={comments} requestId={requestId} />
                </Modal>
            )}
        </>
    );
}
