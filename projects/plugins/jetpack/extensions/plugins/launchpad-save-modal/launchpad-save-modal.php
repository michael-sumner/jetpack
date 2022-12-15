<?php
/**
 * Launchpad Save Modal
 *
 * @package automattic/jetpack
 */

// Feature name.
const EXTENSION_SLUG = 'launchpad-save-modal';

function enque_script() {
	wp_enqueue_script(
		'launchpad-save-modal',
		plugins_url( 'index.js', __FILE__ ),
		array(),
		JETPACK__VERSION,
		true
	);

	wp_add_inline_script(
		'launchpad-save-modal',
		'const launchpadModalOptions = ' . wp_json_encode(
			array(
				'launchpadScreenOption' => get_option( 'launchpad_screen' ),
				'siteUrlOption'         => get_option( 'siteurl' ),
				'siteIntentOption'      => get_option( 'site_intent' ),
			)
		),
		'before'
	);
}

add_action( 'enqueue_block_editor_assets', 'enque_script' );

// Populate the available extensions with launchpad-save-modal.
add_filter(
	'jetpack_set_available_extensions',
	function ( $extensions ) {
		return array_merge(
			$extensions,
			array(
				EXTENSION_SLUG,
			)
		);
	}
);

// Set the launchpad-save-modal availability, depending on the site plan.
add_action(
	'jetpack_register_gutenberg_extensions',
	function () {
		\Jetpack_Gutenberg::set_extension_available( EXTENSION_SLUG );
	}
);
