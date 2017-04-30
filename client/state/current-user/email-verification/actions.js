/**
 * Internal dependencies
 */
import {
	EMAIL_VERIFY_REQUEST,
	EMAIL_VERIFY_REQUEST_SUCCESS,
	EMAIL_VERIFY_REQUEST_FAILURE,
	EMAIL_VERIFY_STATE_RESET,
} from 'state/action-types';
import wpcom from 'lib/wp';

export function verifyEmail() {
	return dispatch => {
		dispatch( { type: EMAIL_VERIFY_REQUEST } );
		return wpcom.undocumented().me().sendVerificationEmail()
			.then( () => {
				dispatch( { type: EMAIL_VERIFY_REQUEST_SUCCESS } );
			} )
			.catch( () => {
				dispatch( { type: EMAIL_VERIFY_REQUEST_FAILURE } );
			} );
	};
}

export function resetVerifyEmailState() {
	return { type: EMAIL_VERIFY_STATE_RESET };
}
