<?php
/**
 * Launchpad Helpers
 *
 * @package automattic/jetpack-mu-wpcom
 * @since 1.4.0
 */

/**
 * This file provides helpers that return the appropriate Launchpad
 * checklist and tasks for a given checklist id.
 *
 * @package automattic/jetpack-mu-wpcom
 * @since 1.4.0
 */

require_once __DIR__ . '/class-launchpad-task-lists.php';

/**
 * Registers all default launchpad checklists
 */
function register_default_checklists() {
	register_launchpad_task(
		array(
			'id'                   => 'setup_newsletter',
			'title'                => __( 'Personalize newsletter', 'jetpack-mu-wpcom' ),
			'is_complete_callback' => '__return_true',
		)
	);

	register_launchpad_task(
		array(
			'id'                   => 'plan_selected',
			'title'                => __( 'Choose a plan', 'jetpack-mu-wpcom' ),
			'subtitle'             => 'get_plan_selected_subtitle',
			'is_complete_callback' => '__return_true',
		)
	);

	register_launchpad_task(
		array(
			'id'                   => 'subscribers_added',
			'title'                => __( 'Add subscribers', 'jetpack-mu-wpcom' ),
			'is_complete_callback' => '__return_true',
		)
	);

	register_launchpad_task(
		array(
			'id'    => 'first_post_published',
			'title' => __( 'Write your first post', 'jetpack-mu-wpcom' ),
		)
	);

	register_launchpad_task(
		array(
			'id'     => 'first_post_published_newsletter',
			'title'  => __( 'Start writing', 'jetpack-mu-wpcom' ),
			'id_map' => 'first_post_published',
		)
	);

	register_launchpad_task(
		array(
			'id'                   => 'design_selected',
			'title'                => __( 'Select a design', 'jetpack-mu-wpcom' ),
			'is_complete_callback' => '__return_true',
			'is_disabled'          => 'is_design_step_enabled',
		)
	);

	register_launchpad_task(
		array(
			'id'                   => 'setup_link_in_bio',
			'title'                => __( 'Personalize Link in Bio', 'jetpack-mu-wpcom' ),
			'is_complete_callback' => '__return_true',
		)
	);

	register_launchpad_task(
		array(
			'id'     => 'links_added',
			'title'  => __( 'Add links', 'jetpack-mu-wpcom' ),
			'id_map' => 'links_edited',
		)
	);

	register_launchpad_task(
		array(
			'id'          => 'link_in_bio_launched',
			'title'       => __( 'Launch your site', 'jetpack-mu-wpcom' ),
			'id_map'      => 'site_launched',
			'is_disabled' => 'is_link_in_bio_launch_disabled',
		)
	);

	register_launchpad_task(
		array(
			'id'                   => 'videopress_setup',
			'title'                => __( 'Set up your video site', 'jetpack-mu-wpcom' ),
			'is_complete_callback' => '__return_true',
		)
	);

	register_launchpad_task(
		array(
			'id'          => 'videopress_upload',
			'title'       => __( 'Upload your first video', 'jetpack-mu-wpcom' ),
			'id_map'      => 'video_uploaded',
			'is_disabled' => 'is_videopress_upload_disabled',
		)
	);

	register_launchpad_task(
		array(
			'id'          => 'videopress_launched',
			'title'       => __( 'Launch site', 'jetpack-mu-wpcom' ),
			'id_map'      => 'site_launched',
			// todo figure this one out
			'is_disabled' => 'is_videopress_launch_disabled',
		)
	);

	register_launchpad_task(
		array(
			'id'                   => 'setup_free',
			'title'                => __( 'Personalize your site', 'jetpack-mu-wpcom' ),
			'is_complete_callback' => '__return_true',
		)
	);

	register_launchpad_task(
		array(
			'id'                   => 'setup_general',
			'title'                => __( 'Set up your site', 'jetpack-mu-wpcom' ),
			'is_complete_callback' => '__return_true',
			'is_disabled'          => '__return_true',
		)
	);

	register_launchpad_task(
		array(
			'id'     => 'design_edited',
			'title'  => __( 'Edit site design', 'jetpack-mu-wpcom' ),
			'id_map' => 'site_edited',
		)
	);

	register_launchpad_task(
		array(
			'id'           => 'site_launched',
			'title'        => __( 'Launch your site', 'jetpack-mu-wpcom' ),
			'isLaunchTask' => true,
		)
	);

	register_launchpad_task(
		array(
			'id'                   => 'setup_write',
			'title'                => __( 'Set up your site', 'jetpack-mu-wpcom' ),
			'is_complete_callback' => '__return_true',
			'disabled'             => true,
		)
	);

	register_launchpad_task(
		array(
			'id'                   => 'domain_upsell',
			'title'                => __( 'Choose a domain', 'jetpack-mu-wpcom' ),
			'is_complete_callback' => 'is_domain_upsell_completed',
			'badge_text'           => get_domain_upsell_badge_text(),
		)
	);

	register_launchpad_task(
		array(
			'id'          => 'verify_email',
			'title'       => __( 'Confirm email (check your inbox)', 'jetpack-mu-wpcom' ),
			'is_disabled' => '__return_true',
		)
	);

	// Tasks registered, now onto the checklists.
	register_launchpad_task_list(
		array(
			'id'       => 'build',
			'title'    => 'Build',
			'task_ids' => array(
				'setup_general',
				'design_selected',
				'first_post_published',
				'design_edited',
				'site_launched',
			),
		)
	);

	register_launchpad_task_list(
		array(
			'id'       => 'free',
			'title'    => 'Free',
			'task_ids' => array(
				'setup_free',
				'design_selected',
				'domain_upsell',
				'first_post_published',
				'design_edited',
				'site_launched',
			),
		)
	);

	register_launchpad_task_list(
		array(
			'id'       => 'link-in-bio',
			'title'    => 'Link In Bio',
			'task_ids' => array(
				'design_selected',
				'setup_link_in_bio',
				'plan_selected',
				'links_added',
				'link_in_bio_launched',
			),
		)
	);

	register_launchpad_task_list(
		array(
			'id'       => 'link-in-bio-tld',
			'title'    => 'Link In Bio',
			'task_ids' => array(
				'design_selected',
				'setup_link_in_bio',
				'plan_selected',
				'links_added',
				'link_in_bio_launched',
			),
		)
	);

	register_launchpad_task_list(
		array(
			'id'       => 'newsletter',
			'title'    => 'Newsletter',
			'task_ids' => array(
				'setup_newsletter',
				'plan_selected',
				'subscribers_added',
				'verify_email',
				'first_post_published_newsletter',
			),
		)
	);

	register_launchpad_task_list(
		array(
			'id'       => 'videopress',
			'title'    => 'Videopress',
			'task_ids' => array(
				'videopress_setup',
				'plan_selected',
				'videopress_upload',
				'videopress_launched',
			),
		)
	);

	register_launchpad_task_list(
		array(
			'id'       => 'write',
			'title'    => 'Write',
			'task_ids' => array(
				'setup_write',
				'design_selected',
				'first_post_published',
				'site_launched',
			),
		)
	);

	// This is the hook that allows other plugins to register their own checklists.
	do_action( 'wpcom_register_launchpad_tasks' );

	// Here we grab all of the tasks for the site's site_intent flow and see which are active and add their listener hooks
}
// Running on priority 11 will allow anything that adds hooks on init with default priority 10 to add their hooks to the `wpcom_register_launchpad_tasks` action.
add_action( 'init', 'register_default_checklists', 11 );

