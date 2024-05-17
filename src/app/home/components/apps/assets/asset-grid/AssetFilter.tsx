import React from 'react';
import { useDispatch, useSelector } from '@/store/hooks';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { IconCircles, IconLock, IconChecklist, IconCloudCheck } from '@tabler/icons-react';
import { AssetFiterType } from '../../../../types/apps/eCommerce';
import { customizer } from '@/app/common/customizer';
import { changeFilterThunk } from '@/features/assets/thunks';

const AssetFilter = () => {
    const dispatch = useDispatch();
    const active = useSelector((state) => state.asset.filter);

    const br = `${customizer.borderRadius}px`;

    const filterCategory: AssetFiterType[] = [
        {
            filterbyTitle: 'Filter by Category',
        },
        {
            name: 'All',
            sort: 'all',
            icon: IconCircles,
            onClick: () => dispatch(changeFilterThunk('all')),
        },
        {
            name: 'Active',
            sort: 'active',
            icon: IconChecklist,
            onClick: () => dispatch(changeFilterThunk('active')),
        },
        {
            name: 'Blocked',
            sort: 'blocked',
            icon: IconLock,
            onClick: () => dispatch(changeFilterThunk('blocked')),
        },
        {
            name: 'Consigned',
            sort: 'consigned',
            icon: IconCloudCheck,
            onClick: () => dispatch(changeFilterThunk('consigned')),
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
