<?php
/**
 * DevGenius Academy - Student Dashboard Overview
 * Path: student/dashboard.php
 * DirectAdmin & cPanel shared hosting compatible.
 */

require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/database.php';
require_once __DIR__ . '/../includes/functions.php';
require_once __DIR__ . '/../includes/auth.php';

$user = requireStudent();
$db = getDb();

// 1. Fetch Student Enrolled Courses
$stmtCourses = $db->prepare("
    SELECT c.*, e.progress_percentage, e.enrolled_date, i.name AS instructor_name 
    FROM course_enrolments e 
    JOIN courses c ON e.course_id = c.id 
    LEFT JOIN instructors i ON c.instructor_id = i.id 
    WHERE e.user_id = ? 
    ORDER BY e.enrolled_date DESC
");
$stmtCourses->execute([$user['id']]);
$enrolledCourses = $stmtCourses->fetchAll();

// 2. Fetch Assignments for Enrolled Courses
$courseIds = array_column($enrolledCourses, 'id');
$assignments = [];
if (!empty($courseIds)) {
    $inClause = implode(',', array_fill(0, count($courseIds), '?'));
    $stmtAsg = $db->prepare("
        SELECT a.*, c.title AS course_title 
        FROM assignments a 
        JOIN courses c ON a.course_id = c.id 
        WHERE a.course_id IN ($inClause) 
        ORDER BY a.deadline ASC
    ");
    $stmtAsg->execute($courseIds);
    $assignments = $stmtAsg->fetchAll();
}

// 3. Fetch Student Submissions
$stmtSubs = $db->prepare("
    SELECT s.*, a.title AS assignment_title, c.title AS course_title 
    FROM assignment_submissions s 
    JOIN assignments a ON s.assignment_id = a.id 
    JOIN courses c ON a.course_id = c.id 
    WHERE s.user_id = ? 
    ORDER BY s.submitted_at DESC
");
$stmtSubs->execute([$user['id']]);
$submissions = $stmtSubs->fetchAll();

$pendingCount = 0;
$gradedCount = 0;
foreach ($submissions as $s) {
    if ($s['status'] === 'graded') $gradedCount++;
    else $pendingCount++;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Dashboard - DevGenius Academy</title>
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
        .user-tag { background: rgba(255,255,255,0.06); padding: 12px; border-radius: 12px; margin-top: 14px; font-size: 12px; }
        .side-nav { display: flex; flex-direction: column; gap: 6px; }
        .side-nav a { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-radius: 10px; color: #cbd5e1; text-decoration: none; font-size: 13px; font-weight: 600; transition: 0.2s; }
        .side-nav a:hover, .side-nav a.active { background: var(--blue-royal); color: #fff; }
        .content { flex: 1; padding: 36px 48px; overflow-y: auto; }
        .greeting-card { background: linear-gradient(135deg, var(--blue-royal), var(--blue-bright)); color: #fff; padding: 30px; border-radius: 20px; margin-bottom: 30px; box-shadow: 0 10px 25px rgba(8,37,146,0.15); }
        .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
        .kpi-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; }
        .kpi-card .num { font-size: 28px; font-weight: 800; color: var(--navy-dark); margin-top: 6px; }
        .kpi-card .lbl { font-size: 12px; color: #64748b; font-weight: 600; }
        .sec-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 18px; padding: 24px; margin-bottom: 24px; }
        .sec-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
        .sec-head h3 { font-size: 16px; font-weight: 800; color: var(--navy-dark); }
        .course-item { display: flex; justify-content: space-between; align-items: center; padding: 14px; background: #f8fafc; border-radius: 12px; margin-bottom: 10px; }
        .btn { padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 700; text-decoration: none; cursor: pointer; display: inline-block; }
        .btn-orange { background: var(--orange-accent); color: #fff; }
        .btn-blue { background: var(--blue-royal); color: #fff; }
        .progress-bar { width: 120px; background: #e2e8f0; height: 6px; border-radius: 10px; overflow: hidden; margin-top: 6px; }
        .progress-fill { background: var(--blue-royal); height: 100%; }
        @media(max-width: 900px) { body { flex-direction: column; } .sidebar { width: 100%; } .kpi-grid { grid-template-columns: 1fr 1fr; } .content { padding: 20px; } }
    </style>
</head>
<body>

<aside class="sidebar">
    <div>
        <div class="side-head">
            <a href="../index.php" class="logo-txt">DEVGENIUS <span>ACADEMY</span></a>
            <div class="user-tag">
                <strong><?php echo e($user['full_name']); ?></strong><br>
                <span style="color:#94a3b8; font-size:11px;"><?php echo e($user['email']); ?></span>
            </div>
        </div>

        <nav class="side-nav">
            <a href="dashboard.php" class="active"><span>Overview</span></a>
            <a href="../courses.php"><span>Browse Courses</span></a>
            <a href="dashboard.php#my-courses"><span>My Courses (<?php echo count($enrolledCourses); ?>)</span></a>
            <a href="dashboard.php#assignments"><span>Assignments (<?php echo count($assignments); ?>)</span></a>
            <a href="dashboard.php#results"><span>My Results (<?php echo $gradedCount; ?>)</span></a>
        </nav>
    </div>

    <div>
        <a href="../logout.php" style="color:#f87171; font-size:12px; font-weight:700; text-decoration:none; display:block; padding:10px 14px;">Sign Out →</a>
    </div>
</aside>

<main class="content">
    <div class="greeting-card">
        <span style="font-size:11px; font-weight:800; color:var(--orange-accent); text-transform:uppercase; letter-spacing:1px;">Student Academic Portal</span>
        <h1 style="font-size:26px; font-weight:800; margin-top:4px;">Welcome back, <?php echo e($user['full_name']); ?>!</h1>
        <p style="font-size:13px; color:#bfdbfe; margin-top:6px; max-width:600px;">
            Track your course progress, download learning modules, and submit assignments for grading.
        </p>
    </div>

    <!-- 4 KPIs -->
    <div class="kpi-grid">
        <div class="kpi-card">
            <div class="lbl">Enrolled Courses</div>
            <div class="num"><?php echo count($enrolledCourses); ?></div>
        </div>
        <div class="kpi-card">
            <div class="lbl">Course Assignments</div>
            <div class="num"><?php echo count($assignments); ?></div>
        </div>
        <div class="kpi-card">
            <div class="lbl">Pending Review</div>
            <div class="num" style="color:var(--orange-accent);"><?php echo $pendingCount; ?></div>
        </div>
        <div class="kpi-card">
            <div class="lbl">Graded & Completed</div>
            <div class="num" style="color:#16a34a;"><?php echo $gradedCount; ?></div>
        </div>
    </div>

    <!-- Enrolled Courses -->
    <div class="sec-card" id="my-courses">
        <div class="sec-head">
            <h3>My Enrolled Tracks</h3>
            <a href="../courses.php" class="btn btn-blue">+ Enrol in More</a>
        </div>

        <?php if (empty($enrolledCourses)): ?>
            <p style="font-size:13px; color:#64748b; padding:20px 0;">You have not enrolled in any courses yet. <a href="../courses.php" style="color:var(--blue-royal); font-weight:700;">Explore Courses Catalog</a>.</p>
        <?php else: ?>
            <?php foreach ($enrolledCourses as $course): ?>
                <div class="course-item">
                    <div>
                        <strong style="font-size:14px; color:var(--navy-dark);"><?php echo e($course['title']); ?></strong>
                        <div style="font-size:11px; color:#64748b; margin-top:2px;">
                            Instructor: <?php echo e($course['instructor_name'] ?? 'Faculty'); ?> • <?php echo (int)$course['duration_weeks']; ?> Weeks
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: <?php echo (int)$course['progress_percentage']; ?>%;"></div>
                        </div>
                    </div>
                    <span style="font-size:12px; font-weight:700; color:var(--blue-royal);">
                        <?php echo (int)$course['progress_percentage']; ?>% Progress
                    </span>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>

    <!-- Submissions & Results -->
    <div class="sec-card" id="results">
        <div class="sec-head">
            <h3>Recent Assignment Status & Grades</h3>
        </div>

        <?php if (empty($submissions)): ?>
            <p style="font-size:13px; color:#64748b; padding:10px 0;">No assignments submitted yet.</p>
        <?php else: ?>
            <?php foreach ($submissions as $sub): ?>
                <div class="course-item">
                    <div>
                        <strong style="font-size:13px;"><?php echo e($sub['assignment_title']); ?></strong>
                        <div style="font-size:11px; color:#64748b;">
                            Course: <?php echo e($sub['course_title']); ?> • Submitted on <?php echo e($sub['submitted_at']); ?>
                        </div>
                        <?php if ($sub['status'] === 'graded' && !empty($sub['feedback'])): ?>
                            <div style="font-size:11px; background:#eff6ff; color:#1e40af; padding:8px 12px; border-radius:8px; margin-top:8px;">
                                <strong>Instructor Feedback:</strong> "<?php echo e($sub['feedback']); ?>"
                            </div>
                        <?php endif; ?>
                    </div>
                    <div>
                        <?php if ($sub['status'] === 'graded'): ?>
                            <span style="background:#dcfce7; color:#16a34a; padding:6px 12px; border-radius:20px; font-size:12px; font-weight:800;">
                                Score: <?php echo (int)$sub['score']; ?>/100
                            </span>
                        <?php else: ?>
                            <span style="background:#fef3c7; color:#92400e; padding:6px 12px; border-radius:20px; font-size:12px; font-weight:700;">
                                Pending Review
                            </span>
                        <?php endif; ?>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>
</main>

</body>
</html>
