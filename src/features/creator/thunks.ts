import { fetchEventSource } from '@microsoft/fetch-event-source';
import { ReduxThunkAction } from '@/store';
import { BASE_URL_API } from '@/constants/api';
import { creatorActionsCreators } from './slice';
import { toastrActionsCreators } from '../toastr/slice';
import { getCreatorById, getCreatorsPaginated, updateLicense, updateVaultState } from './requests';
import { GetCreatorsPaginatedParams, GetCreatorsPaginatedResponse, UpdateLicenseOptions } from './types';

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

export function getCreatorsPaginatedThunk(
    params: GetCreatorsPaginatedParams
): ReduxThunkAction<Promise<GetCreatorsPaginatedResponse>> {
    return async function () {
        const response = await getCreatorsPaginated(params);

        return response.data.data!;
    };
}

export function deleteCreatorThunk(id: string): ReduxThunkAction {
    return async function (dispatch, _getState) {
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
    return async function (dispatch, _getState) {
        const response = await getCreatorById(id);

        if (response.data) dispatch(creatorActionsCreators.setCreator(response.data));
    };
}

export function updateLicenseThunk(id: string, data: UpdateLicenseOptions): ReduxThunkAction {
    return async function (dispatch, _getState) {
        await updateLicense(id, data);

        dispatch(creatorActionsCreators.setCreatorLicenseArtCards({ id, value: data.value }));
        dispatch(toastrActionsCreators.displayToastr({ type: 'success', message: 'Licenses updated' }));
    };
}
