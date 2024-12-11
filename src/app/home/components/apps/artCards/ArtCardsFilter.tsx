import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import { IconMail } from '@tabler/icons-react';

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

export default function ArtCardsFilter() {
    const customizer = {
        borderRadius: 7,
    };
    const br = `${customizer.borderRadius}px`;

    const filterData: DataType[] = [
        {
            id: 2,
            name: 'All Requests',
            sort: '',
            icon: IconMail,
        },
        {
            id: 4,
            devider: true,
        },
        {
            id: 5,
            filterbyTitle: 'Categories',
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
