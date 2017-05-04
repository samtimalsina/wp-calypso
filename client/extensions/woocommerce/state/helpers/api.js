/**
 * Internal dependencies
 */
import { getSelectedSiteId } from 'state/ui/selectors';
import wp from 'lib/wp';

// TODO: Use the new data-layer instead

const request = ( func, path, state, body = {} ) => {
	return func( { path: `/jetpack-blogs/${ getSelectedSiteId( state ) }/rest-api/` }, { path: '/wc/v2/' + path, ...body } )
		.then( ( { data } ) => data );
};

export const get = ( path, state ) => {
	return request( wp.req.get, path, state );
};

export const post = ( path, body, state ) => {
	return request( wp.req.post, path, state, body );
};
