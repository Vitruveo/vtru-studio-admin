import { useEffect, useState } from 'react';
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
};

type PaginatedData = {
    page: number;
    data: RequestConsign[];
};

const PER_PAGE = 30;

export default function RequestConsignList({ requestConsignId, data, loading, onClick }: Props) {
    const [dataPaginated, setDataPaginated] = useState<PaginatedData>({
        page: 1,
        data: data.slice(0, PER_PAGE),
    });

    useEffect(() => {
        if (data.length !== dataPaginated.data.length) {
            setDataPaginated({
                page: 1,
                data: data.slice(0, PER_PAGE),
            });
        }
    }, [data.length]);

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
                    dataLength={dataPaginated.data.length}
                    next={() => {
                        setDataPaginated((prevState) => ({
                            ...dataPaginated,
                            page: dataPaginated.page + 1,
                            data: [
                                ...prevState.data,
                                ...data.slice(dataPaginated.page * PER_PAGE, (dataPaginated.page + 1) * PER_PAGE),
                            ],
                        }));
                    }}
                    hasMore={dataPaginated.page < Math.ceil(data.length / PER_PAGE)}
                    loader={<h4>Carregando...</h4>}
                    height="calc(100vh - 320px)"
                >
                    {dataPaginated.data.map((item) => (
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
