import Scrollbar from '../../custom-scroll/Scrollbar';
import RequestConsignListItem from './RequestConsignListItem';
import { RequestConsign } from '@/features/requestConsign';
import { Box, CircularProgress, List } from '@mui/material';

type Props = {
    requestConsignId: string;
    data: RequestConsign[];
    onClick(params: RequestConsign): void;
    loading?: boolean;
};

export default function RequestConsignList({ requestConsignId, data, loading, onClick }: Props) {
    return (
        <Scrollbar
            sx={{
                height: {
                    lg: 'calc(100vh - 360px)',
                    md: '100vh',
                },
            }}
        >
            <List>
                {loading && (
                    <Box display="flex" justifyContent="center">
                        <CircularProgress />
                    </Box>
                )}
                {data.map((item) => (
                    <RequestConsignListItem
                        key={item._id}
                        active={item._id === requestConsignId}
                        image=""
                        {...item}
                        onClick={() => onClick(item)}
                    />
                ))}
                {!data.length && !loading && <p style={{ textAlign: 'center' }}>No data</p>}
            </List>
        </Scrollbar>
    );
}
