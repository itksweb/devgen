<?php
/**
 * DevGenius Academy - Login Portal
 * Path: login.php
 * Handles student and administrator sign-in.
 */

require_once __DIR__ . '/includes/config.php';
require_once __DIR__ . '/includes/database.php';
require_once __DIR__ . '/includes/functions.php';
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/csrf.php';

if (isLoggedIn()) {
    header('Location: ' . (isAdmin() ? 'admin/dashboard.php' : 'student/dashboard.php'));
    exit;
}

$error = '';
if (isset($_GET['error']) && $_GET['error'] === 'admin_required') {
    $error = 'Administrator privileges required. Please sign in with an admin account.';
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!validateCsrfToken($_POST['csrf_token'] ?? '')) {
        $error = 'Security validation failed (invalid CSRF token).';
    } else {
        $email = $_POST['email'] ?? '';
        $password = $_POST['password'] ?? '';

        $res = loginUser($email, $password);
        if ($res['success']) {
            if ($res['role'] === 'admin') {
                header('Location: admin/dashboard.php');
            } else {
                header('Location: student/dashboard.php');
            }
            exit;
        } else {
            $error = $res['message'];
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign In - DevGenius Academy</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #F2F6FF; color: #17233C; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .box { background: #fff; border-radius: 20px; box-shadow: 0 20px 40px rgba(6,26,58,0.06); border: 1px solid #e2e8f0; max-width: 440px; width: 100%; overflow: hidden; }
        .box-head { background: #061A3A; color: #fff; padding: 28px; text-align: center; }
        .box-body { padding: 32px; }
        .logo-txt { font-weight: 800; font-size: 20px; letter-spacing: -0.5px; }
        .logo-txt span { color: #F28C18; font-size: 10px; display: block; letter-spacing: 2px; }
        .alert-err { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; padding: 12px; border-radius: 10px; font-size: 13px; margin-bottom: 20px; }
        .form-group { margin-bottom: 16px; }
        label { display: block; font-size: 12px; font-weight: 700; margin-bottom: 6px; color: #334155; }
        input { width: 100%; padding: 10px 14px; border-radius: 10px; border: 1px solid #cbd5e1; font-size: 13px; font-family: inherit; }
        input:focus { outline: none; border-color: #082592; box-shadow: 0 0 0 3px rgba(8,37,146,0.1); }
        .btn-sub { width: 100%; padding: 12px; border-radius: 10px; background: #082592; color: #fff; font-weight: 700; font-size: 14px; border: none; cursor: pointer; transition: 0.2s; }
        .btn-sub:hover { background: #1746C5; }
        .demo-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; margin-top: 20px; font-size: 11px; }
        .foot { text-align: center; margin-top: 20px; font-size: 13px; color: #64748b; }
        .foot a { color: #082592; font-weight: 700; text-decoration: none; }
    </style>
</head>
<body>

<div class="box">
    <div class="box-head">
        <a href="index.php" style="text-decoration:none; color:#fff;">
            <div class="logo-txt">DEVGENIUS <span>ACADEMY</span></div>
        </a>
        <h2 style="font-size:18px; margin-top:12px; font-weight:800;">Portal Sign In</h2>
        <p style="font-size:12px; color:#94a3b8; margin-top:2px;">Enter your credentials to access your courses</p>
    </div>

    <div class="box-body">
        <?php if (!empty($error)): ?>
            <div class="alert-err"><?php echo htmlspecialchars($error); ?></div>
        <?php endif; ?>

        <form method="POST" action="login.php">
            <?php renderCsrfField(); ?>

            <div class="form-group">
                <label>Email Address</label>
                <input type="email" name="email" required placeholder="you@devgenius.ac" value="<?php echo htmlspecialchars($_POST['email'] ?? ''); ?>">
            </div>

            <div class="form-group">
                <label>Password</label>
                <input type="password" name="password" required placeholder="••••••••">
            </div>

            <button type="submit" class="btn-sub">Sign In to Portal</button>
        </form>

        <div class="demo-box">
            <strong>Default Credentials:</strong><br>
            • Admin: <code>admin@devgenius.ac</code> / <code>Admin@2026!</code><br>
            • Student: <code>emmanuel@student.devgenius.ac</code> / <code>password123</code>
        </div>

        <div class="foot">
            Don't have an account yet? <a href="register.php">Register as Student</a>
        </div>
    </div>
</div>

</body>
</html>
