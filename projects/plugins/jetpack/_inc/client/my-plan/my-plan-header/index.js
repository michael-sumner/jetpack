/**
 * External dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { find, isEmpty } from 'lodash';

/**
 * WordPress dependencies
 */
import { createInterpolateElement } from '@wordpress/element';
import { __, _n, _x, sprintf } from '@wordpress/i18n';
import { getRedirectUrl } from '@automattic/jetpack-components';

/**
 * Internal dependencies
 */
import analytics from 'lib/analytics';
import Button from 'components/button';
import Card from 'components/card';
import ExternalLink from 'components/external-link';
import ProductExpiration from 'components/product-expiration';
import UpgradeLink from 'components/upgrade-link';
import { getPlanClass } from 'lib/plans/constants';
import {
	getUpgradeUrl,
	getDateFormat,
	showBackups,
	showRecommendations,
	showLicensingUi,
} from 'state/initial-state';
import { getDetachedLicensesCount } from 'state/licensing';
import { ProductActivated } from 'components/product-activated';
import License from './license';
import MyPlanCard from '../my-plan-card';

const TIER_1_BACKUP_STORAGE_GB = 10;
const TIER_2_BACKUP_STORAGE_TB = 1;

class MyPlanHeader extends React.Component {
	getProductProps( productSlug ) {
		const { displayBackups, dateFormat, purchases } = this.props;

		const productProps = {
			productSlug,
		};

		if ( ! productSlug ) {
			return {
				...productProps,
				isPlaceholder: true,
			};
		}

		const purchase = find( purchases, purchaseObj => purchaseObj.product_slug === productSlug );
		let expiration;
		let activation;
		if ( purchase ) {
			expiration = (
				<ProductExpiration
					dateFormat={ dateFormat }
					expiryDate={ purchase.expiry_date }
					purchaseDate={ purchase.subscribed_date }
					isRefundable={ purchase.is_refundable }
				/>
			);

			activation = purchase.active === '1' ? <ProductActivated /> : null;
		}

		switch ( getPlanClass( productSlug ) ) {
			case 'is-free-plan':
				return {
					...productProps,
					tagLine: createInterpolateElement(
						__(
							'Worried about security? Get backups, automated security fixes and more: <a>Upgrade now</a>',
							'jetpack'
						),
						{
							a: (
								<UpgradeLink
									source="my-plan-header-free-plan-text-link"
									target="upgrade-now"
									feature="my-plan-header-free-upgrade"
								/>
							),
						}
					),
					title: __( 'Jetpack Free', 'jetpack' ),
				};

			case 'is-personal-plan':
				return {
					...productProps,
					details: expiration,
					tagLine: displayBackups
						? __( 'Daily backups, spam filtering, and priority support.', 'jetpack' )
						: __(
								'Spam filtering and priority support.',
								'jetpack',
								/* dummy arg to avoid bad minification */ 0
						  ),
					title: __( 'Jetpack Personal', 'jetpack' ),
				};

			case 'is-premium-plan':
				return {
					...productProps,
					details: [ activation, expiration ],
					tagLine: __(
						'Full security suite, marketing and revenue automation tools, unlimited video hosting, and priority support.',
						'jetpack'
					),
					title: __( 'Jetpack Premium', 'jetpack' ),
				};

			case 'is-business-plan':
				return {
					...productProps,
					details: [ activation, expiration ],
					tagLine: __(
						'Full security suite, marketing and revenue automation tools, unlimited video hosting, and priority support.',
						'jetpack'
					),
					title: __( 'Jetpack Professional', 'jetpack' ),
				};

			case 'is-security-t1-plan':
				return {
					...productProps,
					details: [ activation, expiration ],
					tagLine: createInterpolateElement(
						sprintf(
							/* translators: %1$d is the number of gigabytes of storage space the site has. */
							_n(
								'Enjoy the peace of mind of complete site protection. You have <strong>%1$dGB</strong> of storage space.',
								'Enjoy the peace of mind of complete site protection. You have <strong>%1$dGB</strong> of storage space.',
								TIER_1_BACKUP_STORAGE_GB,
								'jetpack'
							),
							TIER_1_BACKUP_STORAGE_GB
						),
						{ strong: <strong /> }
					),
					title: __( 'Jetpack Security', 'jetpack' ),
				};

			case 'is-security-t2-plan':
				return {
					...productProps,
					details: [ activation, expiration ],
					tagLine: createInterpolateElement(
						sprintf(
							/* translators: %1$d is the number of gigabytes of storage space the site has. */
							_n(
								'Enjoy the peace of mind of complete site protection. You have <strong>%1$dTB</strong> of storage space.',
								'Enjoy the peace of mind of complete site protection. You have <strong>%1$dTB</strong> of storage space.',
								TIER_2_BACKUP_STORAGE_TB,
								'jetpack'
							),
							TIER_2_BACKUP_STORAGE_TB
						),
						{ strong: <strong /> }
					),
					title: __( 'Jetpack Security', 'jetpack' ),
				};

			case 'is-complete-plan':
				return {
					...productProps,
					details: [ activation, expiration ],
					tagLine: __(
						'The most powerful WordPress sites: Top-tier security bundle, enhanced search.',
						'jetpack'
					),
					title: __( 'Jetpack Complete', 'jetpack' ),
				};

			case 'is-backup-t1-plan':
				return {
					...productProps,
					details: [ activation, expiration ],
					tagLine: createInterpolateElement(
						sprintf(
							/* translators: %1$d is the number of gigabytes of storage space the site has. */
							_n(
								'Your data is being securely backed up as you edit. You have <strong>%1$dGB</strong> of storage space.',
								'Your data is being securely backed up as you edit. You have <strong>%1$dGB</strong> of storage space.',
								TIER_1_BACKUP_STORAGE_GB,
								'jetpack'
							),
							TIER_1_BACKUP_STORAGE_GB
						),
						{ strong: <strong /> }
					),
					title: __( 'Jetpack Backup', 'jetpack' ),
				};

			case 'is-backup-t2-plan':
				return {
					...productProps,
					details: [ activation, expiration ],
					tagLine: createInterpolateElement(
						sprintf(
							/* translators: %1$d is the number of terabytes of storage space the site has. */
							_n(
								'Your data is being securely backed up as you edit. You have <strong>%1$dTB</strong> of storage space.',
								'Your data is being securely backed up as you edit. You have <strong>%1$dTB</strong> of storage space.',
								TIER_2_BACKUP_STORAGE_TB,
								'jetpack'
							),
							TIER_2_BACKUP_STORAGE_TB
						),
						{ strong: <strong /> }
					),
					title: __( 'Jetpack Backup', 'jetpack' ),
				};

			case 'is-search-plan':
				return {
					...productProps,
					details: [ activation, expiration ],
					tagLine: __( 'Fast, highly relevant search results and powerful filtering.', 'jetpack' ),
					title: __( 'Jetpack Search', 'jetpack' ),
				};

			case 'is-scan-plan':
				return {
					...productProps,
					details: [ activation, expiration ],
					tagLine: __(
						'Automatic scanning and one-click fixes keep your site one step ahead of security threats.',
						'jetpack'
					),
					title: createInterpolateElement( __( 'Jetpack Scan <em>Daily</em>', 'jetpack' ), {
						em: <em />,
					} ),
				};

			case 'is-anti-spam-plan':
				return {
					...productProps,
					details: [ activation, expiration ],
					tagLine: __(
						'Automatically clear spam from comments and forms. Save time, get more responses, give your visitors a better experience – all without lifting a finger.',
						'jetpack'
					),
					title: __( 'Jetpack Anti-Spam', 'jetpack' ),
				};

			// DEPRECATED: Daily and Real-time variations will soon be retired.
			// Remove after all customers are migrated to new products.
			case 'is-daily-security-plan':
				return {
					...productProps,
					details: expiration,
					tagLine: __(
						'Enjoy the peace of mind of complete site protection. Great for brochure sites, restaurants, blogs, and resume sites.',
						'jetpack'
					),
					title: __( 'Jetpack Security Daily', 'jetpack' ),
				};
			case 'is-realtime-security-plan':
				return {
					...productProps,
					details: expiration,
					tagLine: __(
						'Additional security for sites with 24/7 activity. Recommended for eCommerce stores, news organizations, and online forums.',
						'jetpack'
					),
					title: __( 'Jetpack Security Real-Time', 'jetpack' ),
				};
			case 'is-daily-backup-plan':
				return {
					...productProps,
					details: expiration,
					tagLine: __(
						'Your data is being securely backed up every day with a 30-day archive.',
						'jetpack'
					),
					title: createInterpolateElement( __( 'Jetpack Backup <em>Daily</em>', 'jetpack' ), {
						em: <em />,
					} ),
				};
			case 'is-realtime-backup-plan':
				return {
					...productProps,
					details: expiration,
					tagLine: __( 'Your data is being securely backed up as you edit.', 'jetpack' ),
					title: createInterpolateElement( __( 'Jetpack Backup <em>Real-Time</em>', 'jetpack' ), {
						em: <em />,
					} ),
				};

			case 'is-videopress-plan':
				return {
					...productProps,
					details: [ activation, expiration ],
					tagLine: __( 'High-quality, ad-free video built specifically for WordPress.', 'jetpack' ),
					title: __( 'Jetpack VideoPress', 'jetpack' ),
				};

			default:
				return {
					...productProps,
					isPlaceholder: true,
				};
		}
	}

