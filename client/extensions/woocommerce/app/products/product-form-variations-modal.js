/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { localize } from 'i18n-calypso';
import { find } from 'lodash';

/**
 * Internal dependencies
 */
import formattedVariationName from '../../lib/formatted-variation-name';
import FormFieldSet from 'components/forms/form-fieldset';
import FormLabel from 'components/forms/form-label';
import FormTextArea from 'components/forms/form-textarea';
import FormToggle from 'components/forms/form-toggle';
import VerticalMenu from 'components/vertical-menu';

class ProductFormVariationsModal extends React.Component {

	static propTypes = {
		product: PropTypes.object.isRequired,
		variations: PropTypes.array.isRequired,
		editProductVariation: PropTypes.func.isRequired,
	};

	constructor( props ) {
		super( props );

		this.state = {
			selectedVariation: this.props.selectedVariation,
		};

		this.switchVariation = this.switchVariation.bind( this );
		this.setDescription = this.setDescription.bind( this );
		this.toggleVisible = this.toggleVisible.bind( this );
	}

	setDescription( e ) {
		const { selectedVariation } = this.state;
		const { product, editProductVariation, variations } = this.props;
		const variation = find( variations, ( v ) => selectedVariation === v.id );
		editProductVariation( product, variation, { description: e.target.value } );
	}

	toggleVisible() {
		const { selectedVariation } = this.state;
		const { product, editProductVariation, variations } = this.props;
		const variation = find( variations, ( v ) => selectedVariation === v.id );
		editProductVariation( product, variation, { visible: ! variation.visible } );
	}

	switchVariation( selectedVariation ) {
		this.setState( {
			selectedVariation
		} );
	}

	render() {
		const { variations, translate } = this.props;
		const { selectedVariation } = this.state;
		const variation = find( variations, ( v ) => selectedVariation === v.id );

		const navVariations = ( variations && variations.filter( v => v.attributes.length > 0 ) ) || [];
		const navItems = navVariations.map( function( v, i ) {
			return (
				<ModalNavItem key={ i } variation={ v } selected={ selectedVariation } />
			);
		} );

		return (
			<div className="products__product-form-modal-wrapper">
				<VerticalMenu onClick={ this.switchVariation } className="products__product-form-modal-menu">
					{navItems}
				</VerticalMenu>

				<div className="products__product-form-modal-contents">
					<h1>{ formattedVariationName( variation ) }</h1>

					<p><span>SKU:</span></p>

					<FormFieldSet className="products__product-form-details-basic-description">
						<FormLabel htmlFor="description">{ translate( 'Description' ) }</FormLabel>
						<FormTextArea name="description" value={ variation.description || '' } onChange={ this.setDescription } />
						<p>{ translate(
								'This will be displayed in addition to the main product description when this variation is selected.'
						) }</p>
					</FormFieldSet>

					<FormLabel>
						{ translate( 'Visible' ) }
						<FormToggle
							onChange={ this.toggleVisible }
							checked={ variation.visible }
						/>
					</FormLabel>
					<p>{ translate(
						'Hidden variations cannot be selected for purchase by customers.'
					) }</p>
				</div>
			</div>
		);
	}

}

const ModalNavItem = props => {
	const {
		onClick,
		variation,
		selected,
	} = props;

	const classes = classNames(
		'vertical-menu__items',
		{ 'is-selected': ( variation.id === selected ) }
	);

	return (
		/* eslint-disable react/jsx-no-bind */
		<li className={ classes } onClick={ () => onClick( variation.id ) }>
			{ formattedVariationName( variation ) }
		</li>
	);
};

export default localize( ProductFormVariationsModal );
