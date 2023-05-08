/**
 * Publicize sharing form component.
 *
 * Displays text area and connection list to allow user
 * to select connections to share to and write a custom
 * sharing message.
 */

import { getRedirectUrl } from '@automattic/jetpack-components';
import { getSiteFragment } from '@automattic/jetpack-shared-extension-utils';
import { PanelRow, Disabled, ExternalLink } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { Fragment, createInterpolateElement, useCallback } from '@wordpress/element';
import { _n, sprintf, __ } from '@wordpress/i18n';
import useImageGeneratorConfig from '../../hooks/use-image-generator-config';
import useSocialMediaConnections from '../../hooks/use-social-media-connections';
import useSocialMediaMessage from '../../hooks/use-social-media-message';
import PublicizeConnection from '../connection';
import MediaSection from '../media-section';
import MessageBoxControl from '../message-box-control';
import Notice from '../notice';
import PublicizeSettingsButton from '../settings-button';
import styles from './styles.module.scss';

const checkConnectionCode = ( connection, code ) =>
	false === connection.is_healthy && code === ( connection.error_code ?? 'broken' );

/**
 * The Publicize form component. It contains the connection list, and the message box.
 *
 * @param {object} props                                - The component props.
 * @param {boolean} props.isPublicizeEnabled            - Whether Publicize is enabled for this post.
 * @param {boolean} props.isPublicizeDisabledBySitePlan - A combination of the republicize feature being enabled and/or the post not being published.
 * @param {number} props.numberOfSharesRemaining        - The number of shares remaining for the current period. Optional.
 * @param {boolean} props.isEnhancedPublishingEnabled   - Whether enhanced publishing options are available. Optional.
 * @param {boolean} props.isSocialImageGeneratorEnabled - Whether the Social Image Generator feature is available. Optional.
 * @param {string} props.connectionsAdminUrl            - URL to the Admin connections page
 * @param {string} props.adminUrl                       - URL af the plugin's admin page to redirect to after a plan upgrade
 * @returns {object}                                    - Publicize form component.
 */
