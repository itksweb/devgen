<?php
/**
 * DevGenius Academy - Core Helper Functions & Sanitization
 * Path: includes/functions.php
 */

require_once __DIR__ . '/database.php';

// XSS Prevention
function e(?string $string): string {
    return htmlspecialchars($string ?? '', ENT_QUOTES, 'UTF-8');
}

// Fetch platform statistics dynamically from MySQL
function getPlatformStats(): array {
    $db = getDb();

    // STRICT: Only count student role accounts!
    $stmtStudents = $db->query("SELECT COUNT(*) AS total FROM users WHERE role = 'student'");
    $totalStudents = (int)$stmtStudents->fetch()['total'];

    $stmtCourses = $db->query("SELECT COUNT(*) AS total FROM courses WHERE is_active = 1");
    $totalCourses = (int)$stmtCourses->fetch()['total'];

    $stmtEnrols = $db->query("SELECT COUNT(*) AS total FROM course_enrolments");
    $totalEnrols = (int)$stmtEnrols->fetch()['total'];

    $stmtGraded = $db->query("SELECT COUNT(*) AS total FROM assignment_submissions WHERE status = 'graded'");
    $totalGraded = (int)$stmtGraded->fetch()['total'];

    return [
        'total_students' => $totalStudents,
        'total_courses' => $totalCourses,
        'total_enrolments' => $totalEnrols,
        'total_graded' => $totalGraded
    ];
}

// Fetch active courses
function getActiveCourses(int $limit = 6): array {
    $db = getDb();
    $sql = "SELECT c.*, i.name AS instructor_name, i.specialization AS instructor_title, i.image_url AS instructor_image 
            FROM courses c 
            LEFT JOIN instructors i ON c.instructor_id = i.id 
            WHERE c.is_active = 1 
            ORDER BY c.id DESC LIMIT " . (int)$limit;
    return $db->query($sql)->fetchAll();
}

// Secure file upload handler
function handleFileUpload(array $file, string $subfolder = 'assignments/'): array {
    if ($file['error'] !== UPLOAD_ERR_OK) {
        return ['success' => false, 'message' => 'Upload error code: ' . $file['error']];
    }

    if ($file['size'] > MAX_UPLOAD_SIZE) {
        return ['success' => false, 'message' => 'File exceeds maximum size limit of 25MB.'];
    }

    $originalName = basename($file['name']);
    $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

    if (!in_array($extension, ALLOWED_EXTENSIONS, true)) {
        return ['success' => false, 'message' => 'File type not permitted. Allowed: ' . implode(', ', ALLOWED_EXTENSIONS)];
    }

    // Generate random unguessable server-side filename
    $randomName = bin2hex(random_bytes(16)) . '.' . $extension;
    $targetDir = UPLOAD_DIR . trim($subfolder, '/') . '/';

    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0755, true);
    }

    $targetPath = $targetDir . $randomName;

    if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
        return ['success' => false, 'message' => 'Failed to save uploaded file on server. Check folder permissions (755).'];
    }

    return [
        'success' => true,
        'original_name' => $originalName,
        'stored_path' => 'uploads/' . trim($subfolder, '/') . '/' . $randomName,
        'file_size' => round($file['size'] / (1024 * 1024), 2) . ' MB'
    ];
}
