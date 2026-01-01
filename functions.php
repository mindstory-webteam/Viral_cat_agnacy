<?php
/**
 * Viral Cat Career Management
 */

// Register Careers Post Type
function vc_register_careers() {
    register_post_type('careers', array(
        'labels' => array(
            'name' => 'Careers',
            'singular_name' => 'Career'
        ),
        'public' => true,
        'show_in_rest' => true,
        'supports' => array('title', 'editor'),
        'menu_icon' => 'dashicons-businessman'
    ));
}
add_action('init', 'vc_register_careers');

// Register REST API Endpoint
function vc_register_api() {
    register_rest_route('viralcat/v1', '/careers', array(
        'methods' => 'GET',
        'callback' => 'vc_get_careers',
        'permission_callback' => '__return_true'
    ));
}
add_action('rest_api_init', 'vc_register_api');

// API Callback Function
function vc_get_careers() {
    $careers = get_posts(array(
        'post_type' => 'careers',
        'posts_per_page' => -1,
        'post_status' => 'publish'
    ));
    
    $data = array();
    foreach ($careers as $career) {
        $data[] = array(
            'id' => $career->ID,
            'title' => $career->post_title,
            'location' => get_post_meta($career->ID, '_career_location', true) ?: 'Thrissur, Kerala',
            'type' => get_post_meta($career->ID, '_career_type', true) ?: 'Full-Time',
            'experience' => get_post_meta($career->ID, '_career_experience', true),
            'openings' => get_post_meta($career->ID, '_career_openings', true)
        );
    }
    
    return rest_ensure_response($data);
}

// Add Meta Boxes
function vc_add_meta_boxes() {
    add_meta_box('career_details', 'Job Details', 'vc_meta_box_callback', 'careers', 'normal', 'high');
}
add_action('add_meta_boxes', 'vc_add_meta_boxes');

function vc_meta_box_callback($post) {
    wp_nonce_field('vc_save_meta', 'vc_meta_nonce');
    $experience = get_post_meta($post->ID, '_career_experience', true);
    $location = get_post_meta($post->ID, '_career_location', true);
    $type = get_post_meta($post->ID, '_career_type', true);
    $openings = get_post_meta($post->ID, '_career_openings', true);
    ?>
    <p>
        <label>Experience:</label><br>
        <input type="text" name="career_experience" value="<?php echo esc_attr($experience); ?>" style="width:100%;">
    </p>
    <p>
        <label>Location:</label><br>
        <input type="text" name="career_location" value="<?php echo esc_attr($location); ?>" style="width:100%;">
    </p>
    <p>
        <label>Job Type:</label><br>
        <select name="career_type" style="width:100%;">
            <option value="Full-Time" <?php selected($type, 'Full-Time'); ?>>Full-Time</option>
            <option value="Part-Time" <?php selected($type, 'Part-Time'); ?>>Part-Time</option>
            <option value="Remote" <?php selected($type, 'Remote'); ?>>Remote</option>
        </select>
    </p>
    <p>
        <label>Openings:</label><br>
        <input type="number" name="career_openings" value="<?php echo esc_attr($openings); ?>" style="width:100%;">
    </p>
    <?php
}

// Save Meta Data
function vc_save_meta($post_id) {
    if (!isset($_POST['vc_meta_nonce']) || !wp_verify_nonce($_POST['vc_meta_nonce'], 'vc_save_meta')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    
    if (isset($_POST['career_experience'])) update_post_meta($post_id, '_career_experience', sanitize_text_field($_POST['career_experience']));
    if (isset($_POST['career_location'])) update_post_meta($post_id, '_career_location', sanitize_text_field($_POST['career_location']));
    if (isset($_POST['career_type'])) update_post_meta($post_id, '_career_type', sanitize_text_field($_POST['career_type']));
    if (isset($_POST['career_openings'])) update_post_meta($post_id, '_career_openings', sanitize_text_field($_POST['career_openings']));
}
add_action('save_post_careers', 'vc_save_meta');
?>
