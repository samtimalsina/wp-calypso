/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import { normalizeSettings, sanitizeSettings } from '../utils';

describe( 'utils', () => {
	describe( 'normalizeSettings()', () => {
		it( 'should not modify random settings', () => {
			const settings = {
				some_random_setting: 'example'
			};

			expect( normalizeSettings( settings ) ).to.eql( {
				some_random_setting: 'example'
			} );
		} );

		it( 'should convert carousel_background_color to "black" if it is an empty string', () => {
			const settings = {
				carousel_background_color: ''
			};

			expect( normalizeSettings( settings ) ).to.eql( {
				carousel_background_color: 'black'
			} );
		} );

		it( 'should default jetpack_protect_global_whitelist whitelist to an empty string when null', () => {
			expect( normalizeSettings( {
				jetpack_protect_global_whitelist: null
			} ) ).to.eql( {
				jetpack_protect_global_whitelist: '',
			} );
		} );

		it( 'should default jetpack_protect_global_whitelist whitelist to an empty string when empty', () => {
			expect( normalizeSettings( {
				jetpack_protect_global_whitelist: {
					local: []
				}
			} ) ).to.eql( {
				jetpack_protect_global_whitelist: '',
			} );
		} );

		it( 'should not add extra newlines when extracting jetpack_protect_global_whitelist', () => {
			const settings = {
				jetpack_protect_global_whitelist: {
					local: [
						'123.123.123.123',
					]
				}
			};

			expect( normalizeSettings( settings ) ).to.eql( {
				jetpack_protect_global_whitelist: '123.123.123.123',
			} );
		} );

		it( 'should add newlines between IPs when extracting jetpack_protect_global_whitelist', () => {
			const settings = {
				jetpack_protect_global_whitelist: {
					local: [
						'123.123.123.123',
						'213.123.213.123',
					]
				}
			};

			expect( normalizeSettings( settings ) ).to.eql( {
				jetpack_protect_global_whitelist: '123.123.123.123\n213.123.213.123',
			} );
		} );
	} );

	describe( 'sanitizeSettings()', () => {
		it( 'should not modify random settings', () => {
			const settings = {
				some_random_setting: 'example'
			};

			expect( sanitizeSettings( settings ) ).to.eql( {
				some_random_setting: 'example'
			} );
		} );

		it( 'should omit post_by_email_address from sanitized settings', () => {
			const settings = {
				some_other_setting: 123,
				post_by_email_address: 'some-email@example.com'
			};

			expect( sanitizeSettings( settings ) ).to.eql( {
				some_other_setting: 123,
			} );
		} );
	} );
} );
