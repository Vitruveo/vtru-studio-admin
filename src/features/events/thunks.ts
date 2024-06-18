import { fetchEventSource } from '@microsoft/fetch-event-source';
import cookie from 'cookiejs';

import { ReduxThunkAction } from '@/store';
import { BASE_URL_API } from '@/constants/api';
import { requestConsignActionsCreators } from '../requestConsign';
import { assetActionsCreators } from '../assets';
import { userActionsCreators } from '../user/slice';
import { creatorActionsCreators } from '../creator';
import { waitingListActionsCreators } from '../waitingList';
import { roleActionsCreators } from '../role/slice';
import { allowListActionsCreators } from '../allowList/slice';

const rolesAll = ['roles'];
const rolesOne = ['createdRole', 'updatedRole', 'deletedRole'];

const requestConsignEventsAll = ['requestConsigns'];
const requestConsignEventsOne = ['createdRequestConsign', 'updatedRequestConsign', 'deletedRequestConsign'];

const assetsAll = ['assets'];
const assetsOne = ['createdAsset', 'updatedAsset', 'deletedAsset'];

const usersAll = ['users'];
const usersOne = ['createdUser', 'updatedUser', 'deletedUser'];

const creatorsAll = ['creators'];
const creatorsOne = ['createdCreator', 'updatedCreator', 'deletedCreator'];

const waitingListAll = ['waitingList'];
const waitingListOne = ['createdWaitingList', 'updatedWaitingList', 'deletedWaitingList'];

const allowListAll = ['allowList'];
const allowListOne = ['createdAllowList', 'updatedAllowList', 'deletedAllowList'];

export function getEventsThunk(): ReduxThunkAction {
    return async function (dispatch, getState) {
        const state = getState();
        const token = state.auth.token;

        const replaceDomain = window.location.hostname.includes('vitruveo.xyz') ? 'studio-admin.' : 'admin.';

        const domain = window.location.hostname.replace(replaceDomain, '');
        cookie.set('token', token, { path: '/', domain });

        const ctrl = new AbortController();

        const url = `${BASE_URL_API}/events`;
        const headers = {
            Accept: 'text/event-stream',
            Authorization: `Bearer ${token}`,
        };

        fetchEventSource(url, {
            method: 'GET',
            headers,
            onmessage(message) {
                const parsed = JSON.parse(message.data);
                // request consign events
                if (requestConsignEventsOne.includes(message.event))
                    dispatch(requestConsignActionsCreators.setRequestConsign(parsed));
                if (requestConsignEventsAll.includes(message.event))
                    dispatch(requestConsignActionsCreators.setRequestConsigns(parsed));

                // assets events
                if (assetsOne.includes(message.event)) dispatch(assetActionsCreators.setAsset(parsed));
                if (assetsAll.includes(message.event)) dispatch(assetActionsCreators.setAssets(parsed));

                // users events
                if (usersOne.includes(message.event)) dispatch(userActionsCreators.setUser(parsed));
                if (usersAll.includes(message.event)) dispatch(userActionsCreators.setUsers(parsed));

                // creators events
                if (creatorsOne.includes(message.event)) dispatch(creatorActionsCreators.setCreator(parsed));
                if (creatorsAll.includes(message.event)) dispatch(creatorActionsCreators.setCreators(parsed));

                // waiting list events
                if (waitingListOne.includes(message.event)) dispatch(waitingListActionsCreators.setWaitingList(parsed));
                if (waitingListAll.includes(message.event))
                    dispatch(waitingListActionsCreators.setWaitingLists(parsed));

                // roles events
                if (rolesOne.includes(message.event)) dispatch(roleActionsCreators.setRole(parsed));
                if (rolesAll.includes(message.event)) dispatch(roleActionsCreators.setRoles(parsed));
                if (message.event === 'deletedRole') dispatch(roleActionsCreators.removeRole(parsed.id));

                // allow list events
                if (allowListOne.includes(message.event)) dispatch(allowListActionsCreators.setAllowList(parsed));
                if (allowListAll.includes(message.event)) dispatch(allowListActionsCreators.setAllowLists(parsed));
            },
            onerror() {
                throw new Error('Error fetching event source');
            },
            signal: ctrl.signal,
        });
    };
}
