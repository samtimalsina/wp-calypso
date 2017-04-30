/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import {
	EMAIL_VERIFY_REQUEST,
	EMAIL_VERIFY_REQUEST_SUCCESS,
	EMAIL_VERIFY_REQUEST_FAILURE,
	EMAIL_VERIFY_STATE_RESET,
} from 'state/action-types';
import {
	verifyEmail,
	resetVerifyEmailState,
} from '../actions';
import { spy } from 'sinon';
import useNock from 'test/helpers/use-nock';

describe( 'actions', () => {
	const dispatchSpy = spy();

	describe( '#verifyEmail', () => {
		it( 'dispatches request action', () => {
			verifyEmail()( dispatchSpy );
			expect( dispatchSpy ).to.have.been.calledWith( {
				type: EMAIL_VERIFY_REQUEST
			} );
		} );

		describe( 'email successfully sent', () => {
			useNock( nock => {
				nock( 'https://public-api.wordpress.com' )
					.post( '/rest/v1.1/me/send-verification-email' )
					.reply( 200 );
			} );

			it( 'dispatches request success action', () => {
				return verifyEmail()( dispatchSpy )
					.then( () => {
						expect( dispatchSpy ).to.have.been.calledWith( {
							type: EMAIL_VERIFY_REQUEST_SUCCESS
						} );
					} );
			} );
		} );

		describe( 'email not successfully sent', () => {
			useNock( nock => {
				nock( 'https://public-api.wordpress.com' )
					.post( '/rest/v1.1/me/send-verification-email' )
					.reply(
						400,
						Error( 'The email address associated with this account is already verified' )
					);
			} );

			it( 'dispatches request failure action', () => {
				return verifyEmail()( dispatchSpy )
					.then( () => {
						expect( dispatchSpy ).to.have.been.calledWith( {
							type: EMAIL_VERIFY_REQUEST_FAILURE
						} );
					} );
			} );
		} );
	} );

	describe( '#resetVerifyEmailState', () => {
		it( 'returns reset action', () => {
			const result = resetVerifyEmailState();
			expect( result ).to.eql( { type: EMAIL_VERIFY_STATE_RESET } );
		} );
	} );
} );
