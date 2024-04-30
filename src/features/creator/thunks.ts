import { list } from '@/services/apiEventSource';
import { ReduxThunkAction } from '@/store';
import { creatorActionsCreators } from './slice';
import { CreatorType } from './types';

export function getCreatorsThunk(): ReduxThunkAction {
    return async function (dispatch, getState) {
        if (getState().creator.all.length > 0) {
            return;
        }

        try {
            await list<CreatorType>({
                path: 'creators',
                callback: (data) => {
                    dispatch(creatorActionsCreators.push(data));
                },
            });
        } catch {
            // TODO: IMPLEMENTAR TRATAMENTO DE ERRO
        }
    };
}

// TODO: IMPLEMENTAR DELETE NO BACKEND
export function deleteCreatorThunk(id: string): ReduxThunkAction {
    return async function (dispatch, getState) {
        return new Promise((resolve) => {
            dispatch(creatorActionsCreators.remove({ id }));
            resolve();
        });
    };
}
