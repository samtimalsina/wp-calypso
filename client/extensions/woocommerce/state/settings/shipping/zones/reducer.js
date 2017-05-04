/**
 * External dependencies
 */
import { isEqual, unionWith, differenceWith, reject, isEmpty, find, findIndex, isArray, every } from 'lodash';

/**
 * Internal dependencies
 */
import { createReducer } from 'state/utils';
import {
	WOOCOMMERCE_SHIPPING_METHODS_FETCH_ERROR,
	WOOCOMMERCE_SHIPPING_METHODS_FETCH_SUCCESS,
	WOOCOMMERCE_SHIPPING_SETTINGS_SAVE_SUCCESS,
	WOOCOMMERCE_SHIPPING_ZONE_ADD,
	WOOCOMMERCE_SHIPPING_ZONE_CANCEL,
	WOOCOMMERCE_SHIPPING_ZONE_CLOSE,
	WOOCOMMERCE_SHIPPING_ZONE_LOCATION_ADD,
	WOOCOMMERCE_SHIPPING_ZONE_LOCATION_REMOVE,
	WOOCOMMERCE_SHIPPING_ZONE_LOCATIONS_FETCH_ERROR,
	WOOCOMMERCE_SHIPPING_ZONE_LOCATIONS_FETCH_SUCCESS,
	WOOCOMMERCE_SHIPPING_ZONE_METHOD_ADD,
	WOOCOMMERCE_SHIPPING_ZONE_METHOD_CHANGE_TYPE,
	WOOCOMMERCE_SHIPPING_ZONE_METHOD_EDIT,
	WOOCOMMERCE_SHIPPING_ZONE_METHOD_REMOVE,
	WOOCOMMERCE_SHIPPING_ZONE_METHODS_FETCH_ERROR,
	WOOCOMMERCE_SHIPPING_ZONE_METHODS_FETCH_SUCCESS,
	WOOCOMMERCE_SHIPPING_ZONE_REMOVE,
	WOOCOMMERCE_SHIPPING_ZONES_FETCH_ERROR,
	WOOCOMMERCE_SHIPPING_ZONES_FETCH_SUCCESS,
} from '../../../action-types';

const updateZonesIfAllLoaded = ( state ) => {
	if ( state.methodDefinitions &&
		( ! isArray( state.serverZones ) || ( every( state.serverZones, 'locations' ) && every( state.serverZones, 'methods' ) ) ) ) {
		state.zones = state.serverZones;
	}
	return state;
};

