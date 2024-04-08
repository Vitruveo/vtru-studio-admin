import React from 'react';
import { useDispatch } from '@/store/hooks';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { IconHanger, IconCircles, IconNotebook, IconMoodSmile, IconDeviceLaptop } from '@tabler/icons-react';
import { AssetFiterType } from '../../../../types/apps/eCommerce';
import { customizer } from '@/app/common/customizer';

const AssetFilter = () => {
    const dispatch = useDispatch();
    const active: any = {};

    const br = `${customizer.borderRadius}px`;

    const filterCategory: AssetFiterType[] = [
        {
            id: 1,
            filterbyTitle: 'Filter by Category',
        },
        {
            id: 2,
            name: 'All',
            sort: 'All',
            icon: IconCircles,
        },
        {
            id: 3,
            name: 'Fashion',
            sort: 'fashion',
            icon: IconHanger,
        },
        {
            id: 9,
            name: 'Books',
            sort: 'books',
            icon: IconNotebook,
        },
        {
            id: 10,
            name: 'Toys',
            sort: 'toys',
            icon: IconMoodSmile,
        },
        {
            id: 11,
            name: 'Electronics',
            sort: 'electronics',
            icon: IconDeviceLaptop,
        },
        {
            id: 6,
            devider: true,
        },
    ];

    return (
        <>
            <List>
                {filterCategory.map((filter) => {
                    if (filter.filterbyTitle) {
                        return (
                            <Typography variant="subtitle2" fontWeight={600} px={3} mt={2} pb={2} key={filter.id}>
                                {filter.filterbyTitle}
                            </Typography>
                        );
                    } else if (filter.devider) {
                        return <Divider key={filter.id} />;
                    }

                    return (
                        <ListItemButton
                            sx={{ mb: 1, mx: 3, borderRadius: br }}
                            selected={active.category === `${filter.sort}`}
                            onClick={() => {}}
                            key={filter.id}
                        >
                            <ListItemIcon sx={{ minWidth: '30px' }}>
                                <filter.icon stroke="1.5" size="19" />
                            </ListItemIcon>
                            <ListItemText>{filter.name}</ListItemText>
                        </ListItemButton>
                    );
                })}
            </List>
        </>
    );
};

export default AssetFilter;
