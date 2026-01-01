<?php
/**
 * Plugin Name: VC Careers Pro
 * Description: Complete career management with images
 * Version: 2.1
 * Author: Viral Cat
 */

if (!defined('ABSPATH')) exit;

// ==========================================
// 1. REGISTER POST TYPE WITH THUMBNAIL SUPPORT
// ==========================================
add_action('init', function() {
    register_post_type('careers', array(
        'labels' => array(
            'name' => 'Careers',
            'singular_name' => 'Career',
            'add_new' => 'Add New Position',
            'edit_item' => 'Edit Career',
            'featured_image' => 'Job Image',
            'set_featured_image' => 'Set job image',
            'remove_featured_image' => 'Remove job image'
        ),
        'public' => true,
        'show_in_rest' => true,
        'supports' => array('title', 'editor', 'thumbnail'), // ✅ Added thumbnail support
        'menu_icon' => 'dashicons-businessman'
    ));
});

// ==========================================
// 2. REST API ENDPOINT WITH IMAGE URL
// ==========================================
add_action('rest_api_init', function() {
    register_rest_route('viralcat/v1', '/careers', array(
        'methods' => 'GET',
        'callback' => function() {
            $careers = get_posts(array(
                'post_type' => 'careers',
                'posts_per_page' => -1,
                'post_status' => 'publish'
            ));
            
            $data = array();
            foreach ($careers as $career) {
                // ✅ Get featured image URL
                $image_id = get_post_thumbnail_id($career->ID);
                $image_url = $image_id ? wp_get_attachment_image_url($image_id, 'large') : '';
                
                $data[] = array(
                    'id' => $career->ID,
                    'title' => $career->post_title,
                    'description' => wp_trim_words($career->post_content, 30),
                    'full_description' => $career->post_content,
                    'image' => $image_url, // ✅ Image URL added
                    'location' => get_post_meta($career->ID, '_career_location', true) ?: 'Thrissur, Kerala',
                    'type' => get_post_meta($career->ID, '_career_type', true) ?: 'Full-Time',
                    'experience' => get_post_meta($career->ID, '_career_experience', true),
                    'salary' => get_post_meta($career->ID, '_career_salary', true),
                    'openings' => get_post_meta($career->ID, '_career_openings', true),
                    'department' => get_post_meta($career->ID, '_career_department', true),
                    'skills' => get_post_meta($career->ID, '_career_skills', true),
                    'benefits' => get_post_meta($career->ID, '_career_benefits', true)
                );
            }
            
            return rest_ensure_response($data);
        },
        'permission_callback' => '__return_true'
    ));
});

// ==========================================
// 3. META BOXES (ADMIN INTERFACE)
// ==========================================
add_action('add_meta_boxes', function() {
    add_meta_box('vc_career_details', 'Job Details', function($post) {
        wp_nonce_field('vc_career_save', 'vc_career_nonce');
        
        $location = get_post_meta($post->ID, '_career_location', true);
        $type = get_post_meta($post->ID, '_career_type', true);
        $experience = get_post_meta($post->ID, '_career_experience', true);
        $salary = get_post_meta($post->ID, '_career_salary', true);
        $openings = get_post_meta($post->ID, '_career_openings', true);
        $department = get_post_meta($post->ID, '_career_department', true);
        $skills = get_post_meta($post->ID, '_career_skills', true);
        $benefits = get_post_meta($post->ID, '_career_benefits', true);
        ?>
        <table class="form-table">
            <tr>
                <th><label>Location *</label></th>
                <td><input type="text" name="career_location" value="<?php echo esc_attr($location); ?>" style="width:100%;" placeholder="Thrissur, Kerala"></td>
            </tr>
            <tr>
                <th><label>Job Type *</label></th>
                <td>
                    <select name="career_type" style="width:100%;">
                        <option value="Full-Time" <?php selected($type, 'Full-Time'); ?>>Full-Time</option>
                        <option value="Part-Time" <?php selected($type, 'Part-Time'); ?>>Part-Time</option>
                        <option value="Contract" <?php selected($type, 'Contract'); ?>>Contract</option>
                        <option value="Remote" <?php selected($type, 'Remote'); ?>>Remote</option>
                    </select>
                </td>
            </tr>
            <tr>
                <th><label>Experience Required</label></th>
                <td><input type="text" name="career_experience" value="<?php echo esc_attr($experience); ?>" style="width:100%;" placeholder="e.g., 2-4 years"></td>
            </tr>
            <tr>
                <th><label>Salary Range</label></th>
                <td><input type="text" name="career_salary" value="<?php echo esc_attr($salary); ?>" style="width:100%;" placeholder="e.g., ₹3-5 LPA"></td>
            </tr>
            <tr>
                <th><label>Number of Openings</label></th>
                <td><input type="number" name="career_openings" value="<?php echo esc_attr($openings); ?>" style="width:100%;"></td>
            </tr>
            <tr>
                <th><label>Department</label></th>
                <td><input type="text" name="career_department" value="<?php echo esc_attr($department); ?>" style="width:100%;" placeholder="e.g., Marketing, Development"></td>
            </tr>
            <tr>
                <th><label>Required Skills</label></th>
                <td><textarea name="career_skills" rows="3" style="width:100%;" placeholder="HTML, CSS, JavaScript, React"><?php echo esc_textarea($skills); ?></textarea></td>
            </tr>
            <tr>
                <th><label>Benefits</label></th>
                <td><textarea name="career_benefits" rows="3" style="width:100%;" placeholder="Health insurance, Flexible hours, Remote work"><?php echo esc_textarea($benefits); ?></textarea></td>
            </tr>
        </table>
        <p style="margin-top: 20px; padding: 15px; background: #f0f8ff; border-left: 4px solid #2196F3;">
            <strong>💡 Tip:</strong> Set a <strong>Featured Image</strong> in the right sidebar to display a job photo on the career page!
        </p>
        <?php
    }, 'careers', 'normal', 'high');
});

// ==========================================
// 4. SAVE META DATA
// ==========================================
add_action('save_post_careers', function($post_id) {
    if (!isset($_POST['vc_career_nonce']) || !wp_verify_nonce($_POST['vc_career_nonce'], 'vc_career_save')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    
    $fields = array('location', 'type', 'experience', 'salary', 'openings', 'department', 'skills', 'benefits');
    
    foreach ($fields as $field) {
        if (isset($_POST['career_' . $field])) {
            update_post_meta($post_id, '_career_' . $field, sanitize_text_field($_POST['career_' . $field]));
        }
    }
});