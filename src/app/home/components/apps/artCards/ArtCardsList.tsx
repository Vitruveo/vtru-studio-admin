import InfiniteScroll from 'react-infinite-scroll-component';
import { Box, CircularProgress, List } from '@mui/material';

import { AssetType } from '@/app/home/types/apps/asset';
import Scrollbar from '../../custom-scroll/Scrollbar';
import ArtCardsItem from './ArtCardsItem';

type Props = {
    requestConsignId: string;
    data: AssetType[];
    onClick(params: AssetType): void;
    loading?: boolean;
    nextPage(): void;
    hasMore: boolean;
};

export default function ArtCardsList({ requestConsignId, data, loading, onClick, nextPage, hasMore }: Props) {
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
                        <ArtCardsItem
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
