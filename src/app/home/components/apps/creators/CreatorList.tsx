import { useEffect, useState } from 'react';
import List from '@mui/material/List';
import InfiniteScroll from 'react-infinite-scroll-component';

import { CreatorType } from '@/features/creator';
import CreatorListItem from './CreatorListItem';

type Props = {
    creatorId: string;
    data: CreatorType[];
    onCreatorClick(params: CreatorType): void;
    onDeleteClick(params: { id: string; email: string }): void;
};

type PaginatedData = {
    page: number;
    data: CreatorType[];
};

const PER_PAGE = 30;

export default function CreatorList({ creatorId, data, onCreatorClick, onDeleteClick }: Props) {
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
        <List>
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
                height="calc(100vh - 360px)"
            >
                {dataPaginated.data.map((creator) => (
                    <CreatorListItem
                        key={creator._id}
                        active={creator._id === creatorId}
                        image=""
                        {...creator}
                        onCreatorClick={() => onCreatorClick(creator)}
                        onDeleteClick={() => onDeleteClick({ id: creator._id, email: creator.emails[0].email })}
                        onStarredClick={() => {}}
                    />
                ))}
            </InfiniteScroll>
        </List>
    );
}
