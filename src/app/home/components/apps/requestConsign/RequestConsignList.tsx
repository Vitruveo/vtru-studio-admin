import Scrollbar from '../../custom-scroll/Scrollbar';
import RequestConsignListItem from './RequestConsignListItem';
import { RequestConsign } from '@/features/requestConsign';
import { Stack, List, IconButton } from '@mui/material';
import { IconCheck, IconHandOff, IconClock, IconX } from '@tabler/icons-react';

type Props = {
    requestConsignId: string;
    data: RequestConsign[];
    activeFilter: string;
    onClick(params: RequestConsign): void;
    handleFilter(status: string): void;
};

export default function RequestConsignList({ requestConsignId, data, activeFilter, onClick, handleFilter }: Props) {
    const styleActive = (status: string) => ({
        backgroundColor: activeFilter === status ? '#F2ECF9' : '',
        color: activeFilter === status ? '#5C3BFE' : '',
    });

    return (
        <Scrollbar
            sx={{
                height: {
                    lg: 'calc(100vh - 360px)',
                    md: '100vh',
                },
            }}
        >
            <Stack direction="row" justifyContent="center" gap={1}>
                <IconButton onClick={() => handleFilter('pending')} sx={styleActive('pending')}>
                    <IconClock size="18" stroke={1.3} />
                </IconButton>
                <IconButton onClick={() => handleFilter('approved')} sx={styleActive('approved')}>
                    <IconCheck size="18" stroke={1.3} />
                </IconButton>
                <IconButton onClick={() => handleFilter('rejected')} sx={styleActive('rejected')}>
                    <IconHandOff size="18" stroke={1.3} />
                </IconButton>
                <IconButton onClick={() => handleFilter('error')} sx={styleActive('error')}>
                    <IconX size="18" stroke={1.3} />
                </IconButton>
            </Stack>
            <List>
                {data.map((item) => (
                    <RequestConsignListItem
                        key={item._id}
                        active={item._id === requestConsignId}
                        image=""
                        {...item}
                        onClick={() => onClick(item)}
                    />
                ))}
                {!data.length && <p style={{ textAlign: 'center' }}>No data</p>}
            </List>
        </Scrollbar>
    );
}