export default function PublicizeForm( {
	isPublicizeEnabled,
	isPublicizeDisabledBySitePlan,
	numberOfSharesRemaining = null,
	isEnhancedPublishingEnabled = false,
	isSocialImageGeneratorEnabled = false,
	connectionsAdminUrl,
	adminUrl,
} ) {
	const { connections, toggleById, hasConnections, enabledConnections } =
		useSocialMediaConnections();
	const { message, updateMessage, maxLength } = useSocialMediaMessage();
	const { isEnabled: isSocialImageGeneratorEnabledForPost } = useImageGeneratorConfig();

	const shouldDisableMediaPicker =
		isSocialImageGeneratorEnabled && isSocialImageGeneratorEnabledForPost;
	const Wrapper = isPublicizeDisabledBySitePlan ? Disabled : Fragment;

	const brokenConnections = connections.filter( connection =>
		checkConnectionCode( connection, 'broken' )
	);
	const unsupportedConnections = connections.filter( connection =>
		checkConnectionCode( connection, 'unsupported' )
	);

	const outOfConnections =
		numberOfSharesRemaining !== null && numberOfSharesRemaining <= enabledConnections.length;

	const { isEditedPostDirty } = useSelect( 'core/editor' );
	const { autosave } = useDispatch( 'core/editor' );
	const autosaveAndRedirect = useCallback(
		async ev => {
			const target = ev.target.getAttribute( 'target' );
			if ( isEditedPostDirty() && ! target ) {
				ev.preventDefault();
				await autosave();
				window.location.href = ev.target.href;
			}
			if ( target ) {
				ev.preventDefault();
				window.open( ev.target.href, target, 'noreferrer' );
			}
		},
		[ autosave, isEditedPostDirty ]
	);

	const renderNotices = () => (
		<>
			{ brokenConnections.length > 0 && (
				<Notice type={ 'error' }>
					{ createInterpolateElement(
						_n(
							'One of your social connections is broken. Reconnect them on the <fixLink>connection management</fixLink> page.',
							'Some of your social connections are broken. Reconnect them on the <fixLink>connection management</fixLink> page.',
							brokenConnections.length,
							'jetpack'
						),
						{
							fixLink: <ExternalLink href={ connectionsAdminUrl } />,
						}
					) }
				</Notice>
			) }
			{ unsupportedConnections.length > 0 && (
				<Notice type={ 'error' }>
					{ createInterpolateElement(
						__(
							'Twitter is not supported anymore. <moreInfo>Learn more here</moreInfo>.',
							'jetpack'
						),
						{
							moreInfo: <ExternalLink href={ connectionsAdminUrl } />,
						}
					) }
				</Notice>
			) }
		</>
	);

	return (
		<Wrapper>
			{ hasConnections && (
				<>
					{ numberOfSharesRemaining !== null && (
						<PanelRow>
							<Notice type={ numberOfSharesRemaining < connections.length ? 'warning' : 'default' }>
								<Fragment>
									{ createInterpolateElement(
										sprintf(
											/* translators: %d is the number of shares remaining, upgradeLink is the link to upgrade to a different plan */
											_n(
												'You have %d share remaining in the next 30 days. <upgradeLink>Upgrade now</upgradeLink> to share more.',
												'You have %d shares remaining in the next 30 days. <upgradeLink>Upgrade now</upgradeLink> to share more.',
												numberOfSharesRemaining,
												'jetpack'
											),
											numberOfSharesRemaining
										),
										{
											upgradeLink: (
												<a
													className={ styles[ 'upgrade-link' ] }
													href={ getRedirectUrl( 'jetpack-social-basic-plan-block-editor', {
														site: getSiteFragment(),
														query: 'redirect_to=' + encodeURIComponent( window.location.href ),
													} ) }
													onClick={ autosaveAndRedirect }
												/>
											),
										}
									) }
									<br />
									{ createInterpolateElement(
										/* translators: %d is the number of shares remaining, moreLink is the link to find out more information about the plan */
										__( '<moreLink>More about Jetpack Social</moreLink>.', 'jetpack' ),
										{
											moreLink: (
												<a
													className={ styles[ 'more-link' ] }
													href={ getRedirectUrl( 'jetpack-social-block-editor-more-info', {
														site: getSiteFragment(),
														...( adminUrl
															? { query: 'redirect_to=' + encodeURIComponent( adminUrl ) }
															: {} ),
													} ) }
													target="_blank"
													rel="noreferrer"
													onClick={ autosaveAndRedirect }
												/>
											),
										}
									) }
								</Fragment>
							</Notice>
						</PanelRow>
					) }
					{ renderNotices() }
					<PanelRow>
						<ul className={ styles[ 'connections-list' ] }>
							{ connections.map(
								( {
									display_name,
									enabled,
									id,
									service_name,
									toggleable,
									profile_picture,
									is_healthy,
								} ) => (
									<PublicizeConnection
										disabled={
											! isPublicizeEnabled ||
											( ! enabled && toggleable && outOfConnections ) ||
											false === is_healthy
										}
										enabled={ enabled && ! isPublicizeDisabledBySitePlan && false !== is_healthy }
										key={ id }
										id={ id }
										label={ display_name }
										name={ service_name }
										toggleConnection={ toggleById }
										profilePicture={ profile_picture }
									/>
								)
							) }
						</ul>
					</PanelRow>
				</>
			) }

			{ ! isPublicizeDisabledBySitePlan && (
				<Fragment>
					<PublicizeSettingsButton />

					{ isPublicizeEnabled && connections.some( connection => connection.enabled ) && (
						<>
							<MessageBoxControl
								maxLength={ maxLength }
								onChange={ updateMessage }
								message={ message }
							/>
						</>
					) }
					{ isEnhancedPublishingEnabled && (
						<MediaSection
							disabled={ shouldDisableMediaPicker }
							notice={
								shouldDisableMediaPicker
									? __(
											'It is not possible to add an image or video when Social Image Generator is enabled.',
											'jetpack'
									  )
									: null
							}
						/>
					) }
				</Fragment>
			) }
		</Wrapper>
	);
}
