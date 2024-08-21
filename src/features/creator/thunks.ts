import { fetchEventSource } from '@microsoft/fetch-event-source';
import { ReduxThunkAction } from '@/store';
import { BASE_URL_API } from '@/constants/api';
import { creatorActionsCreators } from './slice';
import { toastrActionsCreators } from '../toastr/slice';
import { getCreatorById, updateVaultState, updateVaultStateTrusted } from './requests';

export function getCreatorsThunk(): ReduxThunkAction {
    return async function (dispatch, getState) {
        const state = getState();
        const token = state.auth.token;

        const ctrl = new AbortController();

        const url = `${BASE_URL_API}/creators`;
        const headers = {
            Accept: 'text/event-stream',
            Authorization: `Bearer ${token}`,
        };

        const response = await fetch(url, { method: 'HEAD', headers });

        if (response.status === 401) {
            dispatch(
                toastrActionsCreators.displayToastr({
                    type: 'error',
                    message: 'You are not authorized to view this page.',
                })
            );

            dispatch(creatorActionsCreators.resetCreator());

            return;
        }

        fetchEventSource(url, {
            method: 'GET',
            headers,
            onmessage(message) {
                dispatch(creatorActionsCreators.setCreator(JSON.parse(message.data)));
            },
            onerror() {
                throw new Error('Error fetching event source');
            },
            signal: ctrl.signal,
        });
    };
}

export function deleteCreatorThunk(id: string): ReduxThunkAction {
    return async function (dispatch, getState) {
        return new Promise((resolve) => {
            dispatch(creatorActionsCreators.removeCreator({ id }));
            resolve();
        });
    };
}

export function updateVaultStatethunk({ id }: { id: string }): ReduxThunkAction {
    return async function (dispatch, getState) {
        dispatch(creatorActionsCreators.setStatus('loading'));

        const creator = getState().creator.byId[id];

        updateVaultState({ vaultAddress: creator.vault.vaultAddress, state: !creator.vault.isBlocked })
            .then(() => {
                dispatch(toastrActionsCreators.displayToastr({ type: 'success', message: 'Vault state updated' }));
                dispatch(creatorActionsCreators.setVaultIsBlockedById({ id, isBlocked: !creator.vault.isBlocked }));
            })
            .catch(() => {
                dispatch(toastrActionsCreators.displayToastr({ type: 'error', message: 'Error updating vault state' }));
            })
            .finally(() => {
                dispatch(creatorActionsCreators.setStatus(''));
            });
    };
}

export function getCreatorByIdThunk(id: string): ReduxThunkAction {
    return async function (dispatch, getState) {
        const response = await getCreatorById(id);

        if (response.data) dispatch(creatorActionsCreators.setCreator(response.data));
    };
}

export function updateVaultStateTrustedThunk({ id }: { id: string }): ReduxThunkAction {
    return async function (dispatch, getState) {
        dispatch(creatorActionsCreators.setLoadingTrusted(true));

        const creator = getState().creator.byId[id];

        updateVaultStateTrusted({ vaultAddress: creator.vault.vaultAddress, state: !creator.vault.isTrusted })
            .then(() => {
                dispatch(toastrActionsCreators.displayToastr({ type: 'success', message: 'Vault state updated' }));
                dispatch(creatorActionsCreators.setVaultIsTrustedById({ id, isTrusted: creator.vault.isTrusted }));
            })
            .catch(() => {
                dispatch(toastrActionsCreators.displayToastr({ type: 'error', message: 'Error updating vault state' }));
            })
            .finally(() => {
                dispatch(creatorActionsCreators.setLoadingTrusted(false));
            });
    };
}
