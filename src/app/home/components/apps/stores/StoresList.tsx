import InfiniteScroll from 'react-infinite-scroll-component';
import { Box, CircularProgress, List } from '@mui/material';

import Scrollbar from '../../custom-scroll/Scrollbar';
import { Stores } from '@/features/stores/types';
import StoresItem from './StoresItem';

type Props = {
    storesId: string;
    data: Stores[];
    onClick(params: Stores): void;
    loading?: boolean;
    nextPage(): void;
    hasMore: boolean;
};

export default function StoresList({ storesId, data, loading, onClick, nextPage, hasMore }: Props) {
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
                        <StoresItem
                            key={item._id}
                            stores={item}
                            active={item._id === storesId}
                            onClick={() => onClick(item)}
                        />
                    ))}
                </InfiniteScroll>
            </List>
        </Scrollbar>
    );
}
