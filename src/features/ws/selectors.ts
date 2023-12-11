import type { AppState } from '@/store/index';
import { WebsocketSliceState } from './types';

/**
 * Returns a field selector function for the websocket slice of the Redux state.
 * The field selector function allows selecting specific fields from the websocket slice.
 *
 * @template T - The type of fields to select from the websocket slice.
 * @param {T[]} fields - An array of field names to select from the websocket slice.
 * @returns {FieldSelector<Pick<WebsocketSliceState, T>>} - The field selector function.
 */

export const websocketSelector = <T extends keyof WebsocketSliceState>(fields: T[]) => {
  return (state: AppState): Pick<WebsocketSliceState, T> => {
    const selectedFields = {} as Pick<WebsocketSliceState, T>;

    fields.forEach((field) => {
      selectedFields[field] = state.websocket[field];
    });

    return selectedFields;
  };
};
