import React, { useState } from 'react';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { IconCircles, IconLock, IconChecklist, IconCloudCheck } from '@tabler/icons-react';
import { AssetFiterType } from '../../../../types/apps/eCommerce';
import { customizer } from '@/app/common/customizer';

interface Props {
    handleChangeFilter: (filter: 'all' | 'active' | 'blocked' | 'consigned') => void;
}

const AssetFilter = ({ handleChangeFilter }: Props) => {
    const [active, setActive] = useState('all');

    const br = `${customizer.borderRadius}px`;

    const filterCategory: AssetFiterType[] = [
        {
            filterbyTitle: 'Filter by Category',
        },
        {
            name: 'All',
            sort: 'all',
            icon: IconCircles,
            onClick: () => {
                handleChangeFilter('all');
                setActive('all');
            },
        },
        {
            name: 'Active',
            sort: 'active',
            icon: IconChecklist,
            onClick: () => {
                handleChangeFilter('active');
                setActive('active');
            },
        },
        {
            name: 'Blocked',
            sort: 'blocked',
            icon: IconLock,
            onClick: () => {
                handleChangeFilter('blocked');
                setActive('blocked');
            },
        },
        {
            name: 'Consigned',
            sort: 'consigned',
            icon: IconCloudCheck,
            onClick: () => {
                handleChangeFilter('consigned');
                setActive('consigned');
            },
        },
    ];

    return (
        <>
            <List>
                {filterCategory.map((filter, index) => {
                    if (filter.filterbyTitle) {
                        return (
                            <Typography variant="subtitle2" fontWeight={600} px={3} mt={2} pb={2} key={index}>
                                {filter.filterbyTitle}
                            </Typography>
                        );
                    } else if (filter.devider) {
                        return <Divider key={index} />;
                    }

                    return (
                        <ListItemButton
                            sx={{ mb: 1, mx: 3, borderRadius: br }}
                            selected={active === filter.sort}
                            onClick={filter.onClick}
                            key={index}
                        >
                            <ListItemIcon sx={{ minWidth: '30px' }}>
                                <filter.icon stroke="1.5" size="19" />
                            </ListItemIcon>
                            <ListItemText style={{ color: active === filter.sort ? '' : '' }}>
                                {filter.name}
                            </ListItemText>
                        </ListItemButton>
                    );
                })}
            </List>
        </>
    );
};

export default AssetFilter;
