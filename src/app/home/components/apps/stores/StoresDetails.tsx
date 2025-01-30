import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// Constants
import { Stores } from '@/features/stores/types';
import { STORE_STORAGE_URL } from '@/constants/asset';
import Image from 'next/image';
import { Review } from './review';

interface Props {
    store: Stores;
    handleApprove: () => void;
    handleReject: () => void;
}

export default function StoresDetails({ store, handleApprove, handleReject }: Props) {
    return (
        <Box display={'flex'} flexDirection={'column'} p={2} gap={2}>
            <Box display={'flex'} alignItems="center">
                <Typography variant="h5">Store Details</Typography>
            </Box>
            <Divider />
            <Box>
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

            <Box display="flex" gap={1} py={3}>
                <Image
                    src={`${STORE_STORAGE_URL}/${store.organization.formats?.logo.square.path}`}
                    width={200}
                    height={200}
                    alt={'logo'}
                />
                <Box>
                    {/*TODO - Add email of creator */}
                    <Typography>
                        <strong style={{ marginRight: '4px' }}>Store Owner:</strong> {store?.username} (
                        {store.emails[0].email})
                    </Typography>
                    <br />
                    <Typography>
                        <strong style={{ marginRight: '4px' }}>Name:</strong> {store.organization.name}
                    </Typography>
                    <Typography>
                        <strong style={{ marginRight: '4px' }}>URL:</strong> https://{store.organization.url}.xibit.live
                    </Typography>
                    {store.organization?.description && (
                        <Typography>
                            <strong style={{ marginRight: '4px' }}>Description:</strong>
                            {store.organization.description}
                        </Typography>
                    )}
                </Box>
            </Box>

            <Box display={'flex'} flexDirection={'column'} gap={2}>
                <Typography variant="h3">Filters</Typography>
                <Review values={store.artworks} />
            </Box>
        </Box>
    );
}
