/**
 * Internal dependencies
 */
import { mergeHandlers } from './utils';
import { middleware } from './wpcom-api-middleware';

const configuration = configureMiddleware( Object.create( null ), Object.create( null ) );

/**
 * Changes configuration to build middleware from new handlers.
 *
 * @param {object} handlers The mapping of extension names to sets of handlers.
 * @param {object} config The config to be modified (defaults to module instance)
 * @returns {object} The config that was given, with modifications.
 */
export function configureMiddleware( handlers, config = configuration ) {
	config.handlers = handlers;
	config.middleware = buildMiddleware( handlers );
	return config;
}

/**
 * Adds an extension's handlers to the middleware.
 *
 * @param {string} name The name of the extension.
 * @param {object} handlers A mapping of action types to arrays of handlers.
 * @param {object} config The config to be modified (defaults to module instance)
 * @return {boolean} True upon success, false if name is already taken.
 */
export function addHandlers( name, handlers, config = configuration ) {
	if ( config.handlers && undefined !== config.handlers[ name ] ) {
		return false;
	}

	configureMiddleware( { ...config.handlers, [ name ]: handlers }, config );
	return true;
}

/**
 * Removes an extension's handlers from the middleware.
 *
 * @param {string} name The name of the extension.
 * @param {object} config The config to be modified (defaults to module instance)
 * @return {boolean} True upon success, false if name not found.
 */
export function removeHandlers( name, config = configuration ) {
	const { [ name ]: omitted, ...remainingHandlers } = config.handlers || {};

	return Boolean( omitted && configureMiddleware( remainingHandlers, config ) );
}

export function buildMiddleware( handlersByExtension ) {
	const allHandlers = Object.values( handlersByExtension ).reduce( mergeHandlers, Object.create( null ) );

	return middleware( allHandlers );
}

/**
 * Extensions Middleware
 */
export default configuration.middleware;

