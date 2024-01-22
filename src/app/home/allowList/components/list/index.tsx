import List from '@mui/material/List';

import Item from './item';
import Scrollbar from '@/app/home/components/custom-scroll/Scrollbar';
import { AllowItem } from '@/features/allowList/types';

type Props = {
    activeEmail?: AllowItem;
    emails: AllowItem[];
    onEmailClick(params: AllowItem): void;
    onDeleteClick(params: AllowItem): void;
};

export default function EmailsList({ activeEmail, emails, onEmailClick, onDeleteClick }: Props) {
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
                        email={v.email}
                        active={activeEmail?.email === v.email}
                        image=""
                        onEmailClick={() => onEmailClick(v)}
                        onDeleteClick={() => onDeleteClick(v)}
                    />
                ))}
            </List>
        </Scrollbar>
    );
}
