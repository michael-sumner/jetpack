/**
 * External dependencies
 */
import { InspectorControls } from '@wordpress/block-editor';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useEffect } from '@wordpress/element';
/**
 * Internal dependencies
 */
import { isExtensionEnabled } from '../../extensions';
import { useSyncMedia } from '../../hooks/use-video-data-update';
import DetailsControl from './components/details-control';
import { VIDEO_CHAPTERS_EXTENSION_NAME } from '.';

const withVideoChaptersEdit = createHigherOrderComponent(
	BlockEdit => props => {
		const { attributes, setAttributes } = props;
		const { isRequestingVideoData } = useSyncMedia( attributes, setAttributes, [
			'title',
			'description',
			'videoChaptersClientId',
		] );
		const isVideoChaptersEnabled = isExtensionEnabled( VIDEO_CHAPTERS_EXTENSION_NAME );

		if ( ! isVideoChaptersEnabled ) {
			return <BlockEdit { ...props } />;
		}

		if ( ! props.name === 'videopress/video' || ! props.attributes?.guid ) {
			return <BlockEdit { ...props } />;
		}

		// Set a permanent client id.
		useEffect( () => {
			if ( attributes.linkClientId ) {
				return;
			}

			setAttributes( { linkClientId: props.clientId } );
		}, [ props.clientId, attributes.linkClientId ] );

		return (
			<>
				<InspectorControls>
					<DetailsControl
						isRequestingVideoData={ isRequestingVideoData }
						attributes={ props.attributes }
						setAttributes={ props.setAttributes }
						clientId={ props.clientId }
					/>
				</InspectorControls>

				<BlockEdit { ...props } />
			</>
		);
	},
	'withVideoChaptersEdit'
);

export default withVideoChaptersEdit;
