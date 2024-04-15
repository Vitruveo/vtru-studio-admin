import React from 'react';
import { useDispatch, useSelector } from '@/store/hooks';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { IconCircles, IconLock } from '@tabler/icons-react';
import { AssetFiterType } from '../../../../types/apps/eCommerce';
import { customizer } from '@/app/common/customizer';
import { changeFilterThunk } from '@/features/assets/thunks';

const AssetFilter = () => {
    const dispatch = useDispatch();
    const active = useSelector((state) => state.asset.filter);

    const br = `${customizer.borderRadius}px`;

    const filterCategory: AssetFiterType[] = [
        {
            id: 1,
            filterbyTitle: 'Filter by Category',
        },
        {
            id: 2,
            name: 'All',
            sort: 'all',
            icon: IconCircles,
            onClick: () => dispatch(changeFilterThunk('all')),
        },
        {
            id: 3,
            name: 'Blocked',
            sort: 'blocked',
            icon: IconLock,
            onClick: () => dispatch(changeFilterThunk('blocked')),
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
                            selected={active === filter.sort}
                            onClick={filter.onClick}
                            key={filter.id}
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
