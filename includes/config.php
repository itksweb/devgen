<?php
/**
 * @license Apache-2.0
 * DevGenius Academy - Application Configuration
 * Path: includes/config.php
 * Note: Edit DB credentials after uploading to your cPanel server.
 */

// Production error reporting: log errors, don't show to visitors
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Database Credentials (Set from cPanel MySQL Wizard)
define('DB_HOST', 'localhost');
define('DB_NAME', 'cpaneluser_devgenius');
define('DB_USER', 'cpaneluser_dbuser');
define('DB_PASS', 'YourSecureDatabasePassword2026!');
define('DB_CHARSET', 'utf8mb4');

// Brand & Base URLs
define('APP_NAME', 'DevGenius Academy');
define('APP_URL', 'https://yourdomain.com'); // e.g. https://academy.yourdomain.com
define('ADMIN_EMAIL', 'admin@devgenius.ac');
define('SUPPORT_PHONE', '+234 812 345 6789');

// Upload directory & limits
define('UPLOAD_DIR', __DIR__ . '/../uploads/');
define('MAX_UPLOAD_SIZE', 25 * 1024 * 1024); // 25 MB
define('ALLOWED_EXTENSIONS', ['pdf', 'doc', 'docx', 'zip', 'py', 'js', 'html', 'css', 'png', 'jpg']);

// Session Security Configuration
if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.cookie_httponly', '1');
    ini_set('session.use_only_cookies', '1');
    ini_set('session.cookie_samesite', 'Lax');
    session_start();
}
