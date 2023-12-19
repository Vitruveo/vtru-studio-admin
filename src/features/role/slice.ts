import { createSlice } from '@reduxjs/toolkit';

import { roleCreateThunk } from './thunks';
import { RoleSliceState } from './types';

const initialState: RoleSliceState = {
  name: '',
  description: '',
  permissions: [],
  byId: {},
  status: '',
  error: '',
};

export const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {},
});

export const roleActionsCreators = roleSlice.actions;
