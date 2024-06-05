import List from '@mui/material/List';

import Scrollbar from '../../custom-scroll/Scrollbar';
import UserListItem from './UserListItem';

import { UserType } from '@/mock/users';
import { User } from '@/features/user/types';

type Props = {
    userId: string;
    data: User[];
    onUserClick(params: { id: string }): void;
    onDeleteClick(params: { id: string; email: string }): void;
};

export default function UserList({ userId, data, onUserClick, onDeleteClick }: Props) {
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
                {data.map((user) => (
                    <UserListItem
                        key={user._id}
                        active={user._id === userId}
                        image=""
                        {...user}
                        onUserClick={() => onUserClick({ id: user._id })}
                        onDeleteClick={() => onDeleteClick({ id: user._id, email: user.login.email })}
                        onStarredClick={() => {}}
                    />
                ))}
            </List>
        </Scrollbar>
    );
}
