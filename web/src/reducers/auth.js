import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    RESET_REGISTER_SUCCESS,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    LOGOUT_FAIL,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAIL,
    AUTHENTICATED_SUCCESS,
    AUTHENTICATED_FAIL,
    REFRESH_SUCCESS,
    REFRESH_FAIL,
    SET_AUTH_LOADING,
    REMOVE_AUTH_LOADING,
} from '../actions/types';

const initialState = {
    user: null,
    isAuthenticated: false,
    isLecturer: false,
    loading: false,
    register_success: false,
    error: null
};

const authReducer = (state = initialState, action) => {
    const { type, payload } = action;
    switch(type) {
        case REGISTER_SUCCESS:
            return {
                ...state,
                register_success: true,
                error: null
            }
        case REGISTER_FAIL:
            return {
                ...state,
                error: payload.error
            }
        case RESET_REGISTER_SUCCESS:
            return {
                ...state,
                register_success: false,
                error: null
            }
        case LOGIN_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                error: null
            }
        case LOGIN_FAIL:
            return {
                ...state,
                isAuthenticated: false,
                error: payload.error
            }
        case LOGOUT_SUCCESS:
            return {
                ...state,
                isAuthenticated: false,
                user: null
            }
        case LOGOUT_FAIL:
            return {
                ...state
            }
        case LOAD_USER_SUCCESS:
            return {
                ...state,
                user: payload.user
            }
        case LOAD_USER_FAIL:
            return {
                ...state,
                user: null,
                isLecturer: false
            }
        case AUTHENTICATED_SUCCESS:
            return {
                ...state,
                isAuthenticated: true
            }
        case AUTHENTICATED_FAIL:
            return {
                ...state,
                isAuthenticated: false,
                isLecturer: false,
                user: null
            }
        case REFRESH_SUCCESS:
            return {
                ...state,
            }
        case REFRESH_FAIL:
            return {
                ...state,
                isAuthenticated: false,
                isLecturer: false,
                user: null
            }
        case SET_AUTH_LOADING:
            return {
                ...state,
                loading: true
            }
        case REMOVE_AUTH_LOADING:
            return {
                ...state,
                loading: false
            }
        default:
            return state;
    };
};

export default authReducer;