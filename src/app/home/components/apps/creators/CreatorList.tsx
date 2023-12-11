import List from '@mui/material/List';

import Scrollbar from '../../custom-scroll/Scrollbar';
import CreatorListItem from './CreatorListItem';

import { CreatorType } from '@/mock/creators';

type Props = {
  creatorId: string;
  data: Omit<CreatorType, 'roles'>[];
  onCreatorClick(params: { id: string }): void;
  onDeleteClick(params: { id: string; name: string }): void;
};

export default function CreatorList({ creatorId, data, onCreatorClick, onDeleteClick }: Props) {
  return (
    <Scrollbar
      sx={{
        height: {
          lg: 'calc(100vh - 360px)',
          md: '100vh',
        },
      }}>
      <List>
        {data.map((creator) => (
          <CreatorListItem
            key={creator._id}
            active={creator._id === creatorId}
            image=""
            {...creator}
            onCreatorClick={() => onCreatorClick({ id: creator._id })}
            onDeleteClick={() => onDeleteClick({ id: creator._id, name: creator.name })}
            onStarredClick={() => {}}
          />
        ))}
      </List>
    </Scrollbar>
  );
}
