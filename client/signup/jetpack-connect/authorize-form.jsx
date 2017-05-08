/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import page from 'page';
import urlModule from 'url';
import i18n from 'i18n-calypso';
const debug = require( 'debug' )( 'calypso:jetpack-connect:authorize-form' );
import cookie from 'cookie';

/**
 * Internal dependencies
 */
import addQueryArgs from 'lib/route/add-query-args';
import { login } from 'lib/paths';
import Main from 'components/main';
import StepHeader from '../step-header';
import LoggedOutFormLinks from 'components/logged-out-form/links';
import LoggedOutFormLinkItem from 'components/logged-out-form/link-item';
import SignupForm from 'components/signup-form';
import WpcomLoginForm from 'signup/wpcom-login-form';
import {
	createAccount,
	authorize,
	goBackToWpAdmin,
	retryAuth,
	goToXmlrpcErrorFallbackUrl
} from 'state/jetpack-connect/actions';
import {
	getAuthorizationData,
	getAuthorizationRemoteSite,
	getSSOSessions,
	isCalypsoStartedConnection,
	hasXmlrpcError,
	hasExpiredSecretError,
	getSiteSelectedPlan,
	isRemoteSiteOnSitesList,
	getGlobalSelectedPlan,
	getAuthAttempts
} from 'state/jetpack-connect/selectors';
import observe from 'lib/mixins/data-observe';
import userUtilities from 'lib/user/utils';
import Card from 'components/card';
import Gravatar from 'components/gravatar';
import LocaleSuggestions from 'signup/locale-suggestions';
import { recordTracksEvent } from 'state/analytics/actions';
import Spinner from 'components/spinner';
import { decodeEntities } from 'lib/formatting';
import versionCompare from 'lib/version-compare';
import EmptyContent from 'components/empty-content';
import Button from 'components/button';
import { requestSites } from 'state/sites/actions';
import { isRequestingSites } from 'state/sites/selectors';
import MainWrapper from './main-wrapper';
import HelpButton from './help-button';
import { urlToSlug } from 'lib/url';
import Plans from './plans';
import CheckoutData from 'components/data/checkout';
import { externalRedirect } from 'lib/route/path';
import SiteCard from './site-card';
import LoggedInForm from './auth-logged-in-form';

const LoggedOutForm = React.createClass( {
	displayName: 'LoggedOutForm',

	componentDidMount() {
		this.props.recordTracksEvent( 'calypso_jpc_signup_view' );
	},

	renderFormHeader() {
		const headerText = i18n.translate( 'Create your account' );
		const subHeaderText = i18n.translate( 'You are moments away from connecting your site.' );
		const { queryObject } = this.props.jetpackConnectAuthorize;
		const siteCard = versionCompare( queryObject.jp_version, '4.0.3', '>' )
			? <SiteCard queryObject={ queryObject } />
			: null;

		return (
			<div>
				<StepHeader
					headerText={ headerText }
					subHeaderText={ subHeaderText } />
				{ siteCard }
			</div>
		);
	},

	submitForm( form, userData ) {
		debug( 'submiting new account', form, userData );
		this.props.createAccount( userData );
	},

	isSubmitting() {
		return this.props.jetpackConnectAuthorize && this.props.jetpackConnectAuthorize.isAuthorizing;
	},

	loginUser() {
		const { queryObject, userData, bearerToken } = this.props.jetpackConnectAuthorize;
		const redirectTo = addQueryArgs( queryObject, window.location.href );
		return (
			<WpcomLoginForm
				log={ userData.username }
				authorization={ 'Bearer ' + bearerToken }
				redirectTo={ redirectTo } />
		);
	},

	renderLocaleSuggestions() {
		if ( ! this.props.locale ) {
			return;
		}

		return (
			<LocaleSuggestions path={ this.props.path } locale={ this.props.locale } />
		);
	},

	renderFooterLink() {
		const { queryObject } = this.props.jetpackConnectAuthorize;
		const redirectTo = addQueryArgs( queryObject, window.location.href );

		return (
			<LoggedOutFormLinks>
				<LoggedOutFormLinkItem href={ login( { redirectTo } ) }>
					{ this.translate( 'Already have an account? Sign in' ) }
				</LoggedOutFormLinkItem>
				<HelpButton onClick={ this.clickHelpButton } />
			</LoggedOutFormLinks>
		);
	},

	render() {
		const { userData } = this.props.jetpackConnectAuthorize;
		return (
			<div>
				{ this.renderLocaleSuggestions() }
				{ this.renderFormHeader() }
				<SignupForm
					getRedirectToAfterLoginUrl={ window.location.href }
					disabled={ this.isSubmitting() }
					submitting={ this.isSubmitting() }
					save={ this.save }
					submitForm={ this.submitForm }
					submitButtonText={ this.translate( 'Sign Up and Connect Jetpack' ) }
					footerLink={ this.renderFooterLink() }
					suggestedUsername={ userData && userData.username ? userData.username : '' }
				/>
				{ userData && this.loginUser() }
			</div>
		);
	}
} );