	renderPlan() {
		return (
			<>
				{ this.props.hasDetachedUserLicenses && this.renderLicensingActions() }
				<Card compact>
					{ this.renderHeader( __( 'My Plan', 'jetpack' ) ) }
					<MyPlanCard { ...this.getProductProps( this.props.plan ) } />
				</Card>
			</>
		);
	}

	renderProducts() {
		if ( isEmpty( this.props.activeProducts ) ) {
			return null;
		}

		return (
			<Card compact>
				{ this.renderHeader( __( 'My Products', 'jetpack' ) ) }
				{ this.props.activeProducts.map( ( { ID, product_slug } ) => (
					<MyPlanCard key={ 'product-card-' + ID } { ...this.getProductProps( product_slug ) } />
				) ) }
			</Card>
		);
	}

	renderHeader( title ) {
		return <h3 className="jp-landing__card-header">{ title }</h3>;
	}

	renderLicensingActions = () => {
		const {
			hasDetachedUserLicenses,
			showRecommendations: showRecommendationsButton,
			siteAdminUrl,
			purchases,
		} = this.props;
		// 'showRecommendationsButton' will be false if Jetpack is not active or we are in offline mode or if this is an Atomic site.
		if ( ! showRecommendationsButton ) {
			return null;
		}

		const showPurchasesLink = !! purchases?.length || hasDetachedUserLicenses;

		return (
			<Card compact>
				<div className="jp-landing__licensing-actions">
					{ hasDetachedUserLicenses && (
						<span>{ __( 'Got a license key? Activate it here.', 'jetpack' ) }</span>
					) }
					<div
						className={ classnames( 'jp-landing__licensing-actions-item', {
							'no-licenses': ! hasDetachedUserLicenses,
							'no-purchases': ! showPurchasesLink,
						} ) }
					>
						{ showPurchasesLink && (
							<ExternalLink
								className="all-purchases__link"
								href={ getRedirectUrl( 'calypso-purchases' ) }
								onClick={ this.trackAllPurchasesClick }
								target="_blank"
								icon={ true }
							>
								{ __( 'View all purchases', 'jetpack' ) }
							</ExternalLink>
						) }
						{ hasDetachedUserLicenses ? (
							<Button
								href={ siteAdminUrl + 'admin.php?page=jetpack#/license/activation' }
								onClick={ this.trackLicenseActivationClick }
								primary
							>
								{ _x( 'Activate a Product', 'Navigation item.', 'jetpack' ) }
							</Button>
						) : (
							<Button
								href={ siteAdminUrl + 'admin.php?page=jetpack#/recommendations' }
								onClick={ this.trackRecommendationsClick }
								primary
							>
								{ _x( 'Recommendations', 'Navigation item.', 'jetpack' ) }
							</Button>
						) }
					</div>
				</div>
			</Card>
		);
	};