/**
 * Determines whether or not the videopress upload task is enabled
 *
 * @return boolean True if videopress upload task is enabled
 */
function is_videopress_upload_disabled() {
	return get_checklist_task( 'video_uploaded' );
}

/**
 * Determines whether or not the videopress launch task is enabled
 *
 * @return boolean True if videopress launch task is enabled
 */
function is_videopress_launch_disabled() {
	return ! get_checklist_task( 'video_uploaded' );
}

/**
 * Determines whether or not the link-in-bio launch task is enabled
 *
 * @return boolean True if link-in-bio launch task is enabled
 */
function is_link_in_bio_launch_disabled() {
	return ! get_checklist_task( 'links_edited' );
}

/**
 * Determines whether or not design selected task is enabled
 *
 * @return boolean True if design selected task is enabled
 */
function can_update_design_selected_task() {
	$site_intent = get_option( 'site_intent' );
	return $site_intent === 'free' || $site_intent === 'build' || $site_intent === 'write';
}

/**
 * Callback for design task enabled state
 *
 * @return boolean
 */
function is_design_step_enabled() {
	return ! can_update_design_selected_task();
}

/**
 * Determines whether or not domain upsell task is completed
 *
 * @return boolean True if domain upsell task is completed
 */
function is_domain_upsell_completed() {
	// Adding a 'false' bypass to this for now to unblock Jetpack release.
	// This was resulting in queries being run on too many requests to wpcom.
	// Slack context - p1682634633096559/1682634536.650749-slack-C0299DMPG
	if ( false && defined( 'IS_WPCOM' ) && IS_WPCOM ) {
		if ( class_exists( '\WPCOM_Store_API' ) ) {
			$plan = \WPCOM_Store_API::get_current_plan( \get_current_blog_id() );
			return ! $plan['is_free'] || get_checklist_task( 'domain_upsell_deferred' );
		}
	}

	return get_checklist_task( 'domain_upsell_deferred' );
}

