<?php
/**
 * DevGenius Academy - Database Connection via PHP PDO
 * Path: includes/database.php
 * Fully injection-proof prepared statements with UTF8MB4.
 */

require_once __DIR__ . '/config.php';

function getDb(): PDO {
    static $pdo = null;

    if ($pdo === null) {
        $dsn = sprintf('mysql:host=%s;dbname=%s;charset=%s', DB_HOST, DB_NAME, DB_CHARSET);
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            error_log('Database Connection Failure: ' . $e->getMessage());
            die('Database connection could not be established. Please check includes/config.php credentials.');
        }
    }

    return $pdo;
}
