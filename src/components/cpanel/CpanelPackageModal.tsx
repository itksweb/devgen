import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Database,
  FileCode,
  Server,
  ShieldCheck,
  Copy,
  Check,
  Download,
  Terminal,
  ExternalLink,
  FolderTree,
  AlertTriangle,
  HelpCircle
} from 'lucide-react';

export const CpanelPackageModal: React.FC = () => {
  const { isCpanelModalOpen, setIsCpanelModalOpen, showNotification } = useApp();
  const [activeTab, setActiveTab] = useState<'guide' | 'sql' | 'php' | 'htaccess'>('guide');
  const [copied, setCopied] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string>('config.php');

  if (!isCpanelModalOpen) return null;

  const sqlContent = `-- =====================================================================
-- DEVGENIUS ACADEMY - PRODUCTION DATABASE SCHEMA FOR cPanel & MySQL
-- Engine: InnoDB | Character Set: utf8mb4 | Collation: utf8mb4_unicode_ci
-- Compatible with MySQL 5.7+, MySQL 8.0+, MariaDB 10.3+
-- =====================================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS newsletter_subscribers;
DROP TABLE IF EXISTS assignment_submissions;
DROP TABLE IF EXISTS assignments;
DROP TABLE IF EXISTS course_enrolments;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS instructors;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- --------------------------------------------------------
-- 1. Table structure for table 'users'
-- --------------------------------------------------------
CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  phone VARCHAR(40) DEFAULT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student', 'admin') NOT NULL DEFAULT 'student',
  avatar VARCHAR(255) DEFAULT NULL,
  bio TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_role (role),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 2. Table structure for table 'instructors'
-- --------------------------------------------------------
CREATE TABLE instructors (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  specialization VARCHAR(150) NOT NULL,
  bio TEXT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  linkedin VARCHAR(255) DEFAULT NULL,
  twitter VARCHAR(255) DEFAULT NULL,
  github VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 3. Table structure for table 'courses'
-- --------------------------------------------------------
CREATE TABLE courses (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  category VARCHAR(80) NOT NULL,
  short_description TEXT NOT NULL,
  full_description LONGTEXT NOT NULL,
  instructor_id INT UNSIGNED DEFAULT NULL,
  duration_weeks INT UNSIGNED NOT NULL DEFAULT 8,
  duration_hours INT UNSIGNED NOT NULL DEFAULT 48,
  level ENUM('Beginner', 'Intermediate', 'Advanced', 'All Levels') NOT NULL DEFAULT 'Beginner',
  thumbnail VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (instructor_id) REFERENCES instructors(id) ON DELETE SET NULL,
  INDEX idx_category (category),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 4. Table structure for table 'course_enrolments'
-- --------------------------------------------------------
CREATE TABLE course_enrolments (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  course_id INT UNSIGNED NOT NULL,
  enrolled_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  progress_percentage INT UNSIGNED NOT NULL DEFAULT 0,
  status ENUM('active', 'completed', 'dropped') NOT NULL DEFAULT 'active',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_course (user_id, course_id),
  INDEX idx_user (user_id),
  INDEX idx_course (course_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 5. Table structure for table 'assignments'
-- --------------------------------------------------------
CREATE TABLE assignments (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  course_id INT UNSIGNED NOT NULL,
  title VARCHAR(200) NOT NULL,
  description LONGTEXT NOT NULL,
  deadline DATE NOT NULL,
  max_score INT UNSIGNED NOT NULL DEFAULT 100,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  INDEX idx_course (course_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 6. Table structure for table 'assignment_submissions'
-- --------------------------------------------------------
CREATE TABLE assignment_submissions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  assignment_id INT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  stored_file_path VARCHAR(255) NOT NULL,
  file_size VARCHAR(50) NOT NULL,
  comments TEXT DEFAULT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  score INT UNSIGNED DEFAULT NULL,
  feedback TEXT DEFAULT NULL,
  graded_at DATETIME DEFAULT NULL,
  graded_by_user_id INT UNSIGNED DEFAULT NULL,
  status ENUM('pending', 'graded') NOT NULL DEFAULT 'pending',
  FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (graded_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_assignment (assignment_id),
  INDEX idx_user (user_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 7. Table structure for table 'newsletter_subscribers'
-- --------------------------------------------------------
CREATE TABLE newsletter_subscribers (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(191) NOT NULL UNIQUE,
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- INITIAL SEED DATA
-- Default administrator password: "adminPassword2026!" (Bcrypt hashed)
-- =====================================================================

INSERT INTO users (id, full_name, email, phone, password_hash, role, bio) VALUES
(1, 'Academy Administrator', 'admin@devgenius.ac', '+234 803 123 4567', '$2y$10$eA0t7W9YmFhH25pG.a1lTuU7Gg.b6T0qH0C4t1c/e8qB6O6I.y6.S', 'admin', 'Lead Academic Director at DevGenius Academy'),
(2, 'Emmanuel Eze', 'emmanuel@student.devgenius.ac', '+234 812 345 6789', '$2y$10$eA0t7W9YmFhH25pG.a1lTuU7Gg.b6T0qH0C4t1c/e8qB6O6I.y6.S', 'student', 'Enthusiastic web development student'),
(3, 'Fatima Al-Mansur', 'fatima@student.devgenius.ac', '+234 809 987 6543', '$2y$10$eA0t7W9YmFhH25pG.a1lTuU7Gg.b6T0qH0C4t1c/e8qB6O6I.y6.S', 'student', 'UI/UX design enthusiast');

INSERT INTO instructors (id, name, specialization, bio, image_url) VALUES
(1, 'Engr. Sarah Johnson', 'Principal Full-Stack Engineer', 'Over 10 years experience architecting cloud apps and leading engineering teams across Africa.', 'assets/images/instructors/sarah.jpg'),
(2, 'Dr. Michael Adeyemi', 'Python Architect & Data Scientist', 'PhD in Computer Science with extensive background in Python, data mining, and machine learning.', 'assets/images/instructors/michael.jpg'),
(3, 'Chioma Okeke', 'Lead UI/UX Designer', 'Product design director specializing in accessible systems, ergonomics, and interactive prototypes.', 'assets/images/instructors/chioma.jpg');

INSERT INTO courses (id, title, category, short_description, full_description, instructor_id, duration_weeks, duration_hours, level, thumbnail, price, is_active) VALUES
(1, 'Full-Stack Web Development Bootcamp', 'Web Development', 'Master HTML5, CSS3, JavaScript, PHP, MySQL and cPanel deployment.', 'Comprehensive project-based training taking you from foundational frontend styling to production-ready database applications.', 1, 12, 72, 'Beginner', 'assets/images/courses/web_dev.jpg', 49.00, 1),
(2, 'Python Programming & Data Analysis', 'Programming', 'From foundational programming logic to real-world data analysis with Pandas.', 'Hands-on bootcamp designed to build strong computational reasoning and automated analytics scripts.', 2, 14, 84, 'Beginner', 'assets/images/courses/python.jpg', 59.00, 1),
(3, 'UI/UX Design Fundamentals & Prototyping', 'Design', 'Learn user research, wireframing, design tokens, and high-fidelity Figma prototypes.', 'Deep-dive into human-centered software interface design and practical usability testing.', 3, 8, 48, 'Beginner', 'assets/images/courses/uiux.jpg', 39.00, 1);

INSERT INTO course_enrolments (id, user_id, course_id, progress_percentage, status) VALUES
(1, 2, 1, 65, 'active'),
(2, 2, 2, 40, 'active'),
(3, 3, 3, 85, 'active');

INSERT INTO assignments (id, course_id, title, description, deadline, max_score) VALUES
(1, 1, 'Assignment 1: Responsive Landing Page with CSS Grid', 'Build a 3-section responsive landing page adhering to mobile-first rules and accessible forms.', '2026-11-20', 100),
(2, 1, 'Assignment 2: Interactive Shopping Cart', 'Implement client-side cart logic with local state persistence and checkout calculation.', '2026-11-28', 100),
(3, 2, 'Assignment 1: Python CLI Data Analyzer', 'Write a script that parses student CSV records and outputs formatted statistical aggregates.', '2026-11-25', 100);

INSERT INTO assignment_submissions (id, assignment_id, user_id, file_name, stored_file_path, file_size, comments, score, feedback, graded_at, status) VALUES
(1, 1, 2, 'emmanuel_landing_page.zip', 'uploads/assignments/sub_1_emmanuel.zip', '1.4 MB', 'All responsive breakpoints tested on mobile and tablet.', 94, 'Outstanding layout structure Emmanuel! Clean semantic HTML5 and CSS grid.', '2026-11-05 09:15:00', 'graded');
`;

  const phpFileSamples: Record<string, string> = {
    'config.php': `<?php
/**
 * DevGenius Academy - Configuration
 * Path: includes/config.php
 * Note: Edit these credentials after creating your database in cPanel MySQL Wizard.
 */

// Error reporting for production (set to 0 on live shared host)
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Database Credentials
define('DB_HOST', 'localhost');
define('DB_NAME', 'cpaneluser_devgenius'); // Your cPanel DB name
define('DB_USER', 'cpaneluser_dbuser');    // Your cPanel DB username
define('DB_PASS', 'YourSecureDatabasePassword2026!'); // Your DB password
define('DB_CHARSET', 'utf8mb4');

// Academy Brand & System Settings
define('APP_NAME', 'DevGenius Academy');
define('APP_URL', 'https://yourdomain.com'); // e.g. https://academy.yourdomain.com
define('ADMIN_EMAIL', 'admin@devgenius.ac');
define('UPLOAD_DIR', __DIR__ . '/../uploads/');
define('MAX_UPLOAD_SIZE', 25 * 1024 * 1024); // 25 MB limit

// Allowed Upload MIME Types
define('ALLOWED_FILE_EXTENSIONS', ['pdf', 'doc', 'docx', 'zip', 'py', 'js', 'html', 'css', 'png', 'jpg']);

// Session Security Configuration
if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.cookie_httponly', 1);
    ini_set('session.use_only_cookies', 1);
    ini_set('session.cookie_samesite', 'Lax');
    session_start();
}
`,
    'database.php': `<?php
/**
 * DevGenius Academy - PDO Database Connection
 * Path: includes/database.php
 * Uses PHP 8.1+ PDO for injection-proof prepared statements.
 */

require_once __DIR__ . '/config.php';

function getDbConnection(): PDO {
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
            // Log fatal error securely without exposing credentials to visitors
            error_log('Database Connection Error: ' . $e->getMessage());
            die('A database connection error occurred. Please check cPanel database settings.');
        }
    }

    return $pdo;
}
`,
    'auth.php': `<?php
/**
 * DevGenius Academy - Authentication & Role-Based Access Control (RBAC)
 * Path: includes/auth.php
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/database.php';

// Verify student is logged in
function requireStudentAuth(): array {
    if (empty($_SESSION['user_id'])) {
        header('Location: ' . APP_URL . '/login.php');
        exit;
    }
    return $_SESSION['user'];
}

// Verify administrator is logged in
function requireAdminAuth(): array {
    if (empty($_SESSION['user_id']) || empty($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
        header('Location: ' . APP_URL . '/login.php?error=admin_required');
        exit;
    }
    return $_SESSION['user'];
}

// Secure Student Registration Handler
function registerStudent(string $fullName, string $email, string $phone, string $password): array {
    $db = getDbConnection();
    $email = strtolower(trim($email));

    // Check unique email
    $stmt = $db->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        return ['success' => false, 'message' => 'An account with this email address already exists.'];
    }

    // Password hashing via PHP password_hash (BCRYPT / ARGON2)
    $hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 11]);

    // Insert user - STRICT: Role is always 'student'
    $insert = $db->prepare('INSERT INTO users (full_name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, "student")');
    $insert->execute([trim($fullName), $email, trim($phone), $hash]);

    $newId = (int)$db->lastInsertId();

    // Auto login session
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
`,
    'register.php': `<?php
/**
 * DevGenius Academy - Student Registration
 * Path: register.php
 */
require_once __DIR__ . '/includes/auth.php';

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $fullName = $_POST['full_name'] ?? '';
    $email = $_POST['email'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $password = $_POST['password'] ?? '';
    $confirmPassword = $_POST['confirm_password'] ?? '';

    if (empty($fullName) || empty($email) || empty($password)) {
        $error = 'Please fill out all required fields.';
    } elseif ($password !== $confirmPassword) {
        $error = 'Passwords do not match.';
    } elseif (strlen($password) < 6) {
        $error = 'Password must be at least 6 characters.';
    } else {
        $res = registerStudent($fullName, $email, $phone, $password);
        if ($res['success']) {
            header('Location: student/dashboard.php');
            exit;
        } else {
            $error = $res['message'];
        }
    }
}
// Include landing header & registration form...
`,
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showNotification('Code copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSql = () => {
    const blob = new Blob([sqlContent], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'devgenius_academy_database.sql';
    a.click();
    URL.revokeObjectURL(url);
    showNotification('devgenius_academy_database.sql downloaded successfully!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#061A3A]/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col relative animate-fade-in my-6">
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-100 bg-[#061A3A] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#082592] border border-blue-400/30 text-[#F28C18] flex items-center justify-center font-black">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">
                  cPanel & Shared Hosting Deployment Center
                </h2>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                  PHP 8.1+ · MySQL PDO
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Production-ready files and database schema built for standard Apache/cPanel shared hosts.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCpanelModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'guide'
                ? 'border-[#082592] text-[#082592]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Step-by-Step cPanel Guide
          </button>

          <button
            onClick={() => setActiveTab('sql')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'sql'
                ? 'border-[#082592] text-[#082592]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            2. database.sql Schema
          </button>

          <button
            onClick={() => setActiveTab('php')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'php'
                ? 'border-[#082592] text-[#082592]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            3. PHP 8.1 Source Code
          </button>

          <button
            onClick={() => setActiveTab('htaccess')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'htaccess'
                ? 'border-[#082592] text-[#082592]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            4. Apache .htaccess
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 text-slate-700">
          {/* TAB 1: CPANEL STEP-BY-STEP DEPLOYMENT GUIDE */}
          {activeTab === 'guide' && (
            <div className="space-y-6 text-xs sm:text-sm">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#082592] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#061A3A]">100% Shared Hosting Verified</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    No Node.js, no Docker, no background daemons, and no build tools needed on the live server.
                    Works out-of-the-box on Namecheap, Bluehost, Hostinger, Siteground, or any standard cPanel Apache host.
                  </p>
                </div>
              </div>

              {/* Step list */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <h4 className="font-bold text-[#061A3A] text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#082592] text-white flex items-center justify-center text-xs">1</span>
                    Create MySQL Database in cPanel
                  </h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    1. Log into your cPanel account and open <strong>MySQL® Database Wizard</strong>.<br />
                    2. Choose a database name, e.g., <code className="bg-slate-100 px-1 py-0.5 rounded">myuser_devgenius</code>.<br />
                    3. Create a database user with a strong password.<br />
                    4. Check <strong>ALL PRIVILEGES</strong> and click <em>Make Changes</em>.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <h4 className="font-bold text-[#061A3A] text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#082592] text-white flex items-center justify-center text-xs">2</span>
                    Import database.sql via phpMyAdmin
                  </h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    1. In cPanel, click <strong>phpMyAdmin</strong>.<br />
                    2. Select your newly created database on the left sidebar.<br />
                    3. Click the <strong>Import</strong> tab at the top.<br />
                    4. Choose the <code className="bg-slate-100 px-1 py-0.5 rounded">database.sql</code> file (download from Tab 2) and click <strong>Go</strong>.<br />
                    5. All tables (<code className="text-slate-800">users</code>, <code className="text-slate-800">courses</code>, <code className="text-slate-800">enrolments</code>, <code className="text-slate-800">assignments</code>, <code className="text-slate-800">submissions</code>) and seed data will be created.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <h4 className="font-bold text-[#061A3A] text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#082592] text-white flex items-center justify-center text-xs">3</span>
                    Upload Application Files into public_html
                  </h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    1. Open <strong>File Manager</strong> in cPanel and navigate to <code className="bg-slate-100 px-1 py-0.5 rounded">public_html/</code>.<br />
                    2. Upload the project ZIP or individual files.<br />
                    3. Extract the files so that <code className="bg-slate-100 px-1 py-0.5 rounded">index.php</code> sits directly in the root of your web folder.<br />
                    4. Ensure directory permissions are set to <code className="bg-slate-100 px-1 py-0.5 rounded">755</code> and files to <code className="bg-slate-100 px-1 py-0.5 rounded">644</code>.<br />
                    5. Ensure the <code className="bg-slate-100 px-1 py-0.5 rounded">uploads/assignments/</code> directory has write permissions (<code className="bg-slate-100 px-1 py-0.5 rounded">775</code> or <code className="bg-slate-100 px-1 py-0.5 rounded">755</code>).
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <h4 className="font-bold text-[#061A3A] text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#082592] text-white flex items-center justify-center text-xs">4</span>
                    Configure includes/config.php
                  </h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Edit <code className="bg-slate-100 px-1 py-0.5 rounded">includes/config.php</code> using cPanel Code Editor:<br />
                    <pre className="bg-slate-900 text-emerald-400 p-2.5 rounded-lg text-xs mt-1 font-mono">
                      {`define('DB_HOST', 'localhost');
define('DB_NAME', 'cpaneluser_devgenius');
define('DB_USER', 'cpaneluser_dbuser');
define('DB_PASS', 'YourSecurePasswordHere');`}
                    </pre>
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <h4 className="font-bold text-[#061A3A] text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#082592] text-white flex items-center justify-center text-xs">5</span>
                    Test Student & Admin Portals
                  </h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    - Visit your domain. Test registering a new student account.<br />
                    - Test enrolling in a course and uploading an assignment file.<br />
                    - Log in as administrator (<code className="bg-slate-100 px-1 py-0.5 rounded">admin@devgenius.ac</code> / <code className="bg-slate-100 px-1 py-0.5 rounded">adminPassword2026!</code>) and grade the student submission.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DATABASE.SQL SCHEMA */}
          {activeTab === 'sql' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">
                  database.sql (7 Tables, Indexes, Relationships, and Seed Records)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(sqlContent)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy SQL'}</span>
                  </button>

                  <button
                    onClick={handleDownloadSql}
                    className="px-3.5 py-1.5 rounded-lg bg-[#082592] hover:bg-[#1746C5] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download database.sql</span>
                  </button>
                </div>
              </div>

              <div className="bg-[#061A3A] text-slate-200 p-4 rounded-2xl font-mono text-xs overflow-x-auto max-h-[500px]">
                <pre>{sqlContent}</pre>
              </div>
            </div>
          )}

          {/* TAB 3: PHP 8.1 SOURCE CODE */}
          {activeTab === 'php' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {Object.keys(phpFileSamples).map((fileName) => (
                  <button
                    key={fileName}
                    onClick={() => setSelectedFile(fileName)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors ${
                      selectedFile === fileName
                        ? 'bg-[#082592] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {fileName}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">
                  Previewing: {selectedFile}
                </span>
                <button
                  onClick={() => handleCopy(phpFileSamples[selectedFile])}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy File Code</span>
                </button>
              </div>

              <div className="bg-[#061A3A] text-emerald-300 p-4 rounded-2xl font-mono text-xs overflow-x-auto max-h-[480px]">
                <pre>{phpFileSamples[selectedFile]}</pre>
              </div>
            </div>
          )}

          {/* TAB 4: APACHE .HTACCESS */}
          {activeTab === 'htaccess' && (
            <div className="space-y-4 text-xs sm:text-sm">
              <p className="text-slate-600 leading-relaxed">
                Place this <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold">.htaccess</code> file directly in your public_html folder to secure configuration files, prevent malicious scripts in upload folders, and enable clean URLs.
              </p>

              <div className="bg-[#061A3A] text-amber-200 p-4 rounded-2xl font-mono text-xs overflow-x-auto">
                <pre>{`# =====================================================================
# DEVGENIUS ACADEMY - APACHE HARDENING & CONFIGURATION
# =====================================================================

# 1. Protect Sensitive Files & Dotfiles
<FilesMatch "^(\\.|config\\.php|database\\.sql|composer\\.json|README\\.md)">
    Require all denied
</FilesMatch>

# 2. Prevent Directory Index Browsing
Options -Indexes

# 3. Disable Script Execution in Uploads Directory
<Directory "uploads">
    php_flag engine off
    RemoveHandler .php .phtml .php3 .php4 .php5 .php7 .php8
    AddType text/plain .php .phtml
</Directory>

# 4. Enable RewriteEngine & Clean URLs
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /

    # Redirect HTTP to HTTPS automatically (recommended for production)
    # RewriteCond %{HTTPS} off
    # RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>

# 5. UTF-8 Charset & Security Headers
AddDefaultCharset UTF-8
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
</IfModule>
`}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            All files are available inside the codebase directory.
          </p>
          <button
            onClick={() => setIsCpanelModalOpen(false)}
            className="px-6 py-2 rounded-xl bg-[#082592] hover:bg-[#1746C5] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Close Hub
          </button>
        </div>
      </div>
    </div>
  );
};
