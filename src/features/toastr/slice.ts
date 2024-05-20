import { CustomizedSnackbarState } from '@/app/common/toastr';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState: CustomizedSnackbarState = {
    open: false,
    type: 'success',
    message: '',
};

export const toastrSlice = createSlice({
    name: 'toastr',
    initialState: initialState,
    reducers: {
        displayToastr: (state, action: PayloadAction<Omit<CustomizedSnackbarState, 'open'>>) => {
            state.open = true;
            state.type = action.payload.type;
            state.message = action.payload.message;
            state.autoClose = action.payload.autoClose;
        },
        changeToastr: (state, action: PayloadAction<CustomizedSnackbarState>) => {
            state.open = action.payload.open;
            state.type = action.payload.type;
            state.message = action.payload.message;
            state.autoClose = action.payload.autoClose;
        },
    },
});

export const { displayToastr, changeToastr } = toastrSlice.actions;

export const toastrActionsCreators = toastrSlice.actions;
