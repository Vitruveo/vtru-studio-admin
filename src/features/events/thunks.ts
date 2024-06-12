import { fetchEventSource } from '@microsoft/fetch-event-source';
import { ReduxThunkAction } from '@/store';
import { BASE_URL_API } from '@/constants/api';
import { requestConsignActionsCreators } from '../requestConsign';
import { assetActionsCreators } from '../assets';
import { userActionsCreators } from '../user/slice';
import { creatorActionsCreators } from '../creator';
import { waitingListActionsCreators } from '../waitingList';
import { roleActionsCreators } from '../role/slice';
import { allowListActionsCreators } from '../allowList/slice';

const rolesEvents = ['roles', 'createdRole', 'updatedRole'];
const assetsEvents = ['assets', 'createdAsset', 'updatedAsset'];
const creatorsEvents = ['creators', 'createdCreator', 'updatedCreator'];
const usersEvents = ['users', 'createdUser', 'updatedUser'];
const waitingListEvents = ['waitingList', 'createdWaitingList', 'updatedWaitingList'];
const requestConsignEvents = ['requestConsigns', 'createdRequestConsign', 'updatedRequestConsign'];
const allowListEvents = ['allowList', 'createdAllowList', 'updatedAllowList'];

export function getEventsThunk(): ReduxThunkAction {
    return async function (dispatch, getState) {
        const state = getState();
        const token = state.auth.token;

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
                if (requestConsignEvents.includes(message.event))
                    dispatch(requestConsignActionsCreators.setRequestConsign(parsed));

                if (assetsEvents.includes(message.event)) dispatch(assetActionsCreators.setAsset(parsed));

                if (usersEvents.includes(message.event)) dispatch(userActionsCreators.setUser(parsed));

                if (creatorsEvents.includes(message.event)) dispatch(creatorActionsCreators.setCreator(parsed));

                if (waitingListEvents.includes(message.event))
                    dispatch(waitingListActionsCreators.setWaitingList(parsed));

                if (rolesEvents.includes(message.event)) dispatch(roleActionsCreators.setRole(parsed));
                if (message.event === 'deletedRole') dispatch(roleActionsCreators.removeRole(parsed.id));

                if (allowListEvents.includes(message.event)) dispatch(allowListActionsCreators.setAllowList(parsed));
            },
            onerror() {
                throw new Error('Error fetching event source');
            },
            signal: ctrl.signal,
        });
    };
}
