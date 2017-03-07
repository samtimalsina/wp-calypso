/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import { localize } from 'i18n-calypso';
import { connect } from 'react-redux';
import { includes } from 'lodash';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import FoldableCard from 'components/foldable-card';
import FormFieldset from 'components/forms/form-fieldset';
import FormLabel from 'components/forms/form-label';
import FormTextInput from 'components/forms/form-text-input';
import FormInputValidation from 'components/forms/form-input-validation';
import InfoPopover from 'components/info-popover';
import ExternalLink from 'components/external-link';
import { getSelectedSiteId } from 'state/ui/selectors';
import { getJetpackSettingsSaveError, getJetpackSettingsSaveRequestStatus } from 'state/selectors';
import FormSettingExplanation from 'components/forms/form-setting-explanation';

const SpamFilteringSettings = ( {
	fields,
	dirtyFields,
	hasAkismetKeyError,
	isRequestingSettings,
	isSavingSettings,
	onChangeField,
	translate
} ) => {
	const { wordpress_api_key, akismet: akismetActive } = fields;
	const isDirty = includes( dirtyFields, 'wordpress_api_key' );
	const header = ( akismetActive && wordpress_api_key && ! isDirty )
		? translate( 'Your site is protected from spam.' )
		: translate( 'Your site needs an Antispam key.' );

	const inTransition = isRequestingSettings || isSavingSettings;
	const validationText = hasAkismetKeyError
		? translate( 'There\'s a problem with your Antispam API key.' )
		: translate( 'Your Antispam key is valid.' );
	const className = ( inTransition || isDirty )
		? null
		: classNames( {
			'is-valid': wordpress_api_key && ! hasAkismetKeyError,
			'is-error': wordpress_api_key && hasAkismetKeyError
		} );
	return (
		<div className="site-settings__spam-filtering">
			<FoldableCard header={ header }>
				<FormFieldset>
					<div className="spam-filtering-settings__info-link-container site-settings__info-link-container">
						<InfoPopover >
							<ExternalLink target="_blank" icon
								href={ 'https://jetpack.com/features/security/spam-filtering/' }>
								{ translate( 'Learn more about spam filtering.' ) }
							</ExternalLink>
						</InfoPopover>
					</div>
					<div className="site-settings__child-settings">
						<FormLabel>{ translate( 'Your API Key ' ) }</FormLabel>
						<FormTextInput
							className={ className }
							value={ wordpress_api_key }
							disabled={ inTransition || ! akismetActive }
							onChange={ onChangeField( 'wordpress_api_key' ) }
						/>
						{
							wordpress_api_key && ! inTransition && ! isDirty && (
								<FormInputValidation isError={ hasAkismetKeyError } text={ validationText } />
							)
						}
						{
							( ! wordpress_api_key || hasAkismetKeyError ) && (
								<FormSettingExplanation>
									{ translate(
										'If you don\'t already have an API key, then' +
										' {{ExternalLink}}Get your API key here{{/ExternalLink}},' +
										' and you\'ll be guided through the process of getting one in a new window.',
										{
											components: {
												ExternalLink: (
													<ExternalLink icon
														href="https://akismet.com/wordpress/"
														target="_blank" />
												)
											}
										}
									) }
								</FormSettingExplanation>
							)
						}
					</div>
				</FormFieldset>
			</FoldableCard>
		</div>
	);
};

SpamFilteringSettings.propTypes = {
	hasAksimetKeyError: PropTypes.bool,
	isSavingSettings: PropTypes.bool,
	isRequestingSettings: PropTypes.bool,
	handleField: PropTypes.func,
	dirtyFields: PropTypes.object,
	fields: PropTypes.object
};

export default connect(
	( state ) => {
		const selectedSiteId = getSelectedSiteId( state );
		const jetpackSettingsSaveError = getJetpackSettingsSaveError( state, selectedSiteId );
		const jetpackSettingsSaveStatus = getJetpackSettingsSaveRequestStatus( state, selectedSiteId );
		const hasAkismetKeyError = jetpackSettingsSaveStatus && jetpackSettingsSaveStatus === 'error' &&
			( jetpackSettingsSaveError === ' wordpress_api_key: Invalid Akismet key' ||
			jetpackSettingsSaveError === 'Invalid parameter(s): wordpress_api_key' );
		return {
			hasAkismetKeyError
		};
	}
)( localize( SpamFilteringSettings ) );