export default createReducer( {}, {
	[ WOOCOMMERCE_SHIPPING_ZONE_ADD ]: ( state ) => {
		return { ...state,
			currentlyEditingZone: {
				id: null,
				locations: [],
				methods: [],
			},
		};
	},

	[ WOOCOMMERCE_SHIPPING_ZONE_REMOVE ]: ( state, { id } ) => {
		// TODO: Protect { id: 0 } (Rest of the World)
		return { ...state,
			currentlyEditingZone: null,
			zones: reject( state.zones, { id } ),
		};
	},

	[ WOOCOMMERCE_SHIPPING_ZONE_CANCEL ]: ( state ) => {
		return { ...state,
			currentlyEditingZone: null,
		};
	},

	[ WOOCOMMERCE_SHIPPING_ZONE_CLOSE ]: ( state ) => {
		// TODO: Keep "Rest Of The World" last always
		return { ...state,
			zones: [ ...state.zones, state.currentlyEditingZone ],
			currentlyEditingZone: null,
		};
	},

	[ WOOCOMMERCE_SHIPPING_ZONE_LOCATION_ADD ]: ( state, { locationType, locationCode } ) => {
		// TODO: ZIP codes
		// TODO: Get the list of continents / countries / states from somewhere (new endpoint?)
		const location = { type: locationType, code: locationCode };
		const newLocations = unionWith( state.currentlyEditingZone.locations, [ location ], isEqual );
		return { ...state,
			currentlyEditingZone: { ...state.currentlyEditingZone,
				locations: newLocations,
			},
		};
	},

	[ WOOCOMMERCE_SHIPPING_ZONE_LOCATION_REMOVE ]: ( state, { locationType, locationCode } ) => {
		// TODO: when removing a country, remove all its states?
		const location = { type: locationType, code: locationCode };
		const newLocations = differenceWith( state.currentlyEditingZone.locations, [ location ], isEqual );
		return { ...state,
			currentlyEditingZone: { ...state.currentlyEditingZone,
				locations: newLocations,
			},
		};
	},

	[ WOOCOMMERCE_SHIPPING_ZONE_METHOD_ADD ]: ( state ) => {
		if ( isEmpty( state.methodDefinitions ) ) {
			return state;
		}
		const currentMethods = state.currentlyEditingZone.methods;
		return { ...state,
			currentlyEditingZone: { ...state.currentlyEditingZone,
				methods: [ ...currentMethods, state.methodDefinitions[ 0 ] ],
			},
		};
	},

	[ WOOCOMMERCE_SHIPPING_ZONE_METHOD_CHANGE_TYPE ]: ( state, { index, newType } ) => {
		const { methods } = state.currentlyEditingZone;
		const newMethodDefinition = find( state.methodDefinitions, { id: newType } );
		return { ...state,
			currentlyEditingZone: { ...state.currentlyEditingZone,
				methods: [ ...methods.slice( 0, index ), newMethodDefinition, ...methods.slice( index + 1 ) ],
			},
		};
	},

	[ WOOCOMMERCE_SHIPPING_ZONE_METHOD_EDIT ]: ( state, { index, field, value } ) => {
		const { methods } = state.currentlyEditingZone;
		const method = methods[ index ];
		const newMethodDefinition = { ...method,
			[ field ]: value,
		};
		return { ...state,
			currentlyEditingZone: { ...state.currentlyEditingZone,
				methods: [ ...methods.slice( 0, index ), newMethodDefinition, ...methods.slice( index + 1 ) ],
			},
		};
	},

	[ WOOCOMMERCE_SHIPPING_ZONE_METHOD_REMOVE ]: ( state, { index } ) => {
		const { methods } = state.currentlyEditingZone;
		return { ...state,
			currentlyEditingZone: { ...state.currentlyEditingZone,
				methods: [ ...methods.slice( 0, index ), ...methods.slice( index + 1 ) ],
			},
		};
	},

	[ WOOCOMMERCE_SHIPPING_METHODS_FETCH_ERROR ]: ( state, { error } ) => {
		return updateZonesIfAllLoaded( { ...state,
			methodDefinitions: { error },
		} );
	},

	[ WOOCOMMERCE_SHIPPING_METHODS_FETCH_SUCCESS ]: ( state, { methods } ) => {
		return updateZonesIfAllLoaded( { ...state,
			methodDefinitions: methods,
		} );
	},

	[ WOOCOMMERCE_SHIPPING_ZONE_LOCATIONS_FETCH_ERROR ]: ( state, { id, error } ) => {
		const { serverZones } = state;
		const index = findIndex( serverZones, { id } );
		if ( -1 === index ) {
			return state;
		}
		const zone = { ...serverZones[ index ],
			locations: { error },
		};
		return updateZonesIfAllLoaded( { ...state,
			serverZones: [ ...serverZones.slice( 0, index ), zone, ...serverZones.slice( index + 1 ) ],
		} );
	},

	[ WOOCOMMERCE_SHIPPING_ZONE_LOCATIONS_FETCH_SUCCESS ]: ( state, { id, locations } ) => {
		const { serverZones } = state;
		const index = findIndex( serverZones, { id } );
		if ( -1 === index ) {
			return state;
		}
		const zone = { ...serverZones[ index ],
			locations,
		};
		return updateZonesIfAllLoaded( { ...state,
			serverZones: [ ...serverZones.slice( 0, index ), zone, ...serverZones.slice( index + 1 ) ],
		} );
	},

	[ WOOCOMMERCE_SHIPPING_ZONE_METHODS_FETCH_ERROR ]: ( state, { id, error } ) => {
		const { serverZones } = state;
		const index = findIndex( serverZones, { id } );
		if ( -1 === index ) {
			return state;
		}
		const zone = { ...serverZones[ index ],
			methods: { error },
		};
		return updateZonesIfAllLoaded( { ...state,
			serverZones: [ ...serverZones.slice( 0, index ), zone, ...serverZones.slice( index + 1 ) ],
		} );
	},

	[ WOOCOMMERCE_SHIPPING_ZONE_METHODS_FETCH_SUCCESS ]: ( state, { id, methods } ) => {
		const { serverZones } = state;
		const index = findIndex( serverZones, { id } );
		if ( -1 === index ) {
			return state;
		}
		const zone = { ...serverZones[ index ],
			methods,
		};
		return updateZonesIfAllLoaded( { ...state,
			serverZones: [ ...serverZones.slice( 0, index ), zone, ...serverZones.slice( index + 1 ) ],
		} );
	},

	[ WOOCOMMERCE_SHIPPING_ZONES_FETCH_ERROR ]: ( state, { error } ) => {
		return updateZonesIfAllLoaded( { ...state,
			serverZones: { error },
		} );
	},

	[ WOOCOMMERCE_SHIPPING_ZONES_FETCH_SUCCESS ]: ( state, { zones } ) => {
		return updateZonesIfAllLoaded( { ...state,
			serverZones: zones,
		} );
	},

	[ WOOCOMMERCE_SHIPPING_SETTINGS_SAVE_SUCCESS ]: ( state ) => {
		return { ...state,
			currentlyEditingZone: null,
			serverZones: state.zones,
		};
	},
} );
