import Scrollbar from '../../custom-scroll/Scrollbar';
import RequestConsignListItem from './RequestConsignListItem';
import { RequestConsign } from '@/features/requestConsign';
import { List } from '@mui/material';

type Props = {
    requestConsignId: string;
    data: RequestConsign[];
    onClick(params: RequestConsign): void;
};

export default function RequestConsignList({ requestConsignId, data, onClick }: Props) {
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
