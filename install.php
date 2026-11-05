<?php
/**
 * DevGenius Academy - Universal Web Installer
 * Path: install.php
 * Automated setup wizard for cPanel, DirectAdmin, and standard Apache shared hosts.
 */

// If installer is already locked, block access
if (file_exists(__DIR__ . '/install.lock')) {
    die('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Installer Locked</title><style>body{font-family:sans-serif;background:#061A3A;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;}div{background:#fff;color:#17233C;padding:30px;border-radius:16px;max-width:480px;text-align:center;}a{display:inline-block;margin-top:15px;background:#082592;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold;}</style></head><body><div><h2>Installation Already Completed</h2><p>For security, the installer is locked. To re-install, delete the <code>install.lock</code> file in your web root directory.</p><a href="index.php">Go to Academy Homepage</a></div></body></html>');
}

$errors = [];
$step = isset($_GET['step']) ? (int)$_GET['step'] : 1;

// System requirements checklist
$phpVersionOk = version_compare(PHP_VERSION, '8.1.0', '>=');
$pdoOk = extension_loaded('pdo_mysql');
$mbstringOk = extension_loaded('mbstring');
$uploadsWritable = is_writable(__DIR__ . '/uploads') || @mkdir(__DIR__ . '/uploads/assignments', 0755, true);
$configWritable = is_writable(__DIR__ . '/includes') || is_writable(__DIR__ . '/includes/config.php');

$autoUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http') . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost');

