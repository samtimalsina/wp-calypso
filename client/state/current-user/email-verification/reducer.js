/**
 * External dependencies
 */
import { combineReducers } from 'redux';
import { stubTrue, stubFalse } from 'lodash';

/**
 * Internal dependencies
 */
import { createReducer } from 'state/utils';
import {
	EMAIL_VERIFY_REQUEST,
	EMAIL_VERIFY_REQUEST_SUCCESS,
	EMAIL_VERIFY_REQUEST_FAILURE,
	EMAIL_VERIFY_STATE_RESET,
} from 'state/action-types';

export const pendingRequest = createReducer( false, {
	[ EMAIL_VERIFY_REQUEST ]: stubTrue,
	[ EMAIL_VERIFY_REQUEST_SUCCESS ]: stubFalse,
	[ EMAIL_VERIFY_REQUEST_FAILURE ]: stubFalse,
	[ EMAIL_VERIFY_STATE_RESET ]: stubFalse,
} );

export const emailSent = createReducer( false, {
	[ EMAIL_VERIFY_REQUEST ]: stubFalse,
	[ EMAIL_VERIFY_REQUEST_SUCCESS ]: stubTrue,
	[ EMAIL_VERIFY_REQUEST_FAILURE ]: stubFalse,
	[ EMAIL_VERIFY_STATE_RESET ]: stubFalse,
} );

export const error = createReducer( false, {
	[ EMAIL_VERIFY_REQUEST ]: stubFalse,
	[ EMAIL_VERIFY_REQUEST_SUCCESS ]: stubFalse,
	[ EMAIL_VERIFY_REQUEST_FAILURE ]: stubTrue,
	[ EMAIL_VERIFY_STATE_RESET ]: stubFalse,
} );

export default combineReducers( {
	pendingRequest,
	emailSent,
	error,
} );
