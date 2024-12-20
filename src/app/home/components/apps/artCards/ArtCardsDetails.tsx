import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Image from 'next/image';

// Constants
import { ASSET_STORAGE_URL } from '@/constants/asset';

interface Props {
    username: string;
    title: string;
    emails: {
        email: string;
        codeHash: string | null;
        checkedAt: Date | null;
    }[];
    status: string;
    preview: string;
    handleApprove: () => void;
    handleReject: () => void;
}

export default function ArtCardsDetails({
    username,
    title,
    emails,
    status,
    preview,
    handleApprove,
    handleReject,
}: Props) {
    return (
        <>
            <Box p={3} py={2} display={'flex'} alignItems="center">
                <Typography variant="h5">Art Cards Details</Typography>
            </Box>
            <Divider />
            <Box p={2}>
                <Stack gap={0} direction="row" justifyContent="space-between">
                    <Box display="flex" gap={1} alignItems={'center'}>
                        <Button disabled={['approved'].includes(status)} variant="contained" onClick={handleApprove}>
                            Approve
                        </Button>
                    </Box>
                    <Box display="flex" gap={2}>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleReject}
                            disabled={['rejected'].includes(status)}
                        >
                            Reject Art Card
                        </Button>
                    </Box>
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
                <Image src={`${ASSET_STORAGE_URL}/${preview}`} width={500} height={500} alt={title} />
            </Box>
        </>
    );
}