$successMessage = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $dbHost = trim($_POST['db_host'] ?? 'localhost');
    $dbName = trim($_POST['db_name'] ?? '');
    $dbUser = trim($_POST['db_user'] ?? '');
    $dbPass = $_POST['db_pass'] ?? '';
    $appUrl = rtrim(trim($_POST['app_url'] ?? $autoUrl), '/');
    $adminName = trim($_POST['admin_name'] ?? 'Academy Administrator');
    $adminEmail = strtolower(trim($_POST['admin_email'] ?? 'admin@devgenius.ac'));
    $adminPass = $_POST['admin_pass'] ?? '';

    if (empty($dbName) || empty($dbUser)) {
        $errors[] = 'Database Name and Database Username are required.';
    }
    if (empty($adminEmail) || empty($adminPass)) {
        $errors[] = 'Admin Email and Password are required.';
    }

    if (empty($errors)) {
        try {
            $dsn = "mysql:host={$dbHost};dbname={$dbName};charset=utf8mb4";
            $pdo = new PDO($dsn, $dbUser, $dbPass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);

            // Read database.sql schema
            $sqlFile = __DIR__ . '/database.sql';
            if (!file_exists($sqlFile)) {
                throw new Exception('database.sql file not found in the root directory.');
            }

            $sql = file_get_contents($sqlFile);

            // Execute SQL schema in batches
            $pdo->exec($sql);

            // Hash the admin password securely
            $adminHash = password_hash($adminPass, PASSWORD_BCRYPT, ['cost' => 11]);

            // Update or insert admin account
            $checkAdmin = $pdo->prepare("SELECT id FROM users WHERE email = ?");
            $checkAdmin->execute([$adminEmail]);
            if ($checkAdmin->fetch()) {
                $upd = $pdo->prepare("UPDATE users SET full_name = ?, password_hash = ?, role = 'admin' WHERE email = ?");
                $upd->execute([$adminName, $adminHash, $adminEmail]);
            } else {
                $ins = $pdo->prepare("INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, 'admin')");
                $ins->execute([$adminName, $adminEmail, $adminHash]);
            }

            // Write includes/config.php
            $configContent = "<?php\n"
                . "/**\n"
                . " * DevGenius Academy - Production Configuration\n"
                . " * Generated automatically by Universal Web Installer\n"
                . " */\n\n"
                . "error_reporting(E_ALL);\n"
                . "ini_set('display_errors', 0);\n"
                . "ini_set('log_errors', 1);\n\n"
                . "define('DB_HOST', " . var_export($dbHost, true) . ");\n"
                . "define('DB_NAME', " . var_export($dbName, true) . ");\n"
                . "define('DB_USER', " . var_export($dbUser, true) . ");\n"
                . "define('DB_PASS', " . var_export($dbPass, true) . ");\n"
                . "define('DB_CHARSET', 'utf8mb4');\n\n"
                . "define('APP_NAME', 'DevGenius Academy');\n"
                . "define('APP_URL', " . var_export($appUrl, true) . ");\n"
                . "define('ADMIN_EMAIL', " . var_export($adminEmail, true) . ");\n"
                . "define('UPLOAD_DIR', __DIR__ . '/../uploads/');\n"
                . "define('MAX_UPLOAD_SIZE', 25 * 1024 * 1024);\n"
                . "define('ALLOWED_EXTENSIONS', ['pdf', 'doc', 'docx', 'zip', 'py', 'js', 'html', 'css', 'png', 'jpg']);\n\n"
                . "if (session_status() === PHP_SESSION_NONE) {\n"
                . "    ini_set('session.cookie_httponly', '1');\n"
                . "    ini_set('session.use_only_cookies', '1');\n"
                . "    ini_set('session.cookie_samesite', 'Lax');\n"
                . "    session_start();\n"
                . "}\n";

            file_put_contents(__DIR__ . '/includes/config.php', $configContent);

            // Lock installer
            file_put_contents(__DIR__ . '/install.lock', 'Installed on ' . date('c'));

            $step = 3;
        } catch (Exception $e) {
            $errors[] = 'Database Error: ' . $e->getMessage();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DevGenius Academy - Universal Web Installer</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background: #F2F6FF;
            color: #17233C;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
        }
        .container {
            background: #ffffff;
            border-radius: 24px;
            box-shadow: 0 20px 40px rgba(6, 26, 58, 0.08);
            border: 1px solid #e2e8f0;
            max-width: 640px;
            width: 100%;
            overflow: hidden;
        }
        .header {
            background: #061A3A;
            color: #ffffff;
            padding: 32px;
            text-align: center;
        }
        .badge {
            display: inline-block;
            background: rgba(242, 140, 24, 0.2);
            color: #F28C18;
            font-size: 11px;
            font-weight: 800;
            padding: 4px 12px;
            border-radius: 20px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
        }
        .header h1 { font-size: 24px; font-weight: 800; }
        .header p { font-size: 13px; color: #94a3b8; margin-top: 4px; }
        .body { padding: 32px; }
        .check-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            background: #f8fafc;
            border-radius: 12px;
            margin-bottom: 8px;
            font-size: 13px;
        }
        .ok { color: #16a34a; font-weight: 700; }
        .fail { color: #dc2626; font-weight: 700; }
        .error-box {
            background: #fef2f2;
            border: 1px solid #fecaca;
            color: #991b1b;
            padding: 12px 16px;
            border-radius: 12px;
            font-size: 13px;
            margin-bottom: 20px;
        }
        .form-group { margin-bottom: 16px; }
        .form-group label {
            display: block;
            font-size: 12px;
            font-weight: 700;
            margin-bottom: 6px;
            color: #334155;
        }
        .form-group input {
            width: 100%;
            padding: 10px 14px;
            border-radius: 10px;
            border: 1px solid #cbd5e1;
            font-size: 13px;
            font-family: inherit;
        }
        .form-group input:focus {
            outline: none;
            border-color: #082592;
            box-shadow: 0 0 0 3px rgba(8, 37, 146, 0.1);
        }
        .btn {
            display: inline-block;
            width: 100%;
            padding: 14px;
            border-radius: 12px;
            background: #F28C18;
            color: #ffffff;
            font-weight: 700;
            font-size: 14px;
            border: none;
            cursor: pointer;
            text-align: center;
            text-decoration: none;
            transition: background 0.2s;
        }
        .btn:hover { background: #d97706; }
        .btn-blue { background: #082592; }
        .btn-blue:hover { background: #1746C5; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .footer-note { font-size: 11px; text-align: center; color: #94a3b8; margin-top: 16px; }
    </style>
</head>
<body>

<div class="container">
    <div class="header">
        <span class="badge">DirectAdmin & cPanel Ready</span>
        <h1>DevGenius Academy Setup</h1>
        <p>Universal Automated Web Installer & Database Configuration</p>
    </div>

    <div class="body">
        <?php if (!empty($errors)): ?>
            <div class="error-box">
                <?php foreach ($errors as $err): ?>
                    <p>• <?php echo htmlspecialchars($err); ?></p>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>

        <?php if ($step === 1): ?>
            <h3 style="font-size:16px; font-weight:800; margin-bottom:12px;">Server Readiness Check</h3>
            <div class="check-item">
                <span>PHP Version (>= 8.1.0)</span>
                <span class="<?php echo $phpVersionOk ? 'ok' : 'fail'; ?>">
                    <?php echo PHP_VERSION; ?> <?php echo $phpVersionOk ? '✔' : '✖'; ?>
                </span>
            </div>
            <div class="check-item">
                <span>PDO MySQL Extension</span>
                <span class="<?php echo $pdoOk ? 'ok' : 'fail'; ?>">
                    <?php echo $pdoOk ? 'Installed ✔' : 'Missing ✖'; ?>
                </span>
            </div>
            <div class="check-item">
                <span>Multibyte String (mbstring)</span>
                <span class="<?php echo $mbstringOk ? 'ok' : 'fail'; ?>">
                    <?php echo $mbstringOk ? 'Installed ✔' : 'Missing ✖'; ?>
                </span>
            </div>
            <div class="check-item">
                <span>Uploads Folder Writable</span>
                <span class="<?php echo $uploadsWritable ? 'ok' : 'fail'; ?>">
                    <?php echo $uploadsWritable ? 'Writable ✔' : 'Permission Denied (set 755) ✖'; ?>
                </span>
            </div>

            <?php if ($phpVersionOk && $pdoOk): ?>
                <div style="margin-top:24px;">
                    <a href="install.php?step=2" class="btn btn-blue">Continue to Database Setup →</a>
                </div>
            <?php else: ?>
                <p style="color:#dc2626; font-size:12px; margin-top:16px;">
                    Please enable PHP 8.1+ and the <code>pdo_mysql</code> extension in your hosting panel (cPanel MultiPHP or DirectAdmin PHP Selector).
                </p>
            <?php endif; ?>

        <?php elseif ($step === 2): ?>
            <form method="POST" action="install.php">
                <h3 style="font-size:15px; font-weight:800; margin-bottom:12px; color:#082592;">1. MySQL Database Settings</h3>
                <div class="grid-2">
                    <div class="form-group">
                        <label>Database Host</label>
                        <input type="text" name="db_host" value="localhost" required>
                    </div>
                    <div class="form-group">
                        <label>Database Name (e.g. da_academy)</label>
                        <input type="text" name="db_name" placeholder="user_devgenius" required>
                    </div>
                </div>
                <div class="grid-2">
                    <div class="form-group">
                        <label>Database Username</label>
                        <input type="text" name="db_user" placeholder="user_dbuser" required>
                    </div>
                    <div class="form-group">
                        <label>Database Password</label>
                        <input type="password" name="db_pass" placeholder="••••••••••••">
                    </div>
                </div>

                <div class="form-group">
                    <label>Academy Website URL</label>
                    <input type="url" name="app_url" value="<?php echo htmlspecialchars($autoUrl); ?>" required>
                </div>

                <h3 style="font-size:15px; font-weight:800; margin-top:20px; margin-bottom:12px; color:#082592;">2. Administrator Credentials</h3>
                <div class="form-group">
                    <label>Admin Full Name</label>
                    <input type="text" name="admin_name" value="Academy Director" required>
                </div>
                <div class="grid-2">
                    <div class="form-group">
                        <label>Admin Email</label>
                        <input type="email" name="admin_email" value="admin@devgenius.ac" required>
                    </div>
                    <div class="form-group">
                        <label>Admin Password</label>
                        <input type="password" name="admin_pass" placeholder="Enter strong password" required>
                    </div>
                </div>

                <button type="submit" class="btn" style="margin-top:12px;">Install DevGenius Academy Now</button>
            </form>

        <?php elseif ($step === 3): ?>
            <div style="text-align:center; padding:16px 0;">
                <div style="width:64px; height:64px; background:#dcfce7; color:#16a34a; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:32px; margin-bottom:16px;">✔</div>
                <h2 style="font-size:22px; font-weight:800; color:#061A3A;">Installation Succeeded!</h2>
                <p style="font-size:13px; color:#64748b; margin-top:8px; line-height:1.6;">
                    The database tables have been imported and <code>includes/config.php</code> was generated.<br>
                    An <code>install.lock</code> file has been created to secure your portal.
                </p>

                <div style="margin-top:24px; display:flex; gap:12px;">
                    <a href="login.php" class="btn btn-blue">Go to Login</a>
                    <a href="index.php" class="btn">View Academy Home</a>
                </div>
            </div>
        <?php endif; ?>

        <p class="footer-note">
            DevGenius Academy • Compatible with DirectAdmin, cPanel, and Apache 2.4+
        </p>
    </div>
</div>

</body>
</html>
