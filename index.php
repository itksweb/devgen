<?php
/**
 * DevGenius Academy - Public Landing Page
 * Path: index.php
 * Fully compatible with cPanel, DirectAdmin, and standard Apache shared hosting.
 */

// If database is not yet configured, provide helpful redirect to install.php
if (!file_exists(__DIR__ . '/includes/config.php') || !file_exists(__DIR__ . '/install.lock')) {
    if (file_exists(__DIR__ . '/install.php') && !file_exists(__DIR__ . '/install.lock')) {
        header('Location: install.php');
        exit;
    }
}

require_once __DIR__ . '/includes/config.php';
require_once __DIR__ . '/includes/database.php';
require_once __DIR__ . '/includes/functions.php';
require_once __DIR__ . '/includes/auth.php';

$stats = [
    'total_students' => 0,
    'total_courses' => 0,
    'total_enrolments' => 0,
    'total_graded' => 0
];
$featuredCourses = [];

try {
    $stats = getPlatformStats();
    $featuredCourses = getActiveCourses(6);
} catch (Exception $e) {
    // If DB is offline, continue gracefully with clean fallback figures
    error_log('Notice: DB query failed on index.php: ' . $e->getMessage());
}

$currentUser = getCurrentUser();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DevGenius Academy - Build Your Future With Practical Tech Skills</title>
    <meta name="description" content="DevGenius Academy is a modern e-learning academy offering practical, career-ready tech training in Web Development, Python, UI/UX Design, and more.">
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css">
    <style>
        :root {
            --navy-dark: #061A3A;
            --blue-royal: #082592;
            --blue-bright: #1746C5;
            --orange-accent: #F28C18;
            --blue-pale: #F2F6FF;
            --text-dark: #17233C;
            --text-muted: #6B7280;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; color: var(--text-dark); background: #ffffff; line-height: 1.5; }
        a { text-decoration: none; color: inherit; }
        .max-w-7xl { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
        .top-bar { background: var(--navy-dark); color: #cbd5e1; font-size: 12px; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .top-bar .flex-between { display: flex; justify-content: space-between; align-items: center; }
        .nav-bar { background: #ffffff; padding: 14px 0; border-bottom: 1px solid #f1f5f9; position: sticky; top: 0; z-index: 50; }
        .nav-inner { display: flex; justify-content: space-between; align-items: center; }
        .logo-wrap { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 18px; color: var(--navy-dark); }
        .logo-badge { width: 36px; height: 36px; background: var(--blue-royal); color: #fff; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; position: relative; }
        .logo-badge::after { content: 'G'; position: absolute; bottom: -3px; right: -3px; width: 14px; height: 14px; background: var(--orange-accent); border: 2px solid #fff; border-radius: 50%; font-size: 8px; font-weight: 800; display: flex; align-items: center; justify-content: center; }
        .nav-links { display: flex; gap: 28px; font-size: 14px; font-weight: 600; }
        .nav-links a:hover { color: var(--blue-royal); }
        .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 20px; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; transition: 0.2s; border: none; }
        .btn-orange { background: var(--orange-accent); color: #fff; }
        .btn-orange:hover { background: #d97706; }
        .btn-blue { background: var(--blue-royal); color: #fff; }
        .btn-blue:hover { background: var(--blue-bright); }
        .hero { background: var(--blue-pale); padding: 70px 0; border-bottom: 1px solid #dbeafe; }
        .hero-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 40px; align-items: center; }
        .hero h1 { font-size: 46px; font-weight: 800; color: var(--navy-dark); line-height: 1.15; margin-bottom: 16px; }
        .hero h1 span { color: var(--blue-royal); }
        .hero p { font-size: 16px; color: var(--text-muted); margin-bottom: 24px; max-width: 540px; }
        .hero-img-box { position: relative; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(6, 26, 58, 0.15); border: 4px solid #fff; background: #fff; }
        .hero-img-box img { width: 100%; height: auto; display: block; aspect-ratio: 4/3; object-fit: cover; }
        .stat-badge { position: absolute; background: rgba(255,255,255,0.95); padding: 12px 18px; border-radius: 14px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); display: flex; align-items: center; gap: 12px; }
        .stat-badge.top-left { top: -10px; left: -10px; }
        .stat-badge.bottom-right { bottom: -10px; right: -10px; }
        .stats-strip { background: var(--blue-royal); color: #fff; padding: 40px 0; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; text-align: center; }
        .stats-grid .num { font-size: 36px; font-weight: 800; }
        .stats-grid .lbl { font-size: 13px; color: #bfdbfe; font-weight: 600; margin-top: 4px; }
        .section-title { text-align: center; margin-bottom: 40px; }
        .section-title span { color: var(--orange-accent); font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; }
        .section-title h2 { font-size: 32px; font-weight: 800; color: var(--navy-dark); margin-top: 6px; }
        .courses-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-bottom: 40px; }
        .course-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.03); display: flex; flex-direction: column; }
        .course-card img { width: 100%; aspect-ratio: 16/10; object-fit: cover; }
        .course-card .body { padding: 20px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
        .course-card h3 { font-size: 16px; font-weight: 700; color: var(--navy-dark); margin: 8px 0; }
        .course-card p { font-size: 12px; color: var(--text-muted); line-height: 1.5; }
        .course-card .meta { display: flex; justify-content: space-between; font-size: 11px; color: #94a3b8; font-weight: 600; margin-bottom: 6px; }
        .course-card .foot { display: flex; justify-content: space-between; align-items: center; margin-top: 16px; padding-top: 12px; border-top: 1px solid #f1f5f9; }
        .footer { background: var(--navy-dark); color: #cbd5e1; padding: 60px 0 24px 0; font-size: 13px; margin-top: 60px; }
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 40px; }
        .footer h4 { color: var(--orange-accent); font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
        .footer ul { list-style: none; }
        .footer ul li { margin-bottom: 10px; }
        .footer a:hover { color: #fff; }
        @media(max-width: 900px) {
            .hero-grid, .courses-grid, .footer-grid { grid-template-columns: 1fr; }
            .stats-grid { grid-template-columns: 1fr 1fr; }
            .nav-links { display: none; }
        }
    </style>
</head>
<body>

<!-- 1. Top Bar -->
<div class="top-bar">
    <div class="max-w-7xl flex-between">
        <div>
            <span>admissions@devgenius.ac</span>
            <span style="margin: 0 10px; opacity:0.3;">|</span>
            <span>+234 812 345 6789</span>
        </div>
        <div>
            <span>DirectAdmin & cPanel Shared Hosting Verified</span>
        </div>
    </div>
</div>

<!-- 2. Main Navigation -->
<nav class="nav-bar">
    <div class="max-w-7xl nav-inner">
        <a href="index.php" class="logo-wrap">
            <div class="logo-badge">DG</div>
            <div>
                DEVGENIUS
                <span style="font-size:9px; color:var(--orange-accent); display:block; letter-spacing:2px;">ACADEMY</span>
            </div>
        </a>

        <div class="nav-links">
            <a href="index.php">Home</a>
            <a href="courses.php">Courses</a>
            <a href="#why-us">About Us</a>
            <a href="#faq">FAQ</a>
            <a href="contact.php">Contact</a>
        </div>

        <div>
            <?php if ($currentUser): ?>
                <a href="<?php echo $currentUser['role'] === 'admin' ? 'admin/dashboard.php' : 'student/dashboard.php'; ?>" class="btn btn-blue">
                    <?php echo $currentUser['role'] === 'admin' ? 'Admin Portal' : 'Student Portal'; ?>
                </a>
                <a href="logout.php" class="btn" style="background:#f1f5f9; color:#475569; margin-left:8px;">Logout</a>
            <?php else: ?>
                <a href="login.php" class="btn" style="background:#f1f5f9; color:#17233C;">Login</a>
                <a href="register.php" class="btn btn-orange">Get Started</a>
            <?php endif; ?>
        </div>
    </div>
</nav>

<!-- 3. Hero Section -->
<section class="hero">
    <div class="max-w-7xl hero-grid">
        <div>
            <div style="display:inline-block; background:rgba(8,37,146,0.1); color:var(--blue-royal); padding:6px 14px; border-radius:20px; font-size:11px; font-weight:800; text-transform:uppercase; margin-bottom:14px;">
                • Accredited Tech Academy •
            </div>
            <h1>BUILD YOUR FUTURE WITH <span>DEVGENIUS ACADEMY</span></h1>
            <p>
                Gain practical digital skills, learn from experienced instructors, and develop the expertise you need to succeed in today's technology-driven world.
            </p>
            <div style="display:flex; gap:14px;">
                <a href="courses.php" class="btn btn-blue" style="padding:12px 24px; font-size:14px;">Explore Courses →</a>
                <a href="register.php" class="btn btn-orange" style="padding:12px 24px; font-size:14px;">Create Free Account</a>
            </div>
        </div>

        <div style="position:relative;">
            <div class="hero-img-box">
                <img src="public/assets/aistudio/E-Learning_Website_Design_Inspiration___Online_Course_Landing_Page_UI_Template_09b3b26a.jpg" alt="DevGenius Academy Student">
            </div>
            <div class="stat-badge top-left">
                <div style="font-weight:800; color:var(--navy-dark); font-size:16px;">20K+</div>
                <div style="font-size:11px; color:#64748b;">Community Learners</div>
            </div>
            <div class="stat-badge bottom-right">
                <div style="font-weight:800; color:var(--orange-accent); font-size:16px;">95%</div>
                <div style="font-size:11px; color:#64748b;">Success Rate</div>
            </div>
        </div>
    </div>
</section>

<!-- 4. Dynamic Platform Statistics -->
<section class="stats-strip">
    <div class="max-w-7xl stats-grid">
        <div>
            <div class="num"><?php echo (int)$stats['total_students']; ?></div>
            <div class="lbl">Registered Students (Real)</div>
        </div>
        <div>
            <div class="num"><?php echo (int)$stats['total_courses']; ?></div>
            <div class="lbl">Available Courses</div>
        </div>
        <div>
            <div class="num"><?php echo (int)$stats['total_enrolments']; ?></div>
            <div class="lbl">Total Enrolments</div>
        </div>
        <div>
            <div class="num"><?php echo (int)$stats['total_graded']; ?></div>
            <div class="lbl">Completed Submissions</div>
        </div>
    </div>
</section>

<!-- 5. Featured Courses Section -->
<section style="padding:80px 0;">
    <div class="max-w-7xl">
        <div class="section-title">
            <span>Career Curriculum</span>
            <h2>Explore Our Featured Courses</h2>
            <p style="color:#64748b; font-size:14px; margin-top:4px;">Handcrafted tracks designed to build verified software & design competence.</p>
        </div>

        <div class="courses-grid">
            <?php if (!empty($featuredCourses)): ?>
                <?php foreach ($featuredCourses as $c): ?>
                    <div class="course-card">
                        <img src="<?php echo e($c['thumbnail']); ?>" alt="<?php echo e($c['title']); ?>" onerror="this.src='https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80';">
                        <div class="body">
                            <div>
                                <div class="meta">
                                    <span><?php echo e($c['category']); ?></span>
                                    <span><?php echo (int)$c['duration_weeks']; ?> Weeks</span>
                                </div>
                                <h3><?php echo e($c['title']); ?></h3>
                                <p><?php echo e($c['short_description']); ?></p>
                            </div>
                            <div class="foot">
                                <span style="font-size:12px; font-weight:700; color:var(--blue-royal);">By <?php echo e($c['instructor_name'] ?? 'Faculty Lead'); ?></span>
                                <a href="course-details.php?id=<?php echo (int)$c['id']; ?>" class="btn btn-orange" style="padding:6px 14px; font-size:12px;">Enrol Now</a>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                <div style="grid-column: 1 / -1; text-align:center; padding:40px; background:#f8fafc; border-radius:16px;">
                    <p style="font-weight:700; color:#64748b;">Courses are ready to be seeded from the database.</p>
                    <a href="install.php" style="color:var(--blue-royal); font-weight:700; text-decoration:underline;">Run Installer to populate initial curriculum</a>
                </div>
            <?php endif; ?>
        </div>

        <div style="text-align:center;">
            <a href="courses.php" class="btn btn-blue" style="padding:12px 28px;">View All Courses →</a>
        </div>
    </div>
</section>

<!-- 6. Footer -->
<footer class="footer">
    <div class="max-w-7xl">
        <div class="footer-grid">
            <div>
                <div class="logo-wrap" style="color:#fff; margin-bottom:14px;">
                    <div class="logo-badge">DG</div>
                    <div>DEVGENIUS <span style="color:var(--orange-accent); font-size:9px; letter-spacing:2px; display:block;">ACADEMY</span></div>
                </div>
                <p style="color:#94a3b8; font-size:13px; line-height:1.6; max-width:320px;">
                    DevGenius Academy is a modern e-learning institution empowering learners with practical, career-ready tech skills. Built for cPanel and DirectAdmin shared hosting.
                </p>
            </div>
            <div>
                <h4>Navigation</h4>
                <ul>
                    <li><a href="index.php">Home</a></li>
                    <li><a href="courses.php">Browse Courses</a></li>
                    <li><a href="register.php">Student Registration</a></li>
                    <li><a href="login.php">Student & Admin Login</a></li>
                </ul>
            </div>
            <div>
                <h4>Hosting Stack</h4>
                <ul>
                    <li>PHP 8.1+ PDO</li>
                    <li>MySQL / MariaDB</li>
                    <li>DirectAdmin Ready</li>
                    <li>cPanel Ready</li>
                    <li><a href="install.php" style="color:var(--orange-accent); font-weight:700;">Web Installer</a></li>
                </ul>
            </div>
            <div>
                <h4>Support & Contact</h4>
                <ul>
                    <li>admissions@devgenius.ac</li>
                    <li>+234 812 345 6789</li>
                    <li>Victoria Island, Lagos</li>
                </ul>
            </div>
        </div>
        <div style="border-top:1px solid rgba(255,255,255,0.1); padding-top:20px; display:flex; justify-content:space-between; font-size:12px; color:#94a3b8;">
            <p>© <?php echo date('Y'); ?> DevGenius Academy. All rights reserved.</p>
            <p>DirectAdmin & cPanel Production Ready</p>
        </div>
    </div>
</footer>

</body>
</html>
