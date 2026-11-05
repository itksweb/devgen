<?php
/**
 * DevGenius Academy - Authentication & Role Checks
 * Path: includes/auth.php
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/database.php';

function getCurrentUser(): ?array {
    return $_SESSION['user'] ?? null;
}

function isLoggedIn(): bool {
    return !empty($_SESSION['user_id']);
}

function isAdmin(): bool {
    return isLoggedIn() && ($_SESSION['user_role'] ?? '') === 'admin';
}

function isStudent(): bool {
    return isLoggedIn() && ($_SESSION['user_role'] ?? '') === 'student';
}

function requireStudent(): array {
    if (!isStudent()) {
        header('Location: ' . APP_URL . '/login.php?error=student_required');
        exit;
    }
    return $_SESSION['user'];
}

function requireAdmin(): array {
    if (!isAdmin()) {
        header('Location: ' . APP_URL . '/login.php?error=admin_required');
        exit;
    }
    return $_SESSION['user'];
}

function loginUser(string $email, string $password): array {
    $db = getDb();
    $email = strtolower(trim($email));

    $stmt = $db->prepare('SELECT id, full_name, email, phone, password_hash, role, bio FROM users WHERE email = ? LIMIT 1');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        return ['success' => false, 'message' => 'Invalid email address or password.'];
    }

    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_role'] = $user['role'];
    $_SESSION['user_name'] = $user['full_name'];
    $_SESSION['user'] = [
        'id' => $user['id'],
        'full_name' => $user['full_name'],
        'email' => $user['email'],
        'phone' => $user['phone'],
        'role' => $user['role'],
        'bio' => $user['bio']
    ];

    return ['success' => true, 'role' => $user['role']];
}

function registerUser(string $fullName, string $email, string $phone, string $password): array {
    $db = getDb();
    $email = strtolower(trim($email));
    $fullName = trim($fullName);
    $phone = trim($phone);

    if (empty($fullName) || empty($email) || empty($password)) {
        return ['success' => false, 'message' => 'Please fill in all required fields.'];
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return ['success' => false, 'message' => 'Please provide a valid email address.'];
    }

    if (strlen($password) < 6) {
        return ['success' => false, 'message' => 'Password must be at least 6 characters long.'];
    }

    // Check unique email
    $check = $db->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
    $check->execute([$email]);
    if ($check->fetch()) {
        return ['success' => false, 'message' => 'An account with this email address already exists.'];
    }

    // Password hashing via PHP password_hash (BCRYPT)
    $hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 11]);

    // STRICT: Students automatically assigned student role; no elevation allowed
    $stmt = $db->prepare('INSERT INTO users (full_name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, "student")');
    $stmt->execute([$fullName, $email, $phone, $hash]);

    $newId = (int)$db->lastInsertId();

    $_SESSION['user_id'] = $newId;
    $_SESSION['user_role'] = 'student';
    $_SESSION['user_name'] = $fullName;
    $_SESSION['user'] = [
        'id' => $newId,
        'full_name' => $fullName,
        'email' => $email,
        'phone' => $phone,
        'role' => 'student'
    ];

    return ['success' => true, 'message' => 'Registration complete.'];
}

function logoutUser(): void {
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params['path'], $params['domain'],
            $params['secure'], $params['httponly']
        );
    }
    session_destroy();
}
