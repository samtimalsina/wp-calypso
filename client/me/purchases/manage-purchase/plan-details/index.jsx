/**
 * External Dependencies
 */
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { localize } from 'i18n-calypso';

/**
 * Internal Dependencies
 */
import Card from 'components/card';
import ClipboardButtonInput from 'components/clipboard-button-input';
import FormFieldset from 'components/forms/form-fieldset';
import FormLabel from 'components/forms/form-label';
import QueryPluginKeys from 'components/data/query-plugin-keys';
import SectionHeader from 'components/section-header';
import { isRequestingSites } from 'state/sites/selectors';
import { getByPurchaseId, hasLoadedUserPurchasesFromServer } from 'state/purchases/selectors';
import { getPurchase, isDataLoading } from 'me/purchases/utils';
import { getName } from 'lib/purchases';
import { isJetpackPlan, isFreeJetpackPlan } from 'lib/products-values';
import { getPluginsForSite } from 'state/plugins/premium/selectors';

class PurchasePlanDetails extends Component {
	renderPluginLabel( slug ) {
		switch ( slug ) {
			case 'vaultpress':
				return this.props.translate( 'Backups and security scanning API key' );
			case 'akismet':
				return this.props.translate( 'Anti-spam API key' );
		}
	}

	render() {
		const { selectedSite, pluginList, translate } = this.props;
		const purchase = getPurchase( this.props );

		if ( isDataLoading( this.props ) || ! this.props.selectedSite ) {
			return null;
		}

		if ( ! isJetpackPlan( purchase ) || isFreeJetpackPlan( purchase ) ) {
			return null;
		}

		const headerText = translate( '%(planName)s Plan', {
			args: {
				planName: getName( purchase )
			}
		} );

		return (
			<div>
				<QueryPluginKeys siteId={ selectedSite.ID } />
				<SectionHeader label={ headerText } />
				<Card>
					{ pluginList.map( ( plugin, i ) => {
						return (
							<FormFieldset key={ i }>
								<FormLabel htmlFor={ `plugin-${ plugin.slug }` }>{ this.renderPluginLabel( plugin.slug ) }</FormLabel>
								<ClipboardButtonInput id={ `plugin-${ plugin.slug }` } value={ plugin.key } />
							</FormFieldset>
						);
					} ) }
				</Card>
			</div>
		);
	}
}

// hasLoadedSites & hasLoadedUserPurchasesFromServer are used in isDataLoading,
// selectedPurchase is used in getPurchase
export default connect(
	( state, props ) => ( {
		hasLoadedSites: ! isRequestingSites( state ),
		hasLoadedUserPurchasesFromServer: hasLoadedUserPurchasesFromServer( state ),
		selectedPurchase: getByPurchaseId( state, props.purchaseId ),
		pluginList: props.selectedSite ? getPluginsForSite( state, props.selectedSite.ID ) : [],
	} )
)( localize( PurchasePlanDetails ) );
