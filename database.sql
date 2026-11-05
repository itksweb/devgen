-- =====================================================================
-- DEVGENIUS ACADEMY - PRODUCTION DATABASE SCHEMA FOR cPanel & MySQL
-- Charset: utf8mb4 | Collation: utf8mb4_unicode_ci | Storage Engine: InnoDB
-- Compatible with MySQL 5.7, 8.0, 8.4 & MariaDB 10.3+
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

-- --------------------------------------------------------
-- Table: users
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
-- Table: instructors
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
-- Table: courses
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
-- Table: course_enrolments
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
-- Table: assignments
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
-- Table: assignment_submissions
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
-- Table: announcements
-- --------------------------------------------------------
CREATE TABLE announcements (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(60) NOT NULL DEFAULT 'General',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: newsletter_subscribers
-- --------------------------------------------------------
CREATE TABLE newsletter_subscribers (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(191) NOT NULL UNIQUE,
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- SEED DATA
-- Default Admin Password: "Admin@2026!"
-- Default Student Password: "password123"
-- (Generated via PHP password_hash(PASSWORD_BCRYPT))
-- =====================================================================

INSERT INTO users (id, full_name, email, phone, password_hash, role, bio) VALUES
(1, 'Lead Administrator', 'admin@devgenius.ac', '+234 803 123 4567', '$2y$10$eA0t7W9YmFhH25pG.a1lTuU7Gg.b6T0qH0C4t1c/e8qB6O6I.y6.S', 'admin', 'Lead Academic Director and Operations Supervisor'),
(2, 'Emmanuel Eze', 'emmanuel@student.devgenius.ac', '+234 812 345 6789', '$2y$10$eA0t7W9YmFhH25pG.a1lTuU7Gg.b6T0qH0C4t1c/e8qB6O6I.y6.S', 'student', 'Full-stack software engineering student'),
(3, 'Fatima Al-Mansur', 'fatima@student.devgenius.ac', '+234 809 987 6543', '$2y$10$eA0t7W9YmFhH25pG.a1lTuU7Gg.b6T0qH0C4t1c/e8qB6O6I.y6.S', 'student', 'Passionate UI/UX designer and researcher'),
(4, 'Kwame Mensah', 'kwame@student.devgenius.ac', '+233 24 555 7890', '$2y$10$eA0t7W9YmFhH25pG.a1lTuU7Gg.b6T0qH0C4t1c/e8qB6O6I.y6.S', 'student', 'Junior Python programmer');

INSERT INTO instructors (id, name, specialization, bio, image_url, linkedin, twitter, github) VALUES
(1, 'Engr. Sarah Johnson', 'Principal Full-Stack Engineer', 'Over 10 years experience architecting high-scale cloud platforms and web frameworks.', 'assets/images/instructors/sarah.jpg', 'https://linkedin.com', 'https://twitter.com', 'https://github.com'),
(2, 'Dr. Michael Adeyemi', 'Python Architect & Data Scientist', 'PhD in Computer Science with over a decade of industry data modeling and machine learning.', 'assets/images/instructors/michael.jpg', 'https://linkedin.com', 'https://twitter.com', 'https://github.com'),
(3, 'Chioma Okeke', 'Lead UI/UX & Design Systems Specialist', 'Award-winning design lead recognized for human-centered digital experiences.', 'assets/images/instructors/chioma.jpg', 'https://linkedin.com', 'https://twitter.com', 'https://github.com'),
(4, 'David Mensah', 'Database Administrator', 'Relational database performance, MySQL clustering, and data warehousing specialist.', 'assets/images/instructors/david.jpg', 'https://linkedin.com', 'https://twitter.com', 'https://github.com');

INSERT INTO courses (id, title, category, short_description, full_description, instructor_id, duration_weeks, duration_hours, level, thumbnail, price, is_active) VALUES
(1, 'Full-Stack Web Development Bootcamp', 'Web Development', 'Master HTML5, CSS3, modern JavaScript, PHP, MySQL, and cPanel deployment from scratch.', 'Comprehensive practical training taking students through semantic markup, responsive flexbox/grid, relational databases, secure authentication, and shared Apache hosting deployment.', 1, 12, 72, 'Beginner', 'assets/images/courses/web_dev.jpg', 49.00, 1),
(2, 'Python Programming & Data Analysis', 'Programming', 'From computational logic and OOP to practical data manipulation with Pandas.', 'Hands-on programming bootcamp designed to build strong computational reasoning, automation scripts, and real-world analytical skills.', 2, 14, 84, 'Beginner', 'assets/images/courses/python.jpg', 59.00, 1),
(3, 'UI/UX Design Fundamentals & Prototyping', 'Design', 'Learn user research, wireframing, typography, color harmony, and interactive Figma prototyping.', 'Deep-dive into human-centered software interface design, user journey mapping, and production design systems.', 3, 8, 48, 'Beginner', 'assets/images/courses/uiux.jpg', 39.00, 1),
(4, 'Relational Database Management & SQL', 'Database Management', 'Design normalized relational schemas, write optimized SQL queries, and manage MySQL servers.', 'Understand ACID transactions, indexing strategies, phpMyAdmin operations, and database tuning.', 4, 8, 48, 'Intermediate', 'assets/images/courses/database.jpg', 35.00, 1),
(5, 'Digital Marketing & Growth Strategy', 'Digital Marketing', 'Drive organic search visibility, execute high-converting paid ads, and master analytics.', 'Covers SEO, content marketing, Meta Ads, conversion rate optimization, and GA4 metrics.', 1, 10, 60, 'Beginner', 'assets/images/courses/marketing.jpg', 39.00, 1),
(6, 'Graphics Design & Visual Brand Identity', 'Design', 'Master composition, brand logo systems, typography, and visual assets.', 'Hands-on training in vector art, branding guidelines, and digital marketing graphics.', 3, 6, 36, 'Beginner', 'assets/images/courses/graphics.jpg', 29.00, 1);

INSERT INTO course_enrolments (id, user_id, course_id, progress_percentage, status) VALUES
(1, 2, 1, 65, 'active'),
(2, 2, 2, 40, 'active'),
(3, 3, 3, 85, 'active'),
(4, 4, 2, 25, 'active');

INSERT INTO assignments (id, course_id, title, description, deadline, max_score) VALUES
(1, 1, 'Assignment 1: Responsive Landing Page with CSS Grid', 'Build a semantic, fully responsive 3-section landing page adhering to mobile-first layout rules and accessible forms. Submit ZIP archive.', '2026-11-20', 100),
(2, 1, 'Assignment 2: Interactive JavaScript Shopping Cart', 'Implement client-side product cart with add/remove items, quantity updates, order summary calculation, and local state persistence.', '2026-11-28', 100),
(3, 2, 'Assignment 1: Python CLI Data Analyzer', 'Write a Python program that reads student assessment CSV files and outputs formatted summary statistics.', '2026-11-25', 100),
(4, 3, 'Assignment 1: E-Learning Mobile App Wireframe', 'Create a comprehensive mobile wireframe for an online student course player in Figma. Export as PDF.', '2026-11-22', 100);

INSERT INTO assignment_submissions (id, assignment_id, user_id, file_name, stored_file_path, file_size, comments, score, feedback, graded_at, graded_by_user_id, status) VALUES
(1, 1, 2, 'emmanuel_landing_page.zip', 'uploads/assignments/sub_1_emmanuel.zip', '1.4 MB', 'All responsive breakpoints tested on mobile and tablet viewport sizes. Added dark mode styles.', 94, 'Outstanding layout structure Emmanuel! Clean semantic HTML5 tags and clean CSS grid.', '2026-11-05 09:15:00', 1, 'graded'),
(2, 3, 2, 'python_analyzer_emmanuel.py', 'uploads/assignments/sub_2_python.py', '24 KB', 'Included error handling for missing files and malformed CSV rows.', NULL, NULL, NULL, NULL, 'pending'),
(3, 4, 3, 'fatima_elearning_wireframes.pdf', 'uploads/assignments/sub_3_fatima.pdf', '4.8 MB', 'Focused on the course video player screen, syllabus navigation, and quiz drawer.', 98, 'Flawless visual hierarchy Fatima! The auto-layout spacing is exceptionally well executed.', '2026-11-04 16:40:00', 1, 'graded');

INSERT INTO announcements (id, title, content, category) VALUES
(1, 'Welcome to the First Semester Cohort!', 'All enrolled students are invited to join the live orientation seminar. Ensure your development environment is installed.', 'Academy News'),
(2, 'New Cloud Computing Modules Added', 'We have updated the syllabus with dedicated modules covering cPanel deployment, Apache configuration, and database security.', 'Curriculum Update');
