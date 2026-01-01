<?php

namespace Hostinger\AiAssistant\Mcp\Rest;

use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use WP_Http;

if ( ! defined( 'ABSPATH' ) ) {
    die;
}

class ToggleMcp {
    public const MCP_SETUP_ACTION   = 'setup';
    public const MCP_DENY_ACTION    = 'deny';
    public const MCP_CONSENT_OPTION = 'hostinger_mcp_choice';
    public function init(): void {
        add_action( 'rest_api_init', array( $this, 'register_rest_routes' ) );
    }

    public function register_rest_routes(): void {
        register_rest_route(
            HOSTINGER_AI_ASSISTANT_REST_API_BASE,
            '/toggle-mcp-plugin',
            array(
                'methods'             => 'POST',
                'callback'            => array( $this, 'toggle_mcp_plugin' ),
                'permission_callback' => array( $this, 'permission_check' ),
                'args'                => array(
                    'action' => array(
                        'required'          => true,
                        'validate_callback' => function ( $param ) {
                            return in_array( $param, array( self::MCP_SETUP_ACTION, self::MCP_DENY_ACTION ), true );
                        },
                        'sanitize_callback' => 'sanitize_text_field',
                        'description'       => sprintf( 'The action to perform: %s or %s.', self::MCP_SETUP_ACTION, self::MCP_DENY_ACTION ),
                        'type'              => 'string',
                        'enum'              => array( self::MCP_SETUP_ACTION, self::MCP_DENY_ACTION ),
                    ),
                ),
            )
        );
    }

    public function toggle_mcp_plugin( WP_REST_Request $request ): WP_REST_Response {
        $action = $request->get_param( 'action' );

        if ( $action === self::MCP_SETUP_ACTION ) {
            return $this->setup_mcp_plugin();
        }

        return $this->deny_mcp_plugin();
    }

    public function setup_mcp_plugin(): WP_REST_Response {
        update_option( self::MCP_CONSENT_OPTION, 1 );

        return $this->create_success_response();
    }

    public function deny_mcp_plugin(): WP_REST_Response {
        update_option( self::MCP_CONSENT_OPTION, 0 );

        return $this->create_success_response();
    }

    public function permission_check(): bool {
        if ( has_action( 'litespeed_control_set_nocache' ) ) {
            do_action(
                'litespeed_control_set_nocache',
                'Custom Rest API endpoint, not cacheable.'
            );
        }

        return is_user_logged_in() && current_user_can( 'manage_options' );
    }

    private function create_success_response(): WP_REST_Response {
        $response = new WP_REST_Response();
        $response->set_headers( array( 'Cache-Control' => 'no-cache' ) );
        $response->set_status( WP_Http::OK );

        return rest_ensure_response( $response );
    }
}