/**
 * Returns the subtitle for the plan selected task
 *
 * @return string Subtitle text
 */
function get_plan_selected_subtitle() {
	if ( ! function_exists( 'wpcom_global_styles_in_use' ) || ! function_exists( 'wpcom_should_limit_global_styles' ) ) {
		return '';
	}

	return wpcom_global_styles_in_use() && wpcom_should_limit_global_styles()
		? __(
			'Your site contains custom colors that will only be visible once you upgrade to a Premium plan.',
			'jetpack-mu-wpcom'
		) : '';
}

/**
 * Returns the badge text for the plan selected task
 *
 * @return string Badge text
 */
function get_domain_upsell_badge_text() {
	return is_domain_upsell_completed() ? '' : __( 'Upgrade plan', 'jetpack-mu-wpcom' );
}

/**
 * Returns launchpad checklist task by task id.
 *
 * @param string $task Task id.
 *
 * @return array Associative array with task data
 *               or false if task id is not found.
 */
function get_checklist_task( $task ) {
	$launchpad_checklist_tasks_statuses_option = get_option( 'launchpad_checklist_tasks_statuses' );
	if ( is_array( $launchpad_checklist_tasks_statuses_option ) && isset( $launchpad_checklist_tasks_statuses_option[ $task ] ) ) {
			return $launchpad_checklist_tasks_statuses_option[ $task ];
	}

	return false;
}

/**
 * Returns launchpad checklist by checklist slug.
 *
 * @param string $checklist_slug Checklist slug.
 *
 * @return Task[] Collection of tasks for a given checklist
 */
function get_launchpad_checklist_by_checklist_slug( $checklist_slug ) {
	if ( ! $checklist_slug ) {
		return array();
	}

	return launchpad_checklists()->build( $checklist_slug );
}

// TODO: Write code p2 post or dotcom post
/**
 * Wrapper that registers a launchpad checklist.
 *
 * @param Task_List $task_list Task list definition.
 *
 * @return bool True if successful, false otherwise.
 */
function register_launchpad_task_list( $task_list ) {
	return launchpad_checklists()->register_task_list( $task_list );
}

/**
 * Wrapper that registers a launchpad checklist.
 *
 * @param Task $tasks Collection of Task definitions.
 *
 * @return bool True if successful, false otherwise.
 */
function register_launchpad_tasks( $tasks ) {
	return launchpad_checklists()->register_tasks( $tasks );
}

/**
 * Wrapper that registers a launchpad checklist.
 *
 * @param Task $task Task definition.
 *
 * @return bool True if successful, false otherwise.
 */
function register_launchpad_task( $task ) {
	return launchpad_checklists()->register_task( $task );
}

/**
 * Helper function to return a `Launchpad_Task_Lists` instance.
 *
 * @return object Launchpad_Task_Lists instance.
 */
function launchpad_checklists() {
	return Launchpad_Task_Lists::get_instance();
}
