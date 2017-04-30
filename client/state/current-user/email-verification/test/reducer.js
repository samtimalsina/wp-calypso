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
import reducer from '../reducer';

describe( 'reducer', () => {
	it( 'has empty default state', () => {
		const result = reducer( undefined, {} );
		expect( result ).to.eql( {} );
	} );

	it( 'updates state when a request is made', () => {
		const result = reducer( {}, { type: EMAIL_VERIFY_REQUEST } );
		expect( result ).to.eql( {
			pendingRequest: true,
			emailSent: false,
			error: false,
		} );
	} );

	it( 'updates state when email verification sent successfully', () => {
		const result = reducer( {}, { type: EMAIL_VERIFY_REQUEST_SUCCESS } );
		expect( result ).to.eql( {
			pendingRequest: false,
			emailSent: true,
			error: false,
		} );
	} );

	it( 'updates state when email verification not sent successfully', () => {
		const result = reducer( {}, { type: EMAIL_VERIFY_REQUEST_FAILURE } );
		expect( result ).to.eql( {
			pendingRequest: false,
			emailSent: false,
			error: true,
		} );
	} );

	it( 'resets state', () => {
		const result = reducer( {
			pendingRequest: true,
			emailSent: true,
			error: true,
		}, { type: EMAIL_VERIFY_STATE_RESET } );
		expect( result ).to.eql( {} );
	} );
} );
