import { useDispatch, useSelector } from '../../store/hooks';
import { toastrActionsCreators } from '../../features/toastr/slice';
import { CustomizedSnackbarState } from '../common/toastr';

export const useToastr = () => {
    const dispatch = useDispatch();
    const toastr = useSelector((state) => state.toastr);

    const display = (props: Omit<CustomizedSnackbarState, 'open'>) => {
        dispatch(toastrActionsCreators.displayToastr(props));
    };

    const setState = (state: CustomizedSnackbarState) => {
        dispatch(toastrActionsCreators.changeToastr(state));
    };

    return {
        display,
        data: toastr,
        setState,
    };
};
