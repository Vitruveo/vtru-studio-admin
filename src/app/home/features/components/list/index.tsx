import { FixedSizeList as List } from 'react-window';
import Item from './item';

import { FeatureItem } from '@/features/features/types';

type Props = {
    activeFeature?: FeatureItem;
    features: FeatureItem[];
    onFeatureClick(params: FeatureItem): void;
    onDeleteClick(params: FeatureItem): void;
};

export default function FeaturesList({ activeFeature, features, onFeatureClick, onDeleteClick }: Props) {
    const rowRenderer = ({ index, style }: { index: number; style: React.CSSProperties }) => {
        const feature = features[index];
        return (
            <div style={style} key={index}>
                <Item
                    name={feature.name}
                    active={activeFeature?.name === feature.name}
                    image=""
                    onFeatureClick={() => onFeatureClick(feature)}
                    onDeleteClick={() => onDeleteClick(feature)}
                />
            </div>
        );
    };

    return (
        <List height={600} itemCount={features.length} itemSize={60} width="100%">
            {rowRenderer}
        </List>
    );
}
