<?php
/**
 * Twenty Twenty-Five functions and definitions.
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package WordPress
 * @subpackage Twenty_Twenty_Five
 * @since Twenty Twenty-Five 1.0
 */

// Adds theme support for post formats.
if ( ! function_exists( 'twentytwentyfive_post_format_setup' ) ) :
	/**
	 * Adds theme support for post formats.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_post_format_setup() {
		add_theme_support( 'post-formats', array( 'aside', 'audio', 'chat', 'gallery', 'image', 'link', 'quote', 'status', 'video' ) );
	}
endif;
add_action( 'after_setup_theme', 'twentytwentyfive_post_format_setup' );

// Enqueues editor-style.css in the editors.
if ( ! function_exists( 'twentytwentyfive_editor_style' ) ) :
	/**
	 * Enqueues editor-style.css in the editors.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_editor_style() {
		add_editor_style( get_parent_theme_file_uri( 'assets/css/editor-style.css' ) );
	}
endif;
add_action( 'after_setup_theme', 'twentytwentyfive_editor_style' );

// Enqueues style.css on the front.
if ( ! function_exists( 'twentytwentyfive_enqueue_styles' ) ) :
	/**
	 * Enqueues style.css on the front.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_enqueue_styles() {
		wp_enqueue_style(
			'twentytwentyfive-style',
			get_parent_theme_file_uri( 'style.css' ),
			array(),
			wp_get_theme()->get( 'Version' )
		);
	}
endif;
add_action( 'wp_enqueue_scripts', 'twentytwentyfive_enqueue_styles' );

// Registers custom block styles.
if ( ! function_exists( 'twentytwentyfive_block_styles' ) ) :
	/**
	 * Registers custom block styles.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_block_styles() {
		register_block_style(
			'core/list',
			array(
				'name'         => 'checkmark-list',
				'label'        => __( 'Checkmark', 'twentytwentyfive' ),
				'inline_style' => '
				ul.is-style-checkmark-list {
					list-style-type: "\2713";
				}

				ul.is-style-checkmark-list li {
					padding-inline-start: 1ch;
				}',
			)
		);
	}
endif;
add_action( 'init', 'twentytwentyfive_block_styles' );

// Registers pattern categories.
if ( ! function_exists( 'twentytwentyfive_pattern_categories' ) ) :
	/**
	 * Registers pattern categories.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_pattern_categories() {

		register_block_pattern_category(
			'twentytwentyfive_page',
			array(
				'label'       => __( 'Pages', 'twentytwentyfive' ),
				'description' => __( 'A collection of full page layouts.', 'twentytwentyfive' ),
			)
		);

		register_block_pattern_category(
			'twentytwentyfive_post-format',
			array(
				'label'       => __( 'Post formats', 'twentytwentyfive' ),
				'description' => __( 'A collection of post format patterns.', 'twentytwentyfive' ),
			)
		);
	}
endif;
add_action( 'init', 'twentytwentyfive_pattern_categories' );

// Registers block binding sources.
if ( ! function_exists( 'twentytwentyfive_register_block_bindings' ) ) :
	/**
	 * Registers the post format block binding source.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_register_block_bindings() {
		register_block_bindings_source(
			'twentytwentyfive/format',
			array(
				'label'              => _x( 'Post format name', 'Label for the block binding placeholder in the editor', 'twentytwentyfive' ),
				'get_value_callback' => 'twentytwentyfive_format_binding',
			)
		);
	}
endif;
add_action( 'init', 'twentytwentyfive_register_block_bindings' );

// Registers block binding callback function for the post format name.
if ( ! function_exists( 'twentytwentyfive_format_binding' ) ) :
	/**
	 * Callback function for the post format name block binding source.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return string|void Post format name, or nothing if the format is 'standard'.
	 */
	function twentytwentyfive_format_binding() {
		$post_format_slug = get_post_format();

		if ( $post_format_slug && 'standard' !== $post_format_slug ) {
			return get_post_format_string( $post_format_slug );
		}
	}
endif;

