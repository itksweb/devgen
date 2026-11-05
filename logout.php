<?php
/**
 * DevGenius Academy - Logout Handler
 * Path: logout.php
 */

require_once __DIR__ . '/includes/config.php';
require_once __DIR__ . '/includes/auth.php';

logoutUser();
header('Location: ' . APP_URL . '/index.php?msg=logged_out');
exit;
