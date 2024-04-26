import { ReduxThunkAction } from '@/store';
import { findWaitingList } from './requests';
import { waitingListActionsCreators } from './slice';
import { WaitingItem } from './types';

export function getWaitingListThunk(): ReduxThunkAction {
    return async function (dispatch, getState) {
        try {
            const res = await findWaitingList();
            if (res.data) {
                const sorted = res.data.sort((a: WaitingItem, b: WaitingItem) => {
                    if (new Date(a.framework.createdAt).getTime() > new Date(b.framework.createdAt).getTime()) {
                        return -1;
                    }
                    if (new Date(a.framework.createdAt).getTime() < new Date(b.framework.createdAt).getTime()) {
                        return 1;
                    }
                    return 0;
                });
                dispatch(waitingListActionsCreators.setAll(sorted));
            }
        } catch (error) {
            // TODO: IMPLEMENTAR TRATAMENTO DE ERRO
        }
    };
}
