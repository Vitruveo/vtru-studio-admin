import type { AppState } from '@/store/index';
import { UserSliceState } from './types';

/**
 * Returns a field selector function for the user slice of the Redux state.
 * The field selector function allows selecting specific fields from the user slice.
 *
 * @template T - The type of fields to select from the user slice.
 * @param {T[]} fields - An array of field names to select from the user slice.
 * @returns {FieldSelector<Pick<UserSliceState, T>>} - The field selector function.
 */

export const userSelector = <T extends keyof UserSliceState>(fields: T[]) => {
  return (state: AppState): Pick<UserSliceState, T> => {
    const selectedFields = {} as Pick<UserSliceState, T>;

    fields.forEach((field) => {
      selectedFields[field] = state.user[field];
    });

    return selectedFields;
  };
};
