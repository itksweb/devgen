# DevGenius Academy – Universal Shared Hosting Manual (cPanel & DirectAdmin)

DevGenius Academy is a professional, responsive e-learning web application and student registration portal built with **PHP 8.1+**, **MySQL / MariaDB**, and **PHP PDO**.

The entire codebase is **100% compatible with ANY standard Apache shared hosting environment**, including:
- **cPanel** (Namecheap, Hostinger, Bluehost, SiteGround, GoDaddy, etc.)
- **DirectAdmin** (KnownHost, Hostwinds, OVH, InterServer, local hosting providers)
- **Plesk / CyberPanel / Standard LAMP / LEMP**

---

## 🚀 Quick Setup Option: Universal Web Installer (`install.php`)

DevGenius Academy includes a built-in automated web setup wizard:

1. Upload all files into your domain's document root:
   - For **cPanel**: `public_html/`
   - For **DirectAdmin**: `domains/yourdomain.com/public_html/`
2. Open your browser and visit: `https://yourdomain.com/install.php`
3. The wizard will automatically:
   - Verify PHP 8.1+ and `pdo_mysql` extensions.
   - Test your MySQL connection credentials.
   - Import the complete `database.sql` schema and initial curriculum seed.
   - Configure your first Administrator credentials.
   - Generate `includes/config.php` and lock itself (`install.lock`) for security!

---

## 🛠 Manual Installation Guide

If you prefer to configure the database manually via your hosting control panel, follow the instructions for your specific hosting panel below:

---

### Part A: DirectAdmin Shared Hosting Setup

#### 1. Document Root Location
In DirectAdmin, web files are placed inside:
```text
/home/yourusername/domains/yourdomain.com/public_html/
```
*(If you are using a subdomain such as `academy.yourdomain.com`, the folder is `domains/yourdomain.com/public_html/academy/`)*

#### 2. Create MySQL Database in DirectAdmin
1. Log in to DirectAdmin.
2. Under **Account Manager**, click **MySQL Management**.
3. Click the **Create New Database** button.
4. DirectAdmin will prefix your database and username with your account username:
   - **Database Name:** e.g., `dauser_devgenius`
   - **Database User:** e.g., `dauser_dbadmin`
   - **Database Password:** Click the dice icon to generate a strong random password.
5. Click **Create Database**. DirectAdmin automatically grants all privileges to the user.
6. Note down the Database Name, User, and Password.

#### 3. Import `database.sql` via phpMyAdmin in DirectAdmin
1. In DirectAdmin, under **Extra Features** or **Account Manager**, click **phpMyAdmin**.
2. Select your database (`dauser_devgenius`) from the left menu.
3. Click the **Import** tab at the top.
4. Click **Choose File** and select `database.sql` from your computer.
5. Click **Go** at the bottom.

#### 4. Configure `includes/config.php`
Open `includes/config.php` using DirectAdmin File Manager's built-in editor:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'dauser_devgenius');
define('DB_USER', 'dauser_dbadmin');
define('DB_PASS', 'YourDirectAdminPasswordHere');
define('APP_URL', 'https://yourdomain.com');
```

---

### Part B: cPanel Shared Hosting Setup

#### 1. Document Root Location
In cPanel, web files are placed inside:
```text
/home/yourusername/public_html/
```

#### 2. Create MySQL Database in cPanel
1. Log in to cPanel and open **MySQL® Database Wizard**.
2. **Step 1:** Enter database name (e.g., `cpaneluser_devgenius`). Click *Next Step*.
3. **Step 2:** Create user (e.g., `cpaneluser_dbadmin`) and generate a password. Click *Create User*.
4. **Step 3:** Check **ALL PRIVILEGES** and click *Make Changes*.

#### 3. Import `database.sql` via phpMyAdmin in cPanel
1. In cPanel, click **phpMyAdmin**.
2. Select your database from the left list.
3. Click the **Import** tab.
4. Choose `database.sql` and click **Go**.

#### 4. Configure `includes/config.php`
Update `includes/config.php` with your cPanel database details:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'cpaneluser_devgenius');
define('DB_USER', 'cpaneluser_dbadmin');
define('DB_PASS', 'YourCpanelPasswordHere');
define('APP_URL', 'https://yourdomain.com');
```

---

## 🔒 DirectAdmin & cPanel Architecture Hardening

### 1. Avoiding "500 Internal Server Error" on PHP-FPM & LiteSpeed
Many DirectAdmin and cPanel servers run **PHP-FPM** or **LiteSpeed Web Server** instead of legacy Apache `mod_php`. On these servers, placing `php_value` in `.htaccess` triggers a `500 Server Error`.

DevGenius Academy solves this with a two-layer setup:
- **`/.user.ini`**: Automatically sets `upload_max_filesize = 25M`, `post_max_size = 30M`, and `memory_limit = 128M` cleanly for PHP-FPM and LiteSpeed without Apache errors.
- **`/.htaccess`**: Wraps any legacy `php_value` in `<IfModule mod_php.c>` and `<IfModule mod_php8.c>` so it is completely ignored on PHP-FPM hosts while enforcing upload script protection and denying direct access to sensitive files.

### 2. File and Folder Permissions
Set permissions via cPanel/DirectAdmin File Manager:
- **Folders:** `755` (`drwxr-xr-x`)
- **PHP/HTML/CSS files:** `644` (`-rw-r--r--`)
- **`uploads/assignments/`:** `755` (or `775` if required by your host's suExec setup)
- **`includes/config.php`:** `640` or `600` (extra configuration protection)

---

## 🧑‍🎓 User Roles & Default Accounts

The database comes pre-seeded with sample accounts for immediate testing:

### Administrator Account:
- **Email:** `admin@devgenius.ac`
- **Password:** `Admin@2026!`
- **Role:** `admin` (Full access to student registry, courses, and grading queue)

### Student Account:
- **Email:** `emmanuel@student.devgenius.ac`
- **Password:** `password123`
- **Role:** `student` (Course enrollment, assignments, and results)

*All passwords are encrypted using `password_hash($password, PASSWORD_BCRYPT)`.*

---

## 📋 Pre-Flight Deployment Checklist

- [x] PHP version set to 8.1 or higher via cPanel MultiPHP or DirectAdmin PHP Selector.
- [x] `pdo_mysql` and `mbstring` extensions active.
- [x] Database created and user assigned with ALL PRIVILEGES.
- [x] `database.sql` imported cleanly into MySQL.
- [x] Credentials configured in `includes/config.php` (or ran `install.php`).
- [x] `uploads/assignments/` directory exists and is writable.
- [x] `.htaccess` and `.user.ini` present in document root.
- [x] Tested student registration, course enrollment, file submission, and admin grading.
