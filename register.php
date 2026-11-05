<?php
/**
 * DevGenius Academy - Student Registration Page
 * Path: register.php
 * Fully compatible with cPanel, DirectAdmin, and standard shared hosting.
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
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!validateCsrfToken($_POST['csrf_token'] ?? '')) {
        $error = 'Security validation failed (invalid CSRF token). Please try again.';
    } else {
        $fullName = $_POST['full_name'] ?? '';
        $email = $_POST['email'] ?? '';
        $phone = $_POST['phone'] ?? '';
        $password = $_POST['password'] ?? '';
        $confirmPassword = $_POST['confirm_password'] ?? '';

        if (empty($fullName) || empty($email) || empty($password)) {
            $error = 'Please fill out all required fields.';
        } elseif ($password !== $confirmPassword) {
            $error = 'Passwords do not match. Please verify.';
        } elseif (strlen($password) < 6) {
            $error = 'Password must be at least 6 characters.';
        } else {
            $res = registerUser($fullName, $email, $phone, $password);
            if ($res['success']) {
                header('Location: student/dashboard.php');
                exit;
            } else {
                $error = $res['message'];
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Registration - DevGenius Academy</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #F2F6FF; color: #17233C; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .box { background: #fff; border-radius: 20px; box-shadow: 0 20px 40px rgba(6,26,58,0.06); border: 1px solid #e2e8f0; max-width: 480px; width: 100%; overflow: hidden; }
        .box-head { background: #061A3A; color: #fff; padding: 28px; text-align: center; }
        .box-body { padding: 32px; }
        .logo-txt { font-weight: 800; font-size: 20px; letter-spacing: -0.5px; }
        .logo-txt span { color: #F28C18; font-size: 10px; display: block; letter-spacing: 2px; }
        .alert-err { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; padding: 12px; border-radius: 10px; font-size: 13px; margin-bottom: 20px; }
        .form-group { margin-bottom: 16px; }
        label { display: block; font-size: 12px; font-weight: 700; margin-bottom: 6px; color: #334155; }
        input { width: 100%; padding: 10px 14px; border-radius: 10px; border: 1px solid #cbd5e1; font-size: 13px; font-family: inherit; }
        input:focus { outline: none; border-color: #082592; box-shadow: 0 0 0 3px rgba(8,37,146,0.1); }
        .btn-sub { width: 100%; padding: 12px; border-radius: 10px; background: #F28C18; color: #fff; font-weight: 700; font-size: 14px; border: none; cursor: pointer; transition: 0.2s; }
        .btn-sub:hover { background: #d97706; }
        .role-notice { background: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af; padding: 10px; border-radius: 10px; font-size: 11px; margin-bottom: 20px; line-height: 1.4; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
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
        <h2 style="font-size:18px; margin-top:12px; font-weight:800;">Student Registration</h2>
        <p style="font-size:12px; color:#94a3b8; margin-top:2px;">Create your student account to enrol in courses</p>
    </div>

    <div class="box-body">
        <?php if (!empty($error)): ?>
            <div class="alert-err"><?php echo htmlspecialchars($error); ?></div>
        <?php endif; ?>

        <div class="role-notice">
            🔒 <strong>Strict Student Role Assignment:</strong> Student registration forms strictly provision the <code>student</code> role. Administrator accounts cannot be created here.
        </div>

        <form method="POST" action="register.php">
            <?php renderCsrfField(); ?>

            <div class="form-group">
                <label>Full Name *</label>
                <input type="text" name="full_name" required placeholder="e.g. Samuel Adekunle" value="<?php echo htmlspecialchars($_POST['full_name'] ?? ''); ?>">
            </div>

            <div class="form-group">
                <label>Email Address *</label>
                <input type="email" name="email" required placeholder="name@student.com" value="<?php echo htmlspecialchars($_POST['email'] ?? ''); ?>">
            </div>

            <div class="form-group">
                <label>Phone Number</label>
                <input type="tel" name="phone" placeholder="+234 812 345 6789" value="<?php echo htmlspecialchars($_POST['phone'] ?? ''); ?>">
            </div>

            <div class="grid-2">
                <div class="form-group">
                    <label>Password *</label>
                    <input type="password" name="password" required placeholder="Min 6 chars">
                </div>
                <div class="form-group">
                    <label>Confirm *</label>
                    <input type="password" name="confirm_password" required placeholder="Repeat password">
                </div>
            </div>

            <button type="submit" class="btn-sub">Create Free Account</button>
        </form>

        <div class="foot">
            Already have an account? <a href="login.php">Sign In here</a>
        </div>
    </div>
</div>

</body>
</html>
