import List from '@mui/material/List';
import InfiniteScroll from 'react-infinite-scroll-component';
import Scrollbar from '../../custom-scroll/Scrollbar';
import { CreatorType } from '@/features/creator';
import CreatorListItem from './CreatorListItem';
import { Box, CircularProgress } from '@mui/material';

type Props = {
    creatorId: string;
    data: CreatorType[];
    onCreatorClick(params: CreatorType): void;
    onDeleteClick(params: { id: string; email: string }): void;
    nextPage(): void;
    loading: boolean;
    hasMore: boolean;
};

export default function creatorList({
    creatorId,
    data,
    loading,
    onCreatorClick,
    onDeleteClick,
    nextPage,
    hasMore,
}: Props) {
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
                    loader={<h4>Carregando...</h4>}
                    height="calc(100vh - 360px)"
                >
                    {data.map((creator) => (
                        <CreatorListItem
                            key={creator._id}
                            active={creator._id === creatorId}
                            image=""
                            {...creator}
                            onCreatorClick={() => onCreatorClick(creator)}
                            onDeleteClick={() => onDeleteClick({ id: creator._id, email: creator.emails[0].email })}
                            onStarredClick={() => { }}
                        />
                    ))}
                </InfiniteScroll>
            </List>
        </Scrollbar>
    );
}
