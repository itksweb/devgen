<?php
/**
 * DevGenius Academy - Administrator Operations Dashboard
 * Path: admin/dashboard.php
 * Fully compatible with DirectAdmin and cPanel shared hosts.
 */

require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/database.php';
require_once __DIR__ . '/../includes/functions.php';
require_once __DIR__ . '/../includes/auth.php';

$admin = requireAdmin();
$db = getDb();

// 1. DYNAMIC METRICS: Strict student count excluding admins!
$stmtStudents = $db->query("SELECT id, full_name, email, phone, created_at FROM users WHERE role = 'student' ORDER BY id DESC");
$students = $stmtStudents->fetchAll();
$totalStudents = count($students);

$stmtCourses = $db->query("SELECT c.*, (SELECT COUNT(*) FROM course_enrolments WHERE course_id = c.id) AS student_count FROM courses c ORDER BY c.id DESC");
$courses = $stmtCourses->fetchAll();
$activeCourses = 0;
foreach ($courses as $c) {
    if ($c['is_active']) $activeCourses++;
}

$stmtEnrols = $db->query("SELECT COUNT(*) AS total FROM course_enrolments");
$totalEnrols = (int)$stmtEnrols->fetch()['total'];

$stmtSubs = $db->query("
    SELECT s.*, u.full_name AS student_name, u.email AS student_email, a.title AS assignment_title, c.title AS course_title 
    FROM assignment_submissions s 
    JOIN users u ON s.user_id = u.id 
    JOIN assignments a ON s.assignment_id = a.id 
    JOIN courses c ON a.course_id = c.id 
    ORDER BY s.submitted_at DESC
");
$submissions = $stmtSubs->fetchAll();

$pendingSubs = [];
$gradedSubs = [];
foreach ($submissions as $s) {
    if ($s['status'] === 'graded') {
        $gradedSubs[] = $s;
    } else {
        $pendingSubs[] = $s;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administrator Dashboard - DevGenius Academy</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --navy-dark: #061A3A;
            --blue-royal: #082592;
            --blue-bright: #1746C5;
            --orange-accent: #F28C18;
            --bg-light: #F8FAFC;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: var(--bg-light); color: #17233C; display: flex; min-height: 100vh; }
        .sidebar { width: 260px; background: var(--navy-dark); color: #fff; padding: 24px 16px; flex-shrink: 0; display: flex; flex-direction: column; justify-content: space-between; }
        .side-head { border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; margin-bottom: 20px; }
        .logo-txt { font-weight: 800; font-size: 18px; color: #fff; text-decoration: none; display: block; }
        .logo-txt span { color: var(--orange-accent); font-size: 9px; display: block; letter-spacing: 2px; }
        .user-tag { background: rgba(242,140,24,0.15); border: 1px solid rgba(242,140,24,0.3); padding: 12px; border-radius: 12px; margin-top: 14px; font-size: 12px; }
        .side-nav { display: flex; flex-direction: column; gap: 6px; }
        .side-nav a { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-radius: 10px; color: #cbd5e1; text-decoration: none; font-size: 13px; font-weight: 600; transition: 0.2s; }
        .side-nav a:hover, .side-nav a.active { background: var(--blue-royal); color: #fff; }
        .content { flex: 1; padding: 36px 48px; overflow-y: auto; }
        .greeting-card { background: var(--navy-dark); color: #fff; padding: 30px; border-radius: 20px; margin-bottom: 30px; }
        .kpi-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px; margin-bottom: 30px; }
        .kpi-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 18px; }
        .kpi-card .num { font-size: 26px; font-weight: 800; color: var(--navy-dark); margin-top: 4px; }
        .kpi-card .lbl { font-size: 11px; color: #64748b; font-weight: 600; }
        .sec-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 18px; padding: 24px; margin-bottom: 24px; }
        .sec-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
        .sec-head h3 { font-size: 16px; font-weight: 800; color: var(--navy-dark); }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        th { text-align: left; padding: 12px 14px; background: #f8fafc; color: #64748b; font-size: 11px; text-transform: uppercase; font-weight: 700; border-bottom: 1px solid #e2e8f0; }
        td { padding: 12px 14px; border-bottom: 1px solid #f1f5f9; }
        .badge-pending { background: #fef3c7; color: #92400e; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 700; }
        .badge-graded { background: #dcfce7; color: #16a34a; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 700; }
        .btn-act { padding: 6px 12px; border-radius: 6px; background: var(--blue-royal); color: #fff; font-size: 11px; font-weight: 700; text-decoration: none; display: inline-block; }
        @media(max-width: 1100px) { .kpi-grid { grid-template-columns: repeat(3, 1fr); } }
        @media(max-width: 800px) { body { flex-direction: column; } .sidebar { width: 100%; } .kpi-grid { grid-template-columns: 1fr 1fr; } .content { padding: 20px; } }
    </style>
</head>
<body>

<aside class="sidebar">
    <div>
        <div class="side-head">
            <a href="../index.php" class="logo-txt">DEVGENIUS <span>ACADEMY</span></a>
            <div class="user-tag">
                <strong style="color:var(--orange-accent);">Administrator</strong><br>
                <span><?php echo e($admin['full_name']); ?></span>
            </div>
        </div>

        <nav class="side-nav">
            <a href="dashboard.php" class="active"><span>Overview & Stats</span></a>
            <a href="dashboard.php#students"><span>Registered Students (<?php echo $totalStudents; ?>)</span></a>
            <a href="dashboard.php#courses"><span>Courses (<?php echo count($courses); ?>)</span></a>
            <a href="dashboard.php#grading"><span>Grading Queue (<?php echo count($pendingSubs); ?>)</span></a>
        </nav>
    </div>

    <div>
        <a href="../logout.php" style="color:#f87171; font-size:12px; font-weight:700; text-decoration:none; display:block; padding:10px 14px;">Exit Admin Session →</a>
    </div>
</aside>

<main class="content">
    <div class="greeting-card">
        <span style="font-size:11px; font-weight:800; color:var(--orange-accent); text-transform:uppercase; letter-spacing:1px;">Administrator Console</span>
        <h1 style="font-size:26px; font-weight:800; margin-top:4px;">Academic Registry & Grading</h1>
        <p style="font-size:13px; color:#94a3b8; margin-top:6px;">
            Dynamic figures from MySQL. Compatible with DirectAdmin and cPanel shared servers.
        </p>
    </div>

    <!-- 6 KPI Stat Cards -->
    <div class="kpi-grid">
        <div class="kpi-card" style="border:2px solid rgba(8,37,146,0.3);">
            <div class="lbl">Registered Students</div>
            <div class="num" style="color:var(--blue-royal);"><?php echo $totalStudents; ?></div>
            <div style="font-size:10px; color:#16a34a; font-weight:700; margin-top:2px;">Excludes Admins</div>
        </div>
        <div class="kpi-card">
            <div class="lbl">Active Courses</div>
            <div class="num"><?php echo $activeCourses; ?></div>
            <div style="font-size:10px; color:#64748b; margin-top:2px;">Of <?php echo count($courses); ?> total</div>
        </div>
        <div class="kpi-card">
            <div class="lbl">Total Enrolments</div>
            <div class="num"><?php echo $totalEnrols; ?></div>
            <div style="font-size:10px; color:#64748b; margin-top:2px;">Course links</div>
        </div>
        <div class="kpi-card">
            <div class="lbl">Total Submissions</div>
            <div class="num"><?php echo count($submissions); ?></div>
            <div style="font-size:10px; color:#64748b; margin-top:2px;">Uploaded work</div>
        </div>
        <div class="kpi-card">
            <div class="lbl">Pending Review</div>
            <div class="num" style="color:var(--orange-accent);"><?php echo count($pendingSubs); ?></div>
            <div style="font-size:10px; color:#d97706; font-weight:700; margin-top:2px;">Needs Grading</div>
        </div>
        <div class="kpi-card">
            <div class="lbl">Graded Submissions</div>
            <div class="num" style="color:#16a34a;"><?php echo count($gradedSubs); ?></div>
            <div style="font-size:10px; color:#16a34a; font-weight:700; margin-top:2px;">Finalized</div>
        </div>
    </div>

    <!-- Pending Assignments To Grade -->
    <div class="sec-card" id="grading">
        <div class="sec-head">
            <h3>Assignments Awaiting Instructor Evaluation (<?php echo count($pendingSubs); ?>)</h3>
        </div>

        <?php if (empty($pendingSubs)): ?>
            <p style="font-size:13px; color:#64748b; padding:10px 0;">All student submissions have been evaluated!</p>
        <?php else: ?>
            <table>
                <thead>
                    <tr>
                        <th>Student</th>
                        <th>Course</th>
                        <th>Assignment</th>
                        <th>Submitted At</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($pendingSubs as $sub): ?>
                        <tr>
                            <td>
                                <strong><?php echo e($sub['student_name']); ?></strong><br>
                                <span style="font-size:11px; color:#64748b;"><?php echo e($sub['student_email']); ?></span>
                            </td>
                            <td><?php echo e($sub['course_title']); ?></td>
                            <td><?php echo e($sub['assignment_title']); ?></td>
                            <td><?php echo e($sub['submitted_at']); ?></td>
                            <td><span class="badge-pending">Pending</span></td>
                            <td>
                                <a href="grade-assignment.php?id=<?php echo (int)$sub['id']; ?>" class="btn-act">Grade & Feedback →</a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php endif; ?>
    </div>

    <!-- Registered Students Registry -->
    <div class="sec-card" id="students">
        <div class="sec-head">
            <h3>Registered Students Registry (Total: <?php echo $totalStudents; ?>)</h3>
        </div>

        <table>
            <thead>
                <tr>
                    <th># ID</th>
                    <th>Full Name</th>
                    <th>Email Address</th>
                    <th>Phone</th>
                    <th>Registered Date</th>
                    <th>Role</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($students as $st): ?>
                    <tr>
                        <td>#<?php echo (int)$st['id']; ?></td>
                        <td><strong><?php echo e($st['full_name']); ?></strong></td>
                        <td><?php echo e($st['email']); ?></td>
                        <td><?php echo e($st['phone'] ?? 'N/A'); ?></td>
                        <td><?php echo e($st['created_at']); ?></td>
                        <td><span style="background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:10px; font-size:10px; font-weight:700;">student</span></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</main>

</body>
</html>
