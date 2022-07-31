import { createAction } from 'redux-actions';
import authApi from "../../api/auth";

export const fetchUserRequest = createAction('USER_FETCH_REQUEST');
export const fetchUserSuccess = createAction('USER_FETCH_SUCCESS');
export const fetchUserFailure = createAction('USER_FETCH_FAILURE');

export const signupRequest = createAction('SIGNUP_REQUEST');
export const signupSuccess = createAction('SIGNUP_SUCCESS');
export const signupFailure = createAction('SIGNUP_FAILURE');

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

export const signup = (payload) => async (dispatch) => {
  dispatch(signupRequest());

  try {
    await authApi.signup(payload);
    dispatch(signupSuccess());
  } catch (e) {
    dispatch(signupFailure());
    throw e;
  }
}