const JetpackConnectAuthorizeForm = React.createClass( {
	displayName: 'JetpackConnectAuthorizeForm',
	mixins: [ observe( 'userModule' ) ],

	componentWillMount() {
		this.props.recordTracksEvent( 'calypso_jpc_authorize_form_view' );
	},

	isSSO() {
		const cookies = cookie.parse( document.cookie );
		const query = this.props.jetpackConnectAuthorize.queryObject;
		return (
			query.from &&
			'sso' === query.from &&
			cookies.jetpack_sso_approved &&
			query.client_id &&
			query.client_id === cookies.jetpack_sso_approved
		);
	},

	renderNoQueryArgsError() {
		return (
			<Main className="jetpack-connect__main-error">
				<EmptyContent
					illustration="/calypso/images/drake/drake-whoops.svg"
					title={ this.translate(
						'Oops, this URL should not be accessed directly'
					) }
					action={ this.translate( 'Get back to Jetpack Connect screen' ) }
					actionURL="/jetpack/connect"
				/>
				<LoggedOutFormLinks>
					<HelpButton onClick={ this.clickHelpButton } />
				</LoggedOutFormLinks>
			</Main>
		);
	},

	renderPlansSelector() {
		return (
				<div>
					<CheckoutData>
						<Plans { ...this.props } showFirst={ true } />
					</CheckoutData>
				</div>
		);
	},

	renderForm() {
		const { userModule } = this.props;
		const user = userModule.get();
		const props = Object.assign( {}, this.props, {
			user: user
		} );

		return (
			( user )
				? <LoggedInForm { ...props } isSSO={ this.isSSO() } />
				: <LoggedOutForm { ...props } isSSO={ this.isSSO() } />
		);
	},

	render() {
		const { queryObject } = this.props.jetpackConnectAuthorize;

		if ( typeof queryObject === 'undefined' ) {
			return this.renderNoQueryArgsError();
		}

		if ( queryObject && queryObject.already_authorized && ! this.props.isAlreadyOnSitesList ) {
			this.renderForm();
		}

		if ( this.props.plansFirst && ! this.props.selectedPlan ) {
			return this.renderPlansSelector();
		}

		return (
			<MainWrapper>
				<div className="jetpack-connect__authorize-form">
					{ this.renderForm() }
				</div>
			</MainWrapper>
		);
	}
} );

export default connect(
	state => {
		const remoteSiteUrl = getAuthorizationRemoteSite( state );
		const siteSlug = urlToSlug( remoteSiteUrl );
		const requestHasXmlrpcError = () => {
			return hasXmlrpcError( state );
		};
		const requestHasExpiredSecretError = () => {
			return hasExpiredSecretError( state );
		};
		const selectedPlan = getSiteSelectedPlan( state, siteSlug ) || getGlobalSelectedPlan( state );

		return {
			siteSlug,
			selectedPlan,
			jetpackConnectAuthorize: getAuthorizationData( state ),
			plansFirst: false,
			jetpackSSOSessions: getSSOSessions( state ),
			isAlreadyOnSitesList: isRemoteSiteOnSitesList( state ),
			isFetchingSites: isRequestingSites( state ),
			requestHasXmlrpcError,
			requestHasExpiredSecretError,
			calypsoStartedConnection: isCalypsoStartedConnection( state, remoteSiteUrl ),
			authAttempts: getAuthAttempts( state, siteSlug ),
		};
	},
	dispatch => bindActionCreators( {
		requestSites,
		recordTracksEvent,
		authorize,
		createAccount,
		goBackToWpAdmin,
		retryAuth,
		goToXmlrpcErrorFallbackUrl
	}, dispatch )
)( JetpackConnectAuthorizeForm );
