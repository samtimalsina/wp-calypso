/**
 * Internal dependencies
 */
import {
	EMAIL_VERIFY_REQUEST,
	EMAIL_VERIFY_STATE_RESET,
} from 'state/action-types';

export function verifyEmail() {
	return { type: EMAIL_VERIFY_REQUEST };
}

export function resetVerifyEmailState() {
	return { type: EMAIL_VERIFY_STATE_RESET };
}