	trackAllPurchasesClick = () => {
		analytics.tracks.recordJetpackClick( {
			target: 'calypso_purchases_link',
			page: 'my-plan',
		} );
	};
	trackLicenseActivationClick = () => {
		analytics.tracks.recordJetpackClick( {
			target: 'licensing_activation_button',
			path: 'licensing/activation',
			page: 'my-plan',
		} );
	};
	trackRecommendationsClick = () => {
		analytics.tracks.recordJetpackClick( {
			target: 'recommendations-button',
			page: 'my-plan',
		} );
	};

	renderFooter() {
		return (
			// The activation label should be displayed in the footer only if
			// there is no product to be activated.
			! this.props.hasDetachedUserLicenses && this.renderLicensingActions()
		);
	}

	render() {
		return (
			<div className="jp-landing__plans">
				{ this.renderPlan() }
				{ this.renderProducts() }
				{ this.renderFooter() }
				{ this.props.showLicensingUi && (
					<Card compact>
						<License />
					</Card>
				) }
			</div>
		);
	}
}

MyPlanHeader.propTypes = {
	activeProducts: PropTypes.array,
	plan: PropTypes.string,
	purchases: PropTypes.array,
	siteAdminUrl: PropTypes.string,

	// From connect HoC
	dateFormat: PropTypes.string,
	displayBackups: PropTypes.bool,
	plansMainTopUpgradeUrl: PropTypes.string,
	showRecommendations: PropTypes.bool,
};

export default connect( state => {
	return {
		dateFormat: getDateFormat( state ),
		displayBackups: showBackups( state ),
		plansMainTopUpgradeUrl: getUpgradeUrl( state, 'plans-main-top' ),
		showRecommendations: showRecommendations( state ),
		showLicensingUi: showLicensingUi( state ),
		hasDetachedUserLicenses: !! getDetachedLicensesCount( state ),
	};
} )( MyPlanHeader );
