import { createAction } from 'redux-actions';
import authApi from "../../api/auth";

export const fetchUserRequest = createAction('USER_FETCH_REQUEST');
export const fetchUserSuccess = createAction('USER_FETCH_SUCCESS');
export const fetchUserFailure = createAction('USER_FETCH_FAILURE');

export const fetchUser = (credentials) => async (dispatch) => {
  dispatch(fetchUserRequest());

  try {
    const { data } = await authApi.login(credentials);
    dispatch(fetchUserSuccess({ user: data }));
    console.log(data);
  } catch (e) {
    dispatch(fetchUserFailure());
    throw e;
  }
};
