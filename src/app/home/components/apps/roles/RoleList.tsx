import List from '@mui/material/List';

import Scrollbar from '../../custom-scroll/Scrollbar';
import RoleListItem from './RoleListItem';
import { Role } from '@/features/role/types';
import InfiniteScroll from 'react-infinite-scroll-component';

type Props = {
    roleId: string;
    data: Role[];
    onRoleClick(params: { id: string }): void;
    onDeleteClick(params: { id: string; name: string }): void;
    nextPage(): void;
    hasMore: boolean;
};

export default function RoleList({ roleId, data, onRoleClick, onDeleteClick, nextPage, hasMore }: Props) {
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
                <InfiniteScroll
                    dataLength={data.length}
                    next={nextPage}
                    hasMore={hasMore}
                    loader={<h4>Carregando...</h4>}
                    height="calc(100vh - 360px)"
                >
                    {data.map((role) => (
                        <RoleListItem
                            key={role._id}
                            active={role._id === roleId}
                            {...role}
                            onRoleClick={() => onRoleClick({ id: role._id })}
                            onDeleteClick={() => onDeleteClick({ id: role._id, name: role.name })}
                            onStarredClick={() => {}}
                        />
                    ))}
                </InfiniteScroll>
            </List>
        </Scrollbar>
    );
}
