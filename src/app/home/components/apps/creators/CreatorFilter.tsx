import { Box, Switch } from '@mui/material';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import { IconMail, IconSend } from '@tabler/icons-react';

interface DataType {
    id: number;
    name?: string | React.ReactNode;
    sort?: string;
    icon?: any;
    filterbyTitle?: string;
    devider?: boolean;
    color?: string;

    onClick?(): void;
}

interface Props {
    handleToggleOnline(): void;
    handleToggleBlocked(): void;
}

export default function CreatorFilter({ handleToggleOnline, handleToggleBlocked }: Props) {
    const customizer = {
        borderRadius: 7,
    };
    const br = `${customizer.borderRadius}px`;

    const filterData: DataType[] = [
        {
            id: 2,
            name: 'All Creators',
            sort: '',
            icon: IconMail,
        },
        {
            id: 3,
            name: 'Starred',
            sort: 'starred',
            icon: IconSend,
        },
        {
            id: 4,
            devider: true,
        },
        {
            id: 5,
            filterbyTitle: 'Categories',
        },
        {
            id: 6,
            name: (
                <Box>
                    <Switch onChange={handleToggleOnline}></Switch> <span>Online</span>
                </Box>
            ),
            sort: 'online',
            icon: null,
        },
        {
            id: 7,
            name: (
                <Box>
                    <Switch onChange={handleToggleBlocked}></Switch> <span>Blocked</span>
                </Box>
            ),
            sort: 'blocked',
            icon: null,
        },
    ];

    return (
        <>
            <List>
                {filterData.map((filter) => {
                    if (filter.filterbyTitle) {
                        return (
                            <Typography variant="subtitle1" fontWeight={600} pl={5.1} mt={1} pb={2} key={filter.id}>
                                {filter.filterbyTitle}
                            </Typography>
                        );
                    } else if (filter.devider) {
                        return <Divider key={filter.id} sx={{ mb: 3 }} />;
                    }

                    return (
                        <ListItemButton
                            sx={{ mb: 1, mx: 3, borderRadius: br }}
                            selected={filter.sort === ''}
                            onClick={filter.onClick}
                            key={filter.id}
                        >
                            {filter.icon && (
                                <ListItemIcon
                                    sx={{
                                        minWidth: '30px',
                                        color: filter.color,
                                    }}
                                >
                                    <filter.icon stroke="1.5" size={19} />
                                </ListItemIcon>
                            )}

                            <ListItemText>{filter.name}</ListItemText>
                        </ListItemButton>
                    );
                })}
            </List>
        </>
    );
}
