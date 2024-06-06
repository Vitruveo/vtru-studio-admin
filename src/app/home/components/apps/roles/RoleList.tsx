import List from '@mui/material/List';

import Scrollbar from '../../custom-scroll/Scrollbar';
import RoleListItem from './RoleListItem';
import { Role } from '@/features/role/types';

type Props = {
    roleId: string;
    data: Role[];
    onRoleClick(params: { id: string }): void;
    onDeleteClick(params: { id: string; name: string }): void;
};

export default function RoleList({ roleId, data, onRoleClick, onDeleteClick }: Props) {
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
            </List>
        </Scrollbar>
    );
}
