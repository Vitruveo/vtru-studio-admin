import { creatorActionsCreators, creatorSlice } from './slice';
import { CreatorType } from './types';
import { deleteCreatorThunk, getCreatorsThunk } from './thunks';

export {
  creatorActionsCreators,
  creatorSlice,
  deleteCreatorThunk,
  getCreatorsThunk
}

export type {
  CreatorType,
}