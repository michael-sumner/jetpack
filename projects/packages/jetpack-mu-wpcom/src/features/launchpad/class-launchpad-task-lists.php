<?php
/**
 * Launchpad Task Lists Registry
 *
 * @package automattic/jetpack-mu-wpcom
 * @since 1.5.0
 */

/**
 * Launchpad Task List
 *
 * This file provides a Launchpad Task List class that manages the current list
 * of Launchpad checklists that are available to be used.
 *
 * @package automattic/jetpack-mu-wpcom
 */
class Launchpad_Task_Lists {
	/**
	 * Internal storage for registered Launchpad Task Lists
	 *
	 * @var Task_List[]
	 */
	private $task_list_registry = array();

	/**
	 * Internal storage for registered Launchpad Task Lists
	 *
	 * @var Task[]
	 */
	private $task_registry = array();

	/**
	 * Singleton instance
	 *
	 * @var Launchpad_Task_List
	 */
	private static $instance = null;

	/**
	 * Get the singleton instance
	 *
	 * @return Launchpad_Task_Lists
	 */
	public static function get_instance() {
		if ( ! self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Register a new Launchpad Task List
	 *
	 * @param Task_List $task_list Task List definition.
	 *
	 * @return bool True if successfully registered, false if not.
	 */
	public function register_task_list( $task_list = array() ) {
		if ( ! $this->validate_task_list( $task_list ) ) {
			return false;
		}

		$this->task_list_registry[ $task_list['id'] ] = $task_list;
		return true;
	}

	/**
	 * Register a new Launchpad Task
	 *
	 * @param Task $task Task definition.
	 *
	 * @return bool True if successful, false if not.
	 */
	public function register_task( $task = array() ) {
		if ( ! $this->validate_task( $task ) ) {
			return false;
		}
		// TODO: Handle duplicate tasks
		$this->task_registry[ $task['id'] ] = $task;
		return true;
	}

	/**
	 * Register a new Launchpad Task
	 *
	 * @param Task[] $tasks Collection of task definitions.
	 *
	 * @return bool True if successful, false if not.
	 */
	public function register_tasks( $tasks = array() ) {
		$tasks_to_register = array();

		foreach ( $tasks as $task ) {
			// Register none of the tasks if any are invalid.
			if ( ! $this->validate_task( $task ) ) {
				return false;
			}

			$tasks_to_register[ $task['id'] ] = $task;
		}

		// TODO: Handle duplicate tasks
		$this->task_registry = array_merge( $this->task_registry, $tasks_to_register );
		return true;
	}

	/**
	 * Unregister a Launchpad Task List
	 *
	 * @param string $id Task List id.
	 *
	 * @return bool True if successfully unregistered, false if not found.
	 */
	public function unregister_task_list( $id ) {
		if ( ! array_key_exists( $id, $this->task_list_registry ) ) {
			return false;
		}

		unset( $this->task_list_registry[ $id ] );
		return true;
	}

	/**
	 * Unregister a Launchpad Task
	 *
	 * @param string $id Task id.
	 *
	 * @return bool True if successful, false if not.
	 */
	public function unregister_task( $id ) {
		if ( ! array_key_exists( $id, $this->task_registry ) ) {
			return false;
		}

		unset( $this->task_registry[ $id ] );
		return true;
	}

	/**
	 * Get a Launchpad Task List definition
	 *
	 * @param string $id Task List id.
	 *
	 * @return Task_List Task List.
	 */
	protected function get_task_list( $id ) {
		if ( ! array_key_exists( $id, $this->task_list_registry ) ) {
			return array();
		}

		return $this->task_list_registry[ $id ];
	}

	/**
	 * Get a Launchpad Task definition
	 *
	 * @param string $id Task id.
	 *
	 * @return Task Task.
	 */
	protected function get_task( $id ) {
		if ( ! array_key_exists( $id, $this->task_registry ) ) {
			return array();
		}

		return $this->task_registry[ $id ];
	}

	/**
	 * Builds a collection of tasks for a given task list
	 *
	 * @param string $id Task list id.
	 *
	 * @return Task[] Collection of tasks associated with a task list.
	 */
	public function build( $id ) {
		$task_list           = $this->get_task_list( $id );
		$tasks_for_task_list = array();

		// Takes a registered task list, looks at its associated task ids,
		// and returns a collection of associated tasks.
		foreach ( $task_list['task_ids'] as $task_id ) {
			$task = $this->get_task( $task_id );

			// if task can't be found don't add anything
			if ( ! empty( $task ) ) {
				$tasks_for_task_list[] = $this->build_task( $task );
			}
		}

		return $tasks_for_task_list;
	}

	/**
	 * Builds a single task with current state
	 *
	 * @param Task $task Task definition.
	 * @return Task Task with current state.
	 */
	private function build_task( $task ) {
		$built_task                 = array(
			'id'    => $task['id'],
			'title' => $task['title'],
		);
		$built_task['completed']    = $this->is_task_complete( $task );
		$built_task['disabled']     = $this->is_task_disabled( $task );
		$built_task['subtitle']     = $this->load_subtitle( $task );
		$built_task['isLaunchTask'] = isset( $task['isLaunchTask'] ) ? $task['isLaunchTask'] : false;
		$built_task['badge_text']   = isset( $task['badge_text'] ) ? $task['badge_text'] : '';
		return $built_task;
	}

	/**
	 * Loads a subtitle for a task, calling the callback if it exists.
	 *
	 * @param Task $task A task definition.
	 * @return string The subtitle for the task.
	 */
	private function load_subtitle( $task ) {
		if ( isset( $task['subtitle'] ) ) {
			if ( is_callable( $task['subtitle'] ) ) {
				return call_user_func( $task['subtitle'] );
			}
			return $task['subtitle'];
		}
		return '';
	}

	/**
	 * Checks if a task is disabled
	 *
	 * @param array $task Task definition.
	 * @return boolean
	 */
	public function is_task_disabled( $task ) {
		if ( isset( $task['is_disabled'] ) && is_callable( $task['is_disabled'] ) ) {
			return call_user_func( $task['is_disabled'] );
		}
		return false;
	}

	/**
	 * Checks if a task is complete, relying on task-defined callbacks if available
	 *
	 * @param Task $task Task definition.
	 * @return boolean
	 */
	public function is_task_complete( $task ) {
		if ( isset( $task['is_complete_callback'] ) && is_callable( $task['is_complete_callback'] ) ) {
			return call_user_func( $task['is_complete_callback'] );
		}
		$statuses = get_option( 'launchpad_checklist_tasks_statuses', array() );
		$key      = isset( $task['id_map'] ) ? $task['id_map'] : $task['id'];
		return isset( $statuses[ $key ] ) ? $statuses[ $key ] : false;
	}

	/**
	 * Validate a Launchpad Task List
	 *
	 * @param Task_List $task_list Task List.
	 *
	 * @return bool True if valid, false if not.
	 */
	public static function validate_task_list( $task_list ) {
		if ( ! is_array( $task_list ) ) {
			return false;
		}

		if ( ! isset( $task_list['id'] ) ) {
			_doing_it_wrong( 'validate_task_list', 'The Launchpad task list being registered requires a "id" attribute', '6.1' );
			return false;
		}

		if ( ! isset( $task_list['task_ids'] ) ) {
			_doing_it_wrong( 'validate_task_list', 'The Launchpad task list being registered requires a "task_ids" attribute', '6.1' );
			return false;
		}

		return true;
	}

	/**
	 * Validate a Launchpad Task
	 *
	 * @param Task $task Task.
	 *
	 * @return bool True if valid, false if not.
	 */
	public static function validate_task( $task ) {
		if ( ! is_array( $task ) ) {
			return false;
		}

		if ( ! isset( $task['id'] ) ) {
			_doing_it_wrong( 'validate_task', 'The Launchpad task being registered requires a "id" attribute', '6.1' );
			return false;
		}

		if ( ! isset( $task['title'] ) ) {
			_doing_it_wrong( 'validate_task', 'The Launchpad task being registered requires a "title" attribute', '6.1' );
			return false;
		}

		return true;
	}

}
