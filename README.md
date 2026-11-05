# DevGenius Academy – Complete Shared Hosting & cPanel Deployment Guide

DevGenius Academy is a professional, responsive e-learning web application and student registration portal architected specifically to run on standard Apache shared hosting servers, especially **cPanel hosting**, using **PHP 8.1+** and **MySQL / MariaDB** via **PHP PDO**.

---

## 1. System Requirements

- **Web Server:** Apache 2.4+ (with `mod_rewrite` and `mod_headers` enabled).
- **PHP Version:** PHP 8.1 or higher (PHP 8.2 & 8.3 fully supported).
- **PHP Extensions Required:**
  - `pdo_mysql` (standard on all cPanel hosts)
  - `mbstring`
  - `openssl`
  - `fileinfo` (for MIME-type upload validation)
  - `json`
- **Database:** MySQL 5.7+ / 8.0+ or MariaDB 10.3+.
- **Hosting Environment:** Any standard shared cPanel account (Namecheap, Hostinger, Bluehost, GoDaddy, SiteGround, HostGator, etc.).
- **Zero Background Daemons:** No Node.js, Docker, or root VPS access required on production!

---

## 2. Step 1: Create a MySQL Database in cPanel

1. Log in to your hosting account's **cPanel**.
2. Under the **Databases** section, click on **MySQL® Database Wizard**.
3. **Step 1 - Create A Database:**
   - Enter a database name suffix (e.g., `devgenius`).
   - Note the full database name generated (e.g., `cpaneluser_devgenius`). Click **Next Step**.
4. **Step 2 - Create Database Users:**
   - Enter a database username (e.g., `dbadmin`).
   - Click **Password Generator** to create a strong, random password.
   - **Important:** Save both the username (e.g., `cpaneluser_dbadmin`) and the password in a secure text file. Click **Create User**.
5. **Step 3 - Add User to the Database:**
   - Check the box for **ALL PRIVILEGES**.
   - Click **Make Changes** and finish the wizard.

---

## 3. Step 2: Import `database.sql` Using phpMyAdmin

1. In cPanel, navigate to the **Databases** section and open **phpMyAdmin**.
2. From the left sidebar, click on your newly created database (`cpaneluser_devgenius`).
3. Click on the **Import** tab in the top navigation bar.
4. Under **File to import**, click **Choose File** and select `database.sql` from the project package.
5. Leave the format as **SQL** and encoding as **utf-8**.
6. Click the **Go** button at the bottom of the page.
7. You should see a green success banner: *"Import has been successfully finished, queries executed."*
8. Notice the 7 structured tables created:
   - `users`
   - `courses`
   - `course_enrolments`
   - `assignments`
   - `assignment_submissions`
   - `instructors`
   - `newsletter_subscribers`

---

## 4. Step 3: Configure Database Credentials in `includes/config.php`

