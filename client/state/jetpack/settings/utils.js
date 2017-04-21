/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * Normalize settings for use in Redux.
 *
 * @param  {Object}   settings   Raw settings.
 * @return {Object}              Normalized settings.
 */
export const normalizeSettings = ( settings ) => {
	return Object.keys( settings ).reduce( ( memo, key ) => {
		switch ( key ) {
			case 'carousel_background_color':
				memo[ key ] = settings [ key ] === '' ? 'black' : settings[ key ];
				break;
			case 'jetpack_protect_global_whitelist':
				const whitelist = get( settings[ key ], [ 'local' ], [] );
				memo[ key ] = whitelist.join( '\n' );
				break;
			default:
				memo[ key ] = settings[ key ];
		}

		return memo;
	}, {} );
};

/**
 * Sanitize settings for updating in the Jetpack site.
 *
 * @param  {Object}   settings   Settings.
 * @return {Object}              Normalized settings.
 */
export const sanitizeSettings = ( settings ) => {
	return Object.keys( settings ).reduce( ( memo, key ) => {
		switch ( key ) {
			case 'post_by_email_address':
				break;
			default:
				memo[ key ] = settings[ key ];
		}

		return memo;
	}, {} );
};
