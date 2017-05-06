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
import reducer, {
	pendingRequest,
	emailSent,
	error,
} from '../reducer';

describe( 'reducer', () => {
	it( 'exports expected reducer keys', () => {
		expect( reducer( undefined, {} ) ).to.have.keys( [
			'pendingRequest',
			'emailSent',
			'error',
		] );
	} );

	describe( '#pendingRequest', () => {
		it( 'returns false by default', () => {
			const result = pendingRequest( undefined, {} );
			expect( result ).to.equal( false );
		} );

		it( 'returns true when a request is made', () => {
			const result = pendingRequest( false, { type: EMAIL_VERIFY_REQUEST } );
			expect( result ).to.equal( true );
		} );

		it( 'returns false when email is sent', () => {
			const result = pendingRequest( true, { type: EMAIL_VERIFY_REQUEST_SUCCESS } );
			expect( result ).to.equal( false );
		} );

		it( 'returns false when there is an error sending an email', () => {
			const result = pendingRequest( true, { type: EMAIL_VERIFY_REQUEST_FAILURE } );
			expect( result ).to.equal( false );
		} );

		it( 'returns false when the status is reset', () => {
			const result = pendingRequest( true, { type: EMAIL_VERIFY_STATE_RESET } );
			expect( result ).to.equal( false );
		} );
	} );

	describe( '#emailSent', () => {
		it( 'returns false by default', () => {
			const result = emailSent( undefined, {} );
			expect( result ).to.equal( false );
		} );

		it( 'returns false when a request is made', () => {
			const result = emailSent( true, { type: EMAIL_VERIFY_REQUEST } );
			expect( result ).to.equal( false );
		} );

		it( 'returns true when email is sent', () => {
			const result = emailSent( false, { type: EMAIL_VERIFY_REQUEST_SUCCESS } );
			expect( result ).to.equal( true );
		} );

		it( 'returns false when there is an error sending an email', () => {
			const result = emailSent( true, { type: EMAIL_VERIFY_REQUEST_FAILURE } );
			expect( result ).to.equal( false );
		} );

		it( 'returns false when the status is reset', () => {
			const result = emailSent( true, { type: EMAIL_VERIFY_STATE_RESET } );
			expect( result ).to.equal( false );
		} );
	} );

	describe( '#error', () => {
		it( 'returns false by default', () => {
			const result = error( undefined, {} );
			expect( result ).to.equal( false );
		} );

		it( 'returns false when a request is made', () => {
			const result = error( true, { type: EMAIL_VERIFY_REQUEST } );
			expect( result ).to.equal( false );
		} );

		it( 'returns false when email is sent', () => {
			const result = error( true, { type: EMAIL_VERIFY_REQUEST_SUCCESS } );
			expect( result ).to.equal( false );
		} );

		it( 'returns true when there is an error sending an email', () => {
			const result = error( false, { type: EMAIL_VERIFY_REQUEST_FAILURE } );
			expect( result ).to.equal( true );
		} );

		it( 'returns false when the status is reset', () => {
			const result = error( true, { type: EMAIL_VERIFY_STATE_RESET } );
			expect( result ).to.equal( false );
		} );
	} );
} );
