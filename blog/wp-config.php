<?php
define( 'WP_CACHE', true );

/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * Localized language
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'u458029371_5QZ0G' );

/** Database username */
define( 'DB_USER', 'u458029371_i1wRK' );

/** Database password */
define( 'DB_PASSWORD', 'vKaHl0dseB' );

/** Database hostname */
define( 'DB_HOST', '127.0.0.1' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',          ':)z>u}22uY))}%!^m,.e(-XrU8(=2p(63V{G86K!GI_iyt!)MB)9I!KX[lmD^>DZ' );
define( 'SECURE_AUTH_KEY',   'P/C<nR`v$?:@O1w.>c3VI|Y2p.h3$kHYOHC@OB#gCH[+HY{mm0Ht%DR/-e}/C.86' );
define( 'LOGGED_IN_KEY',     'VTkasnOD`k4lDo4UTU}KJ}M8cs:~_hBuwsw97dg8M1ZS~S/;j<2EsX,])`S7;~H2' );
define( 'NONCE_KEY',         'sElIo VFksQ53ho#Igl&sC[CoR3Q4B||>PMMNTY9Cs4|.3ju0.K*]DA$OomxteSC' );
define( 'AUTH_SALT',         'W`A^GWVS&V;OUXs-;9ZHbYXQe1o4=91#e}1WH.&QZF~gPxZ9vgM@4w/+Nn=MOJR&' );
define( 'SECURE_AUTH_SALT',  'pL^Vt!.2P~iJY2Key9{@jL Ws)BSR*L)KB_ *1rfE2Q5(fcYszuCFZVW?]/Sf%V!' );
define( 'LOGGED_IN_SALT',    '9-X%T#P^)VCgW4:t_:y@%8!sF3iL45:U?7zxVP@,Np2*b:Rs0uz~*DYs]9<>3xL=' );
define( 'NONCE_SALT',        '>vePxNZqH}t|Ol{ruiq>w,uN<MO>y+`!z)6cIv3*SNAAxGGNb abB<X0M)vWky3S' );
define( 'WP_CACHE_KEY_SALT', 'PRpdFiM->Bhl(*g-HmA54v8f>|J@h>BwuXyT;_+_V+0S`+H5u~$idf~L`K3PP7S/' );


/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';


/* Add any custom values between this line and the "stop editing" line. */



/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
if ( ! defined( 'WP_DEBUG' ) ) {
	define( 'WP_DEBUG', false );
}

define( 'FS_METHOD', 'direct' );
define( 'COOKIEHASH', '79ecbffcd1fef11f6eabfa3c54899b96' );
define( 'WP_AUTO_UPDATE_CORE', 'minor' );
/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
