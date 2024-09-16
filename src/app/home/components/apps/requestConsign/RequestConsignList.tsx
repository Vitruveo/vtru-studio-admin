import Scrollbar from '../../custom-scroll/Scrollbar';
import RequestConsignListItem from './RequestConsignListItem';
import { RequestConsign } from '@/features/requestConsign';
import { Box, CircularProgress, List } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';

type Props = {
    requestConsignId: string;
    data: RequestConsign[];
    onClick(params: RequestConsign): void;
    loading?: boolean;
    nextPage(): void;
    hasMore: boolean;
};

export default function RequestConsignList({ requestConsignId, data, loading, onClick, nextPage, hasMore }: Props) {
    return (
        <Scrollbar
            sx={{
                height: {
                    lg: 'calc(100vh - 300px)',
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

                <InfiniteScroll
                    dataLength={data.length}
                    next={nextPage}
                    hasMore={hasMore}
                    loader={<h4>Loading...</h4>}
                    height="calc(100vh - 320px)"
                >
                    {data.map((item) => (
                        <RequestConsignListItem
                            key={item._id}
                            active={item._id === requestConsignId}
                            image=""
                            {...item}
                            onClick={() => onClick(item)}
                        />
                    ))}
                </InfiniteScroll>
            </List>
        </Scrollbar>
    );
}
