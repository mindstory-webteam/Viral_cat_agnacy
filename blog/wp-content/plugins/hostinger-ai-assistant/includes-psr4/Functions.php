<?php

namespace Hostinger\AiAssistant;

use Hostinger\AiAssistant\Mcp\Rest\ToggleMcp;

class Functions {
    public static function is_mcp_enabled(): bool {
        return (int) get_option( ToggleMcp::MCP_CONSENT_OPTION, 0 ) === 1;
    }

    public static function log_event( string $message ): void {
        if ( defined( 'WP_DEBUG' ) && WP_DEBUG === true ) {
            error_log( 'Hostinger AI Assistant Log: ' . $message );
        }
    }
}
