import { FixedSizeList as List } from 'react-window';
import Item from './item';
import { AllowItem } from '@/features/allowList/types';

type Props = {
    activeEmail?: AllowItem;
    emails: AllowItem[];
    onEmailClick(params: AllowItem): void;
    onDeleteClick(params: AllowItem): void;
};

export default function EmailsList({ activeEmail, emails, onEmailClick, onDeleteClick }: Props) {
    const rowRenderer = ({ index, style }: { index: number; style: React.CSSProperties }) => {
        const email = emails[index];
        return (
            <div style={style} key={index}>
                <Item
                    email={email.email}
                    active={activeEmail?.email === email.email}
                    image=""
                    onEmailClick={() => onEmailClick(email)}
                    onDeleteClick={() => onDeleteClick(email)}
                />
            </div>
        );
    };

    return (
        <List height={600} itemCount={emails.length} itemSize={60} width="100%">
            {rowRenderer}
        </List>
    );
}
