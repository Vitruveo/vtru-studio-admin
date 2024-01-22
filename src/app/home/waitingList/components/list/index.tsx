import List from '@mui/material/List';

import Item from './item';
import Scrollbar from '@/app/home/components/custom-scroll/Scrollbar';
import { WaitingItem } from '@/features/waitingList/types';

type Props = {
    activeEmail?: WaitingItem;
    emails: WaitingItem[];
    onEmailClick(params: WaitingItem): void;
    onDeleteClick(params: WaitingItem): void;
    onAddAllowList: (waitingItem: WaitingItem) => void;
};

export default function EmailsList({ activeEmail, emails, onEmailClick, onAddAllowList, onDeleteClick }: Props) {
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
                {emails.map((v, key) => (
                    <Item
                        key={key}
                        waitingItem={v}
                        active={activeEmail?.email === v.email}
                        image=""
                        onAddAllowList={onAddAllowList}
                        onEmailClick={() => onEmailClick(v)}
                        onDeleteClick={() => onDeleteClick(v)}
                    />
                ))}
            </List>
        </Scrollbar>
    );
}