// function custom_3d_model_script() {
//     if (is_front_page()) {  // Only load on the homepage
//         // wp_enqueue_script('three-js', 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', array(), null, true);
// 		wp_enqueue_script(
// 			'three-js', // Handle for the script
// 			'https://cdnjs.cloudflare.com/ajax/libs/three.js/r126/three.min.js', // URL of the script
// 			array(), // No dependencies
// 			'null', // Version of the script
// 			true // Load the script in the footer (set to true if you want it in the header)
// 		);
// 		wp_enqueue_script('glb-loader', 'https://unpkg.com/three@0.126.0/examples/js/loaders/GLTFLoader.js', array(), null, true);
//         wp_enqueue_script('3d-model-js', get_template_directory_uri() . '/assets/js/3d-model.js', array('three-js', 'glb-loader'), null, true);
//     }
// }
// add_action('wp_enqueue_scripts', 'custom_3d_model_script');

// function enqueue_threejs_scripts() {
//     // Load Three.js from a CDN
//     wp_enqueue_script('three-js', 'https://cdn.jsdelivr.net/npm/three@latest/build/three.min.js', array(), null, true);

//     // Load the GLTFLoader, EffectComposer, RenderPass, and UnrealBloomPass from a CDN
//     wp_enqueue_script('three-gltfloader', 'https://cdn.jsdelivr.net/npm/three@latest/examples/js/loaders/GLTFLoader.js', array('three-js'), null, true);
//     wp_enqueue_script('three-effectcomposer', 'https://cdn.jsdelivr.net/npm/three@latest/examples/js/postprocessing/EffectComposer.js', array('three-js'), null, true);
//     wp_enqueue_script('three-renderpass', 'https://cdn.jsdelivr.net/npm/three@latest/examples/js/postprocessing/RenderPass.js', array('three-js'), null, true);
//     wp_enqueue_script('three-unrealbloompass', 'https://cdn.jsdelivr.net/npm/three@latest/examples/js/postprocessing/UnrealBloomPass.js', array('three-js'), null, true);

//     // Load your 3D model script
//     wp_enqueue_script('3d-model-js', get_template_directory_uri() . '/assets/js/3d-model.js', array('three-js', 'three-gltfloader', 'three-effectcomposer', 'three-renderpass', 'three-unrealbloompass'), null, true);
// }
// add_action('wp_enqueue_scripts', 'enqueue_threejs_scripts');

// function enqueue_threejs_scripts() {
//     // Load Three.js from a CDN
//     wp_enqueue_script('three-js', 'https://cdn.jsdelivr.net/npm/three@latest/build/three.min.js', array(), null, true);

//     // Load the GLTFLoader, EffectComposer, RenderPass, and UnrealBloomPass from a CDN
//     wp_enqueue_script('three-gltfloader', 'https://cdn.jsdelivr.net/npm/three@latest/examples/js/loaders/GLTFLoader.js', array('three-js'), null, true);
//     wp_enqueue_script('three-effectcomposer', 'https://cdn.jsdelivr.net/npm/three@latest/examples/js/postprocessing/EffectComposer.js', array('three-js'), null, true);
//     wp_enqueue_script('three-renderpass', 'https://cdn.jsdelivr.net/npm/three@latest/examples/js/postprocessing/RenderPass.js', array('three-js'), null, true);
//     wp_enqueue_script('three-unrealbloompass', 'https://cdn.jsdelivr.net/npm/three@latest/examples/js/postprocessing/UnrealBloomPass.js', array('three-js'), null, true);
//     wp_enqueue_script('three-copyshader', 'https://cdn.jsdelivr.net/npm/three@latest/examples/js/shaders/CopyShader.js', array('three-js'), null, true);

//     // Load your 3D model script
//     wp_enqueue_script('3d-model-js', get_template_directory_uri() . '/assets/js/3d-model.js', array('three-js', 'three-gltfloader', 'three-effectcomposer', 'three-renderpass', 'three-unrealbloompass', 'three-copyshader'), null, true);
// }
// add_action('wp_enqueue_scripts', 'enqueue_threejs_scripts');
// function enqueue_threejs_scripts() {
//     // Load Three.js from a CDN
//     wp_enqueue_script('three-js', 'https://cdn.jsdelivr.net/npm/three@latest/build/three.min.js', array(), null, true);

