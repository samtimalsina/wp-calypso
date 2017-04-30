/**
 * External dependencies
 */
import { createReducer } from 'state/utils';
// import { combineReducers } from 'redux';

/**
 * Internal dependencies
 */
import {
	EMAIL_VERIFY_REQUEST,
	EMAIL_VERIFY_REQUEST_SUCCESS,
	EMAIL_VERIFY_REQUEST_FAILURE,
	EMAIL_VERIFY_STATE_RESET,
} from 'state/action-types';

export default createReducer( {}, {
	[ EMAIL_VERIFY_REQUEST ]: () => ( {
		pendingRequest: true,
		emailSent: false,
		error: false,
	} ),
	[ EMAIL_VERIFY_REQUEST_SUCCESS ]: () => ( {
		pendingRequest: false,
		emailSent: true,
		error: false,
	} ),
	[ EMAIL_VERIFY_REQUEST_FAILURE ]: () => ( {
		pendingRequest: false,
		emailSent: false,
		error: true,
	} ),
	[ EMAIL_VERIFY_STATE_RESET ]: () => ( {} ),
} );
