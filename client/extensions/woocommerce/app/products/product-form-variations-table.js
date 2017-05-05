/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import { localize } from 'i18n-calypso';
import { isNumber } from 'lodash';

/**
 * Internal dependencies
 */
import Dialog from 'components/dialog';
import ProductFormVariationsModal from './product-form-variations-modal';
import ProductFormVariationRow from './product-form-variation-row';

class ProductFormVariationsTable extends React.Component {

	static propTypes = {
		variations: PropTypes.array,
		product: PropTypes.object,
		editProductVariation: PropTypes.func.isRequired,
	};

	constructor( props ) {
		super( props );

		this.state = {
			showDialog: false,
			selectedVariation: null,
		};

		this.onShowDialog = this.onShowDialog.bind( this );
		this.onCloseDialog = this.onCloseDialog.bind( this );
	}

	onShowDialog( selectedVariation ) {
		this.setState( {
			showDialog: true,
			selectedVariation,
		} );
	}

	onCloseDialog() {
		this.setState( {
			showDialog: false,
			selectedVariation: null,
		} );
	}

	renderModal() {
		const { variations, product, editProductVariation } = this.props;
		const { showDialog, selectedVariation } = this.state;

		const buttons = [
			{ action: 'done', label: this.props.translate( 'Done' ) },
		];

		return (
			<Dialog
				isVisible={ showDialog }
				buttons={ buttons }
				onClose={ this.onCloseDialog }
				className="products__product-form-variation-modal"
			>
				<ProductFormVariationsModal
					product={ product }
					variations={ variations }
					selectedVariation={ selectedVariation }
					onShowDialog={ this.onShowDialog }
					editProductVariation={ editProductVariation }
				/>
			</Dialog>
		);
	}

	renderVariationRow( variation ) {
		const { product, variations, editProductVariation } = this.props;
		const id = isNumber( variation.id ) && variation.id || 'index_' + variation.id.index;
		const manageStock = variations && variations[ 0 ].manage_stock || false;

		return (
			<ProductFormVariationRow
				key={ id }
				product={ product }
				variation={ variation }
				manageStock={ manageStock }
				editProductVariation={ editProductVariation }
				onShowDialog={ this.onShowDialog }
			/>
		);
	}

	render() {
		const { variations, translate } = this.props;
		return (
			<div className="products__product-form-variation-table-wrapper">
				<table className="products__product-form-variation-table">
					<thead>
						<tr>
							<th></th>
							<th></th>
							<th>{ translate( 'Price' ) }</th>
							<th>{ translate( 'Dimensions & weight' ) }</th>
							<th>{ translate( 'Manage stock' ) }</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{ variations && variations.map( ( v ) => this.renderVariationRow( v ) ) }
					</tbody>
				</table>
				{ this.renderModal() }
			</div>
		);
	}

}

export default localize( ProductFormVariationsTable );