//     // Load the GLTFLoader, EffectComposer, RenderPass, UnrealBloomPass, ShaderPass, and CopyShader from a CDN
//     wp_enqueue_script('three-gltfloader', 'https://cdn.jsdelivr.net/npm/three@latest/examples/js/loaders/GLTFLoader.js', array('three-js'), null, true);
//     wp_enqueue_script('three-effectcomposer', 'https://cdn.jsdelivr.net/npm/three@latest/examples/js/postprocessing/EffectComposer.js', array('three-js'), null, true);
//     wp_enqueue_script('three-renderpass', 'https://cdn.jsdelivr.net/npm/three@latest/examples/js/postprocessing/RenderPass.js', array('three-js'), null, true);
//     wp_enqueue_script('three-unrealbloompass', 'https://cdn.jsdelivr.net/npm/three@latest/examples/js/postprocessing/UnrealBloomPass.js', array('three-js'), null, true);
//     wp_enqueue_script('three-shaderpass', 'https://cdn.jsdelivr.net/npm/three@latest/examples/js/postprocessing/ShaderPass.js', array('three-js'), null, true);
//     wp_enqueue_script('three-copyshader', 'https://cdn.jsdelivr.net/npm/three@latest/examples/js/shaders/CopyShader.js', array('three-js'), null, true);

//     // Load your 3D model script
//     wp_enqueue_script('3d-model-js', get_template_directory_uri() . '/assets/js/3d-model.js', array('three-js', 'three-gltfloader', 'three-effectcomposer', 'three-renderpass', 'three-unrealbloompass', 'three-shaderpass', 'three-copyshader'), null, true);
// }
// add_action('wp_enqueue_scripts', 'enqueue_threejs_scripts');

function enqueue_threejs_scripts() {
    // Load Three.js from a CDN
    wp_enqueue_script('three-js', 'https://cdn.jsdelivr.net/npm/three@latest/build/three.min.js', array(), null, true);

    // Load the GLTFLoader, EffectComposer, RenderPass, UnrealBloomPass, ShaderPass, CopyShader, and LuminosityHighPassShader from a CDN
    wp_enqueue_script('three-gltfloader', 'https://cdn.jsdelivr.net/npm/three@latest/examples/js/loaders/GLTFLoader.js', array('three-js'), null, true);
    wp_enqueue_script('three-effectcomposer', 'https://cdn.jsdelivr.net/npm/three@latest/examples/js/postprocessing/EffectComposer.js', array('three-js'), null, true);
    wp_enqueue_script('three-renderpass', 'https://cdn.jsdelivr.net/npm/three@latest/examples/js/postprocessing/RenderPass.js', array('three-js'), null, true);
    wp_enqueue_script('three-unrealbloompass', 'https://cdn.jsdelivr.net/npm/three@latest/examples/js/postprocessing/UnrealBloomPass.js', array('three-js'), null, true);
    wp_enqueue_script('three-shaderpass', 'https://cdn.jsdelivr.net/npm/three@latest/examples/js/postprocessing/ShaderPass.js', array('three-js'), null, true);
    wp_enqueue_script('three-copyshader', 'https://cdn.jsdelivr.net/npm/three@latest/examples/js/shaders/CopyShader.js', array('three-js'), null, true);
    wp_enqueue_script('three-luminosityhighpassshader', 'https://cdn.jsdelivr.net/npm/three@latest/examples/js/shaders/LuminosityHighPassShader.js', array('three-js'), null, true);

    // Load your 3D model script
    wp_enqueue_script('3d-model-js', get_template_directory_uri() . '/assets/js/3d-model.js', array('three-js', 'three-gltfloader', 'three-effectcomposer', 'three-renderpass', 'three-unrealbloompass', 'three-shaderpass', 'three-copyshader', 'three-luminosityhighpassshader'), null, true);
}
add_action('wp_enqueue_scripts', 'enqueue_threejs_scripts');