1. Open `includes/config.php` in a text editor (or use cPanel File Manager's built-in Code Editor).
2. Locate the database constants around line 15:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'cpaneluser_devgenius');       // Replace with your actual cPanel DB name
   define('DB_USER', 'cpaneluser_dbadmin');        // Replace with your cPanel DB username
   define('DB_PASS', 'YourSecureGeneratedPassword'); // Replace with your generated password
   define('DB_CHARSET', 'utf8mb4');
   ```
3. Update the `APP_URL` constant with your domain:
   ```php
   define('APP_URL', 'https://yourdomain.com'); // e.g. https://academy.yourdomain.com
   ```
4. Save the file.

---

## 5. Step 4: Upload Application Files to `public_html`

1. In cPanel, open **File Manager**.
2. Navigate to `public_html/` (or your subdomain folder, e.g., `public_html/academy/`).
3. Click the **Upload** button at the top.
4. Upload all application files or upload a `.zip` archive containing the project and click **Extract**.
5. Ensure `index.php` is located directly in the root of your web directory:
   ```text
   public_html/
   ├── index.php
   ├── courses.php
   ├── course-details.php
   ├── login.php
   ├── register.php
   ├── logout.php
   ├── includes/
   │   ├── config.php
   │   ├── database.php
   │   ├── auth.php
   │   ├── functions.php
   │   ├── csrf.php
   │   ├── header.php
   │   └── footer.php
   ├── student/
   │   ├── dashboard.php
   │   ├── browse-courses.php
   │   ├── my-courses.php
   │   ├── assignments.php
   │   ├── submit-assignment.php
   │   ├── my-results.php
   │   └── profile.php
   ├── admin/
   │   ├── dashboard.php
   │   ├── students.php
   │   ├── courses.php
   │   ├── add-course.php
   │   ├── edit-course.php
   │   ├── assignments.php
   │   ├── grade-assignment.php
   │   └── instructors.php
   ├── uploads/
   │   ├── courses/
   │   └── assignments/
   ├── assets/
   ├── database.sql
   └── .htaccess
   ```

---

## 6. Step 5: Configure File and Directory Permissions

In cPanel File Manager:
- Standard Directories: **`755`** (`drwxr-xr-x`)
- Standard PHP/HTML Files: **`644`** (`-rw-r--r--`)
- Configuration file (`includes/config.php`): **`600`** or **`640`** (recommended for extra security)
- Upload folders (`uploads/` and `uploads/assignments/`): **`755`** (or **`775`** if your host requires group write permissions)

---

## 7. Step 6: Initial Administrator Account

The provided `database.sql` seeds an initial pre-configured administrator account:

- **Email:** `admin@devgenius.ac`
- **Initial Password:** `Admin@2026!`
- **Role:** `admin`

### Best Security Practice:
Immediately after your first login:
1. Navigate to the Admin Dashboard.
2. Update the default email and password to your private administrative credentials.
3. Passwords are automatically hashed using PHP `password_hash($pass, PASSWORD_BCRYPT)`.

---

## 8. Step 7: Testing Student Registration & Login

1. Visit `https://yourdomain.com/register.php` (or click "Get Started" from the homepage).
2. Register a new student account:
   - Full Name: `Test Student`
   - Email: `test@student.com`
   - Password: `MyPassword123`
3. Verify that:
   - The user is assigned the `student` role.
   - The account is logged in and redirected to `student/dashboard.php`.
   - The admin dashboard's "Total Registered Students" count increases by 1.
4. Log out and log back in through `login.php`.

---

## 9. Step 8: Testing Course Enrolment & Assignment Submissions

1. In the Student Portal, click **Browse Courses**.
2. Click **Enrol Now** on any active course (e.g., *Full-Stack Web Development Bootcamp*).
3. Confirm that the course appears under **My Courses**.
4. Click **Assignments** in the sidebar.
5. Click **Submit Assignment**, select a sample file (e.g., a `.zip` or `.pdf` archive), enter comments, and click **Confirm Submission**.
6. Verify the status changes to `Pending`.
7. Log out of the student account and log in as Administrator (`admin@devgenius.ac`).
8. Go to **Grade Assignments**, review the submission, enter a score (e.g. `95`), write feedback, and click **Publish Grade**.
9. Log back in as the student and verify that **My Results** displays the numerical score, letter grade (A), and feedback.

---

## 10. Troubleshooting Common cPanel Hosting Issues

### A. "500 Internal Server Error"
- **Cause 1:** Invalid directive in `.htaccess`. Some shared hosts disallow `php_value` in `.htaccess`. If this happens, comment out lines 35-41 in `.htaccess` and set upload limits in cPanel **MultiPHP INI Editor**.
- **Cause 2:** Incorrect database credentials in `includes/config.php`. Verify `DB_NAME`, `DB_USER`, and `DB_PASS`.
- **Cause 3:** Missing PHP PDO extension. Go to cPanel **Select PHP Version** -> **Extensions** and ensure `pdo_mysql` is checked.

### B. "Access denied for user"
- Ensure that you associated the user with the database in cPanel MySQL Wizard and granted **ALL PRIVILEGES**.

### C. "File upload failed"
- Check that the `uploads/assignments/` folder exists and its permissions are set to `755` or `775`.
- Check that the uploaded file does not exceed `upload_max_filesize` in cPanel.

### D. Blank Page (White Screen)
- Enable temporary error display in `includes/config.php` during debugging by changing `ini_set('display_errors', 0);` to `ini_set('display_errors', 1);`. Revert to `0` when fixed.

---

## 11. Security Hardening Checklist

- [x] Passwords hashed with `PASSWORD_BCRYPT` (cost 11).
- [x] All database queries parameterized via PHP PDO prepared statements.
- [x] Script execution disabled inside the `uploads/` directory via `.htaccess`.
- [x] Direct access to `config.php` and `database.sql` denied via Apache rules.
- [x] Session cookies configured with `HttpOnly` and `SameSite=Lax`.
- [x] Role-based authentication check (`requireStudentAuth()` / `requireAdminAuth()`) on every restricted route.
