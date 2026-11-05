<?php
/**
 * DevGenius Academy - Admin Grade Assignment Handler
 * Path: admin/grade-assignment.php
 * Fully compatible with DirectAdmin and cPanel shared hosts.
 */

require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/database.php';
require_once __DIR__ . '/../includes/functions.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/csrf.php';

$admin = requireAdmin();
$db = getDb();

$subId = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($subId <= 0) {
    header('Location: dashboard.php');
    exit;
}

$stmt = $db->prepare("
    SELECT s.*, u.full_name AS student_name, u.email AS student_email, a.title AS assignment_title, c.title AS course_title 
    FROM assignment_submissions s 
    JOIN users u ON s.user_id = u.id 
    JOIN assignments a ON s.assignment_id = a.id 
    JOIN courses c ON a.course_id = c.id 
    WHERE s.id = ? 
    LIMIT 1
");
$stmt->execute([$subId]);
$sub = $stmt->fetch();

if (!$sub) {
    die('Submission record not found.');
}

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!validateCsrfToken($_POST['csrf_token'] ?? '')) {
        $error = 'Security validation failed (invalid CSRF token).';
    } else {
        $score = isset($_POST['score']) ? (int)$_POST['score'] : null;
        $feedback = trim($_POST['feedback'] ?? '');

        if ($score === null || $score < 0 || $score > 100) {
            $error = 'Please enter a valid score between 0 and 100.';
        } elseif (empty($feedback)) {
            $error = 'Please enter written critique and feedback for the student.';
        } else {
            $update = $db->prepare("
                UPDATE assignment_submissions 
                SET score = ?, feedback = ?, graded_at = NOW(), graded_by_user_id = ?, status = 'graded' 
                WHERE id = ?
            ");
            $update->execute([$score, $feedback, $admin['id'], $subId]);

            header('Location: dashboard.php?msg=graded_success');
            exit;
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Grade Submission #<?php echo $subId; ?> - DevGenius Academy</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #F2F6FF; color: #17233C; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
        .box { background: #fff; border-radius: 20px; box-shadow: 0 20px 40px rgba(6,26,58,0.08); border: 1px solid #e2e8f0; max-width: 580px; width: 100%; overflow: hidden; }
        .box-head { background: #061A3A; color: #fff; padding: 24px 32px; }
        .box-body { padding: 32px; }
        .form-group { margin-bottom: 16px; }
        label { display: block; font-size: 12px; font-weight: 700; margin-bottom: 6px; color: #334155; }
        input, textarea { width: 100%; padding: 10px 14px; border-radius: 10px; border: 1px solid #cbd5e1; font-size: 13px; font-family: inherit; }
        .btn-sub { padding: 12px 24px; border-radius: 10px; background: #16a34a; color: #fff; font-weight: 700; font-size: 13px; border: none; cursor: pointer; }
        .sub-meta { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 20px; font-size: 12px; line-height: 1.6; }
        .alert-err { background: #fef2f2; color: #991b1b; padding: 12px; border-radius: 10px; font-size: 12px; margin-bottom: 16px; }
    </style>
</head>
<body>

<div class="box">
    <div class="box-head">
        <span style="font-size:10px; font-weight:800; color:#F28C18; text-transform:uppercase;">Instructor Assessment</span>
        <h2 style="font-size:20px; font-weight:800; margin-top:2px;">Grade Assignment Submission</h2>
        <p style="font-size:12px; color:#94a3b8;"><?php echo e($sub['course_title']); ?></p>
    </div>

    <div class="box-body">
        <?php if (!empty($error)): ?>
            <div class="alert-err"><?php echo htmlspecialchars($error); ?></div>
        <?php endif; ?>

        <div class="sub-meta">
            <strong>Student:</strong> <?php echo e($sub['student_name']); ?> (<?php echo e($sub['student_email']); ?>)<br>
            <strong>Assignment:</strong> <?php echo e($sub['assignment_title']); ?><br>
            <strong>Submitted File:</strong> <?php echo e($sub['file_name']); ?> (<?php echo e($sub['file_size']); ?>)<br>
            <strong>Student Note:</strong> "<?php echo e($sub['comments']); ?>"
        </div>

        <form method="POST" action="grade-assignment.php?id=<?php echo $subId; ?>">
            <?php renderCsrfField(); ?>

            <div class="form-group">
                <label>Numerical Score (0 to 100) *</label>
                <input type="number" name="score" min="0" max="100" required value="<?php echo htmlspecialchars($sub['score'] ?? 90); ?>">
            </div>

            <div class="form-group">
                <label>Instructor Written Critique & Feedback *</label>
                <textarea name="feedback" rows="4" required placeholder="Constructive guidance for student..."><?php echo htmlspecialchars($sub['feedback'] ?? ''); ?></textarea>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:24px;">
                <a href="dashboard.php" style="color:#64748b; font-size:13px; font-weight:700; text-decoration:none;">← Cancel</a>
                <button type="submit" class="btn-sub">Publish Grade & Feedback</button>
            </div>
        </form>
    </div>
</div>

</body>
</html>
