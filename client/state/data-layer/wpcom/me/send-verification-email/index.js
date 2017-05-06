/**
 * Internal dependencies
 */
import { http } from 'state/data-layer/wpcom-http/actions';
import { dispatchRequest } from 'state/data-layer/wpcom-http/utils';
import {
	EMAIL_VERIFY_REQUEST,
	EMAIL_VERIFY_REQUEST_SUCCESS,
	EMAIL_VERIFY_REQUEST_FAILURE,
} from 'state/action-types';

export const requestEmailVerification = function( { dispatch }, action, next ) {
	dispatch( http( {
		apiVersion: '1.1',
		method: 'POST',
		path: '/me/send-verification-email',
		onSuccess: { type: EMAIL_VERIFY_REQUEST_SUCCESS },
		onFailure: { type: EMAIL_VERIFY_REQUEST_FAILURE },
	} ) );

	return next( action );
};

export default {
	[ EMAIL_VERIFY_REQUEST ]: [ dispatchRequest( requestEmailVerification ) ],
};
