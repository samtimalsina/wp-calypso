/**
 * External dependencies
 */
import React from 'react';
import noop from 'lodash/noop';
import i18n from 'i18n-calypso';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import Dialog from 'components/dialog';
import Button from 'components/button';
import Spinner from 'components/spinner';
import { getCurrentUserEmail } from 'state/current-user/selectors';
import {
	verifyEmail,
	resetVerifyEmailState,
} from 'state/current-user/email-verification/actions';

class VerifyEmailDialog extends React.Component {

	getResendButtonLabel() {
		if ( this.props.emailSent ) {
			return i18n.translate( 'Email Sent' );
		}
		if ( this.props.pendingRequest ) {
			return <Spinner className="email-verification-dialog__confirmation-dialog-spinner" />;
		}
		return i18n.translate( 'Resend Email' );
	}

	handleClose = () => {
		this.props.resetVerifyEmailState();
		this.props.onClose();
	};

	getDialogButtons() {
		return [
			<Button
				key="resend"
				primary={ false }
				disabled={ this.props.pendingRequest || this.props.emailSent }
				onClick={ this.props.verifyEmail }>
				{ this.getResendButtonLabel() }
			</Button>,
			<Button
				key="close"
				primary={ true }
				onClick={ this.handleClose }>
					{ i18n.translate( 'OK' ) }
			</Button>
		];
	}

	render() {
		const strings = {
			confirmHeading: i18n.translate( 'Please confirm your email address' ),

			confirmExplanation: i18n.translate( 'We sent you an email when you first signed up. ' +
				'Please open the message and click the blue button.' ),

			confirmReasoning: i18n.translate( 'Email confirmation allows us to assist when recovering ' +
				'your account in the event you forget your password.' ),

			confirmEmail: i18n.translate(
				'{{wrapper}}%(email)s{{/wrapper}} {{emailPreferences}}change{{/emailPreferences}}',
				{
					components: {
						wrapper: <span className="email-verification-dialog__confirmation-dialog-email-wrapper" />,
						emailPreferences: <a href="/me/account" />
					},
					args: {
						email: this.props.email
					}
				}
			)
		};

		return (
			<Dialog
				isVisible={ true }
				buttons={ this.getDialogButtons() }
				additionalClassNames="email-verification-dialog__confirmation-dialog is-narrow"
			>
				<h1 className="email-verification-dialog__confirmation-dialog-heading is-variable-height">{ strings.confirmHeading }</h1>
				<p className="email-verification-dialog__confirmation-dialog-email">{ strings.confirmEmail }</p>
				<p className="email-verification-dialog__confirmation-dialog-explanation">{ strings.confirmExplanation }</p>
				<p className="email-verification-dialog__confirmation-dialog-reasoning">{ strings.confirmReasoning }</p>
			</Dialog>
		);
	}
}

VerifyEmailDialog.propTypes = {
	onClose: React.PropTypes.func,
	// connected props:
	email: React.PropTypes.string,
	pendingRequest: React.PropTypes.bool,
	emailSent: React.PropTypes.bool,
	error: React.PropTypes.bool,
};

VerifyEmailDialog.defaultProps = {
	onClose: noop
};

export default connect(
	state => ( {
		email: getCurrentUserEmail( state ),
		pendingRequest: state.currentUser.emailVerification.pendingRequest,
		emailSent: state.currentUser.emailVerification.emailSent,
		error: state.currentUser.emailVerification.error,
	} ),
	{
		verifyEmail,
		resetVerifyEmailState,
	}
)( VerifyEmailDialog );
