import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { Path } from '@wordpress/components';
import { __, _x } from '@wordpress/i18n';
import './editor.scss';
import { getIconColor } from '../../shared/block-icons';
import renderMaterialIcon from '../../shared/render-material-icon';
import defaultAttributes from './attributes';
import deprecated from './deprecated';
import edit from './edit';
import transforms from './transforms';
import variations from './variations';

export const name = 'contact-form';

const icon = renderMaterialIcon(
	<>
		<Path fillRule="evenodd" clipRule="evenodd" d="M18 9H13V7.5H18V9Z" fill={ getIconColor() } />
		<Path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M18 16.5H13V15H18V16.5Z"
			fill={ getIconColor() }
		/>
		<Path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M9.5 7.5H7.5V9.5H9.5V7.5ZM7.5 6H9.5C10.3284 6 11 6.67157 11 7.5V9.5C11 10.3284 10.3284 11 9.5 11H7.5C6.67157 11 6 10.3284 6 9.5V7.5C6 6.67157 6.67157 6 7.5 6Z"
			fill={ getIconColor() }
		/>
		<Path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M9.5 14.5H7.5V16.5H9.5V14.5ZM7.5 13H9.5C10.3284 13 11 13.6716 11 14.5V16.5C11 17.3284 10.3284 18 9.5 18H7.5C6.67157 18 6 17.3284 6 16.5V14.5C6 13.6716 6.67157 13 7.5 13Z"
			fill={ getIconColor() }
		/>
		<Path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M19 4.5H5C4.72386 4.5 4.5 4.72386 4.5 5V19C4.5 19.2761 4.72386 19.5 5 19.5H19C19.2761 19.5 19.5 19.2761 19.5 19V5C19.5 4.72386 19.2761 4.5 19 4.5ZM5 3C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5Z"
			fill={ getIconColor() }
		/>
	</>
);

export const settings = {
	title: __( 'Form', 'jetpack' ),
	description: __(
		'Create forms to collect data from site visitors and manage their responses.',
		'jetpack'
	),
	icon,
	keywords: [
		_x( 'email', 'block search term', 'jetpack' ),
		_x( 'feedback', 'block search term', 'jetpack' ),
		_x( 'contact form', 'block search term', 'jetpack' ),
	],
	supports: {
		color: {
			link: true,
			gradients: true,
		},
		html: false,
		spacing: {
			padding: true,
			margin: true,
		},
		align: [ 'wide', 'full' ],
	},
	attributes: defaultAttributes,
	edit,
	save: () => {
		const blockProps = useBlockProps.save();
		return (
			<div { ...blockProps }>
				<InnerBlocks.Content />
			</div>
		);
	},
	variations,
	category: 'contact-form',
	transforms,
	deprecated,
};
