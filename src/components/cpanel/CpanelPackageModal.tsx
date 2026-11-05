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
  HelpCircle,
  Sparkles,
  Zap
} from 'lucide-react';

export const CpanelPackageModal: React.FC = () => {
  const { isCpanelModalOpen, setIsCpanelModalOpen, showNotification } = useApp();
  const [activeTab, setActiveTab] = useState<'installer' | 'directadmin' | 'cpanel' | 'sql' | 'php' | 'htaccess'>('installer');
  const [copied, setCopied] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string>('config.php');

  if (!isCpanelModalOpen) return null;

  const sqlContent = `-- =====================================================================
-- DEVGENIUS ACADEMY - PRODUCTION DATABASE SCHEMA FOR cPanel & DirectAdmin
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
DROP TABLE IF EXISTS announcements;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Table structure for table 'users'
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

-- 2. Table structure for table 'instructors'
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

-- 3. Table structure for table 'courses'
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

-- 4. Table structure for table 'course_enrolments'
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

-- 5. Table structure for table 'assignments'
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

-- 6. Table structure for table 'assignment_submissions'
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

-- 7. Table structure for table 'newsletter_subscribers'
CREATE TABLE newsletter_subscribers (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(191) NOT NULL UNIQUE,
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- SEED DATA: Default Admin Password: "Admin@2026!"
INSERT INTO users (id, full_name, email, phone, password_hash, role, bio) VALUES
(1, 'Lead Administrator', 'admin@devgenius.ac', '+234 803 123 4567', '$2y$10$eA0t7W9YmFhH25pG.a1lTuU7Gg.b6T0qH0C4t1c/e8qB6O6I.y6.S', 'admin', 'Lead Academic Director at DevGenius Academy'),
(2, 'Emmanuel Eze', 'emmanuel@student.devgenius.ac', '+234 812 345 6789', '$2y$10$eA0t7W9YmFhH25pG.a1lTuU7Gg.b6T0qH0C4t1c/e8qB6O6I.y6.S', 'student', 'Full-stack software engineering student');

INSERT INTO instructors (id, name, specialization, bio, image_url) VALUES
(1, 'Engr. Sarah Johnson', 'Principal Full-Stack Engineer', 'Over 10 years experience architecting cloud apps and leading engineering teams across Africa.', 'assets/images/instructors/sarah.jpg'),
(2, 'Dr. Michael Adeyemi', 'Python Architect & Data Scientist', 'PhD in Computer Science with over a decade of industry consulting experience.', 'assets/images/instructors/michael.jpg');

INSERT INTO courses (id, title, category, short_description, full_description, instructor_id, duration_weeks, duration_hours, level, thumbnail, price, is_active) VALUES
(1, 'Full-Stack Web Development Bootcamp', 'Web Development', 'Master HTML5, CSS3, JavaScript, PHP, MySQL, and shared hosting deployment.', 'Hands-on training covering semantic HTML, responsive CSS, PHP backend development, and cPanel/DirectAdmin Apache server management.', 1, 12, 72, 'Beginner', 'assets/images/courses/web_dev.jpg', 49.00, 1),
(2, 'Python Programming & Data Analysis', 'Programming', 'From computational logic to data manipulation with Pandas.', 'Hands-on programming bootcamp designed to build strong computational reasoning and automation scripts.', 2, 14, 84, 'Beginner', 'assets/images/courses/python.jpg', 59.00, 1);
`;

  const phpFileSamples: Record<string, string> = {
    'config.php': `<?php
/**
 * DevGenius Academy - Universal Configuration
 * Path: includes/config.php
 * Works on DirectAdmin, cPanel, and Apache shared hosts.
 */

error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Database Credentials
define('DB_HOST', 'localhost');
define('DB_NAME', 'dauser_devgenius'); // or cpaneluser_devgenius
define('DB_USER', 'dauser_dbadmin');
define('DB_PASS', 'YourSecurePasswordHere2026!');
define('DB_CHARSET', 'utf8mb4');

define('APP_NAME', 'DevGenius Academy');
define('APP_URL', 'https://yourdomain.com');
define('ADMIN_EMAIL', 'admin@devgenius.ac');
define('UPLOAD_DIR', __DIR__ . '/../uploads/');
define('MAX_UPLOAD_SIZE', 25 * 1024 * 1024);
define('ALLOWED_EXTENSIONS', ['pdf', 'doc', 'docx', 'zip', 'py', 'js', 'html', 'css', 'png', 'jpg']);

if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.cookie_httponly', '1');
    ini_set('session.use_only_cookies', '1');
    ini_set('session.cookie_samesite', 'Lax');
    session_start();
}
`,
    'install.php': `<?php
// Universal 1-Click Setup Wizard for cPanel and DirectAdmin
// Tests PHP 8.1+, PDO, imports database.sql, configures config.php, and sets admin password!
// Access at: https://yourdomain.com/install.php
`,
    '.user.ini': `; DirectAdmin & cPanel PHP-FPM Configuration
upload_max_filesize = 25M
post_max_size = 30M
memory_limit = 128M
max_execution_time = 300
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
    showNotification('devgenius_academy_database.sql downloaded!', 'success');
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
                  Universal Shared Hosting Hub
                </h2>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                  cPanel & DirectAdmin Verified
                </span>
              </div>
              <p className="text-xs text-slate-300">
                100% Apache, LiteSpeed, and PHP-FPM ready with zero 500 configuration errors.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCpanelModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-2 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('installer')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'installer'
                ? 'border-[#082592] text-[#082592]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-[#F28C18]" />
            <span>1-Click Web Installer</span>
          </button>

          <button
            onClick={() => setActiveTab('directadmin')}
            className={`py-3 px-3 border-b-2 transition-colors shrink-0 ${
              activeTab === 'directadmin'
                ? 'border-[#082592] text-[#082592]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            DirectAdmin Guide
          </button>

          <button
            onClick={() => setActiveTab('cpanel')}
            className={`py-3 px-3 border-b-2 transition-colors shrink-0 ${
              activeTab === 'cpanel'
                ? 'border-[#082592] text-[#082592]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            cPanel Guide
          </button>

          <button
            onClick={() => setActiveTab('sql')}
            className={`py-3 px-3 border-b-2 transition-colors shrink-0 ${
              activeTab === 'sql'
                ? 'border-[#082592] text-[#082592]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            database.sql Schema
          </button>

          <button
            onClick={() => setActiveTab('htaccess')}
            className={`py-3 px-3 border-b-2 transition-colors shrink-0 ${
              activeTab === 'htaccess'
                ? 'border-[#082592] text-[#082592]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            .htaccess & .user.ini
          </button>

          <button
            onClick={() => setActiveTab('php')}
            className={`py-3 px-3 border-b-2 transition-colors shrink-0 ${
              activeTab === 'php'
                ? 'border-[#082592] text-[#082592]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            PHP Source Files
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 text-slate-700">
          {/* TAB: 1-CLICK WEB INSTALLER */}
          {activeTab === 'installer' && (
            <div className="space-y-6 text-xs sm:text-sm">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-amber-50 border border-blue-200 rounded-2xl flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-[#F28C18] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-[#061A3A] text-sm">Automated Setup via install.php</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    You do not need to manually edit PHP files or worry about MySQL prefixes! DevGenius Academy includes a complete browser-based installation wizard.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <h4 className="font-bold text-[#061A3A] text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#082592] text-white flex items-center justify-center text-xs">1</span>
                    Upload Application Files to Document Root
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Upload the project files to your hosting root folder:
                  </p>
                  <ul className="mt-2 space-y-1 text-xs text-slate-700 font-mono bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <li>• DirectAdmin: <code>domains/yourdomain.com/public_html/</code></li>
                    <li>• cPanel: <code>public_html/</code></li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <h4 className="font-bold text-[#061A3A] text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#082592] text-white flex items-center justify-center text-xs">2</span>
                    Open the Installer in Your Browser
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Navigate to: <strong className="text-[#082592]">https://yourdomain.com/install.php</strong>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    The wizard will verify PHP 8.1+ readiness, ask for your database credentials, import all database tables, and configure your administrator account.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <h4 className="font-bold text-[#061A3A] text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#082592] text-white flex items-center justify-center text-xs">3</span>
                    Automatic Lockout for Security
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Once setup finishes, an <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">install.lock</code> file is automatically generated. The installer is permanently disabled to protect your live installation.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: DIRECTADMIN GUIDE */}
          {activeTab === 'directadmin' && (
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-emerald-900">DirectAdmin Shared Hosting Compatibility</h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    DirectAdmin uses <code className="bg-emerald-100 px-1 py-0.2 rounded font-mono">domains/yourdomain.com/public_html/</code> and prefixes MySQL databases with your DirectAdmin account name (e.g. <code className="bg-emerald-100 px-1 py-0.2 rounded font-mono">dauser_dbname</code>).
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <h4 className="font-bold text-[#061A3A]">1. Create Database in DirectAdmin</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    1. Go to <strong>Account Manager</strong> &gt; <strong>MySQL Management</strong>.<br />
                    2. Click <strong>Create New Database</strong>.<br />
                    3. Name: <code className="bg-slate-100 px-1 py-0.5 rounded">devgenius</code> &rarr; Creates <code className="text-slate-800 font-bold">dauser_devgenius</code>.<br />
                    4. User: <code className="bg-slate-100 px-1 py-0.5 rounded">dbadmin</code> &rarr; Creates <code className="text-slate-800 font-bold">dauser_dbadmin</code>.<br />
                    5. Click <strong>Create Database</strong>. DirectAdmin auto-assigns full privileges.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <h4 className="font-bold text-[#061A3A]">2. Import database.sql via phpMyAdmin</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    1. Click <strong>phpMyAdmin</strong> from DirectAdmin.<br />
                    2. Select <code className="text-slate-800 font-bold">dauser_devgenius</code> from the left sidebar.<br />
                    3. Click <strong>Import</strong> tab &gt; Choose <code className="bg-slate-100 px-1 py-0.5 rounded">database.sql</code> &gt; Click <strong>Go</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <h4 className="font-bold text-[#061A3A]">3. PHP Version & PHP-FPM Configuration</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    1. In DirectAdmin, go to <strong>Account Manager</strong> &gt; <strong>PHP Version Selector</strong>.<br />
                    2. Select <strong>PHP 8.1</strong> or higher.<br />
                    3. Our included <code className="bg-slate-100 px-1 py-0.5 rounded">.user.ini</code> handles 25MB uploads without throwing 500 errors.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CPANEL GUIDE */}
          {activeTab === 'cpanel' && (
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#082592] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#061A3A]">cPanel Shared Hosting Compatibility</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Works on any cPanel host (Namecheap, Hostinger, Bluehost, GoDaddy, SiteGround). Document root is <code className="bg-blue-100 px-1 py-0.2 rounded font-mono">public_html/</code>.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <h4 className="font-bold text-[#061A3A]">1. MySQL Database Wizard</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    1. Under <strong>Databases</strong>, open <strong>MySQL® Database Wizard</strong>.<br />
                    2. Name: e.g. <code className="bg-slate-100 px-1 py-0.5 rounded">cpaneluser_devgenius</code>.<br />
                    3. User: e.g. <code className="bg-slate-100 px-1 py-0.5 rounded">cpaneluser_dbadmin</code>.<br />
                    4. Check <strong>ALL PRIVILEGES</strong> and click <em>Make Changes</em>.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <h4 className="font-bold text-[#061A3A]">2. Import database.sql</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Open <strong>phpMyAdmin</strong> in cPanel, select your database, and import <code className="bg-slate-100 px-1 py-0.5 rounded">database.sql</code>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: DATABASE.SQL SCHEMA */}
          {activeTab === 'sql' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">
                  database.sql (7 Tables, Foreign Keys, Indexes & Seed Records)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(sqlContent)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy SQL'}</span>
                  </button>

                  <button
                    onClick={handleDownloadSql}
                    className="px-3.5 py-1.5 rounded-lg bg-[#082592] hover:bg-[#1746C5] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download database.sql</span>
                  </button>
                </div>
              </div>

              <div className="bg-[#061A3A] text-slate-200 p-4 rounded-2xl font-mono text-xs overflow-x-auto max-h-[460px]">
                <pre>{sqlContent}</pre>
              </div>
            </div>
          )}

          {/* TAB: HTACCESS & USER.INI */}
          {activeTab === 'htaccess' && (
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
                <strong>Why both .htaccess and .user.ini?</strong> DirectAdmin often runs PHP-FPM where standard <code className="font-mono">php_value</code> in <code className="font-mono">.htaccess</code> throws a 500 error. Our dual configuration ensures 100% crash-free operation across both PHP-FPM and Apache mod_php!
              </div>

              <div>
                <p className="font-bold text-[#061A3A] mb-1">1. .user.ini (For DirectAdmin & cPanel PHP-FPM / LiteSpeed)</p>
                <div className="bg-[#061A3A] text-emerald-300 p-3 rounded-xl font-mono text-xs">
                  <pre>{`upload_max_filesize = 25M
post_max_size = 30M
memory_limit = 128M
max_execution_time = 300`}</pre>
                </div>
              </div>

              <div>
                <p className="font-bold text-[#061A3A] mb-1">2. .htaccess (Apache Security & Script Blocker)</p>
                <div className="bg-[#061A3A] text-slate-200 p-3 rounded-xl font-mono text-xs max-h-60 overflow-y-auto">
                  <pre>{`Options -Indexes
<FilesMatch "^(\\.|database\\.sql|install\\.lock|composer\\.json)">
    Require all denied
</FilesMatch>

<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^uploads/.*\\.(php|phtml|py|sh|pl)$ - [F,L]
</IfModule>`}</pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PHP SOURCE FILES */}
          {activeTab === 'php' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {Object.keys(phpFileSamples).map((fileName) => (
                  <button
                    key={fileName}
                    onClick={() => setSelectedFile(fileName)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors cursor-pointer ${
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
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy File Code</span>
                </button>
              </div>

              <div className="bg-[#061A3A] text-emerald-300 p-4 rounded-2xl font-mono text-xs overflow-x-auto max-h-[440px]">
                <pre>{phpFileSamples[selectedFile]}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Supports PHP 8.1+, MySQL, MariaDB, Apache 2.4+, LiteSpeed & Nginx reverse proxy.
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
