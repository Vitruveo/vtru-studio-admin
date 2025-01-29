import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// Constants
import { Stores } from '@/features/stores/types';
import { Preview } from './Preview';
import { STORE_STORAGE_URL } from '@/constants/asset';

interface Props {
    store: Stores;
    handleApprove: () => void;
    handleReject: () => void;
}

export default function StoresDetails({ store, handleApprove, handleReject }: Props) {
    return (
        <>
            <Box p={3} py={2} display={'flex'} alignItems="center">
                <Typography variant="h5">Store Details</Typography>
            </Box>
            <Divider />
            <Box p={2}>
                <Stack gap={0} direction="row" justifyContent="space-between">
                    <Box display="flex" gap={1} alignItems={'center'}>
                        <Button
                            disabled={['active'].includes(store.status)}
                            variant="contained"
                            onClick={handleApprove}
                        >
                            Approve
                        </Button>
                    </Box>
                    <Box display="flex" gap={2}>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleReject}
                            disabled={['inactive'].includes(store.status)}
                        >
                            Reject Store
                        </Button>
                    </Box>
                </Stack>
            </Box>

            <Box display="flex" gap={1} p={2}>
                <Typography>Title: {store.organization.name}</Typography>
                <Typography>Username: {store?.username}</Typography>
            </Box>

            <Box
                p={2}
                sx={{
                    overflowY: 'auto',
                    height: 'calc(100vh - 460px)',
                    width: '100%',
                }}
            >
                <Preview
                    title={store.organization.url || 'Store Name'}
                    description={store.organization.description || 'Store Description'}
                    domain={
                        store.organization.url
                            ? `https://${store.organization.url}.xibit.live`
                            : 'https://example.xibit.live'
                    }
                    banner={
                        store.organization.formats?.banner?.path
                            ? `${STORE_STORAGE_URL}/${store.organization.formats?.banner.path}`
                            : null
                    }
                    logo={`${STORE_STORAGE_URL}/${store.organization.formats?.logo.square.path}`}
                    logoHorizontal={`${STORE_STORAGE_URL}/${store.organization.formats?.logo.horizontal.path}`}
                />
            </Box>
        </>
    );
}
