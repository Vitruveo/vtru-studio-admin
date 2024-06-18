import { useRef, useState } from 'react';
import { Box, Button, Modal as MuiModal, TextareaAutosize, Typography } from '@mui/material';
import { useDispatch } from '@/store/hooks';
import { requestConsignActionsCreators } from '@/features/requestConsign';
import { CommentsProps, LogsProps } from '../apps/requestConsign/RequestConsignDetails';

interface ModalProps {
    open: string | false;
    handleClose: () => void;
    title: string;
    content: LogsProps[] | CommentsProps[];
    requestId: string;
}

interface CommentsContent {
    content: CommentsProps[];
    requestId: string;
}

interface LogsContent {
    content: LogsProps[];
}

const Comments = ({ content, requestId }: CommentsContent) => {
    const dispatch = useDispatch();
    const textRef = useRef<HTMLTextAreaElement>(null);
    const [comments, setComments] = useState<CommentsProps[]>(content);

    const handleAddComment = () => {
        const comment = textRef.current?.value;
        if (comment) {
            setComments((prevComments) => [...prevComments, { comment }]);
            dispatch(requestConsignActionsCreators.setComments({ id: requestId, comments }));
            textRef.current.value = '';
        }
    };

    return (
        <>
            {comments.map((item, index) => (
                <Typography key={index} id="modal-modal-description" sx={{ mt: 2 }}>
                    {item.comment}
                </Typography>
            ))}
            <TextareaAutosize ref={textRef} aria-label="empty textarea" placeholder="Write a comment" />
            <Button variant="contained" onClick={handleAddComment}>
                Update
            </Button>
        </>
    );
};

const Logs = ({ content }: LogsContent) => {
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

export default function Modal({ open, handleClose, title, content, requestId }: ModalProps) {
    const renderContent = () => {
        if (title.includes('Logs')) {
            return <Logs content={content as LogsProps[]} />;
        } else {
            return <Comments content={content as CommentsProps[]} requestId={requestId} />;
        }
    };

    return (
        <MuiModal
            open={!!open}
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
                    {renderContent()}
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
