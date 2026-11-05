import { Course, Instructor, User, Assignment, AssignmentSubmission, CourseEnrolment } from '../types';

export const INITIAL_INSTRUCTORS: Instructor[] = [
  {
    id: 'inst_1',
    name: 'Engr. Sarah Johnson',
    specialization: 'Principal Full-Stack Engineer & Tech Lead',
    bio: 'Former senior software engineer with 10+ years building scalable cloud architectures, React ecosystems, and modern web platforms across Africa and Europe.',
    image: '/src/assets/images/instructor_portrait_female_1793883782763.jpg',
    courseCount: 4,
    social: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      github: 'https://github.com',
    },
  },
  {
    id: 'inst_2',
    name: 'Dr. Michael Adeyemi',
    specialization: 'Python Architect & Data Scientist',
    bio: 'PhD in Computer Science with over a decade of industry consulting experience in Python scripting, machine learning models, and automated analytics.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    courseCount: 3,
    social: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
    },
  },
  {
    id: 'inst_3',
    name: 'Chioma Okeke',
    specialization: 'Lead UI/UX & Design Systems Specialist',
    bio: 'Product design lead recognized for crafting human-centered user experiences, intuitive wireframes, and enterprise design token systems.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    courseCount: 3,
    social: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
    },
  },
  {
    id: 'inst_4',
    name: 'David Mensah',
    specialization: 'Database Administrator & Cloud Engineer',
    bio: 'Specialist in relational schema optimization, MySQL/PostgreSQL clustering, disaster recovery, and query performance tuning.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    courseCount: 2,
    social: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
    },
  },
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'crs_1',
    title: 'Full-Stack Web Development Bootcamp',
    category: 'Web Development',
    shortDescription: 'Master HTML5, modern CSS3, responsive Tailwind, JavaScript, and dynamic backend database integration from scratch.',
    fullDescription: 'Become a job-ready full-stack web developer through hands-on project building. This comprehensive course takes you from basic web foundations to building full dynamic applications with responsive frontend styling, relational databases, user authentication, and deployment on shared Apache and modern cloud hosting.',
    instructorName: 'Engr. Sarah Johnson',
    instructorTitle: 'Principal Full-Stack Engineer',
    instructorImage: '/src/assets/images/instructor_portrait_female_1793883782763.jpg',
    durationWeeks: 12,
    durationHours: 72,
    level: 'Beginner',
    thumbnail: '/src/assets/images/course_web_dev_1793883780818.jpg',
    rating: 4.9,
    reviewCount: 142,
    price: 49.00,
    isActive: true,
    requirements: [
      'A working laptop or desktop computer with internet access',
      'Basic familiarity with operating systems and web browsers',
      'No prior programming or coding experience required'
    ],
    syllabus: [
      { week: 1, title: 'Web Foundations & Semantic HTML5', topics: ['Document structure', 'Forms & Inputs', 'Semantic elements', 'Accessibility standards'] },
      { week: 2, title: 'Modern CSS3, Flexbox & Responsive Layouts', topics: ['Box model', 'CSS Grid & Flexbox', 'Media queries', 'Mobile-first design'] },
      { week: 3, title: 'Interactive JavaScript Core & DOM', topics: ['Variables & functions', 'Event listeners', 'DOM manipulation', 'Async fetch & APIs'] },
      { week: 4, title: 'Backend Architecture & Database Integration', topics: ['Server concepts', 'Relational database schema', 'CRUD operations', 'Authentication sessions'] }
    ]
  },
  {
    id: 'crs_2',
    title: 'Python Programming & Data Analysis From Scratch',
    category: 'Programming',
    shortDescription: 'From core programming logic and object-oriented concepts to practical data manipulation, automation, and real-world scripting.',
    fullDescription: 'Python is the world’s most versatile language. In this bootcamp, you will develop strong computational problem-solving abilities, understand algorithms, handle real-world datasets with Pandas, build automated scripts, and write clean, maintainable Python 3 code suitable for tech roles.',
    instructorName: 'Dr. Michael Adeyemi',
    instructorTitle: 'Python Architect & Data Scientist',
    instructorImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    durationWeeks: 14,
    durationHours: 84,
    level: 'Beginner',
    thumbnail: '/src/assets/images/course_python_data_1793883782416.jpg',
    rating: 4.8,
    reviewCount: 118,
    price: 59.00,
    isActive: true,
    requirements: [
      'PC or Mac computer with Python 3 installed',
      'Basic logical reasoning and enthusiasm to learn',
      'Willingness to complete weekly coding exercises'
    ],
    syllabus: [
      { week: 1, title: 'Python Syntax & Data Structures', topics: ['Lists, tuples, dictionaries', 'Conditional logic', 'Loops and list comprehensions'] },
      { week: 2, title: 'Functions, Modular Code & File I/O', topics: ['Custom functions', 'Lambda functions', 'Reading/Writing CSV and JSON files'] },
      { week: 3, title: 'Object-Oriented Programming (OOP)', topics: ['Classes & Objects', 'Inheritance & Polymorphism', 'Error handling & Debugging'] },
      { week: 4, title: 'Data Analysis with Pandas & Visualization', topics: ['Data cleaning', 'Grouping & Aggregation', 'Matplotlib graphs'] }
    ]
  },
  {
    id: 'crs_3',
    title: 'UI/UX Design Fundamentals & Modern Prototyping',
    category: 'Design',
    shortDescription: 'Learn user research, wireframing, typography, color harmony, and high-fidelity interactive prototyping with Figma.',
    fullDescription: 'Craft intuitive, accessible digital experiences that users love. This course immerses you in the end-to-end design process: understanding user psychology, conducting user interviews, wireframing user journeys, mastering typography and color theory, and building interactive, high-fidelity prototypes.',
    instructorName: 'Chioma Okeke',
    instructorTitle: 'Lead UI/UX Specialist',
    instructorImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    durationWeeks: 8,
    durationHours: 48,
    level: 'Beginner',
    thumbnail: '/src/assets/images/course_uiux_design_1793883782681.jpg',
    rating: 4.9,
    reviewCount: 95,
    price: 39.00,
    isActive: true,
    requirements: [
      'Laptop capable of running Figma in browser or desktop app',
      'An eye for aesthetic detail and desire to create smooth user flows',
      'No graphic design background required'
    ],
    syllabus: [
      { week: 1, title: 'Design Thinking & User Research', topics: ['Problem framing', 'User personas', 'Empathy mapping', 'User interviews'] },
      { week: 2, title: 'Information Architecture & Wireframing', topics: ['Site maps', 'User flows', 'Low-fidelity paper sketches', 'Wireframe systems'] },
      { week: 3, title: 'Visual Design & Design Systems', topics: ['Typography scales', 'Color theory & 60-30-10 rule', 'Spacing & auto-layout', 'Component libraries'] },
      { week: 4, title: 'Interactive Prototyping & Usability Testing', topics: ['Smart animate', 'Micro-interactions', 'User test scripts', 'Design handoff'] }
    ]
  },
  {
    id: 'crs_4',
    title: 'Relational Database Management & SQL Mastery',
    category: 'Database Management',
    shortDescription: 'Design normalized relational schemas, write optimized SQL queries, indexes, and manage MySQL & PostgreSQL servers.',
    fullDescription: 'Data is at the center of every software application. Learn how to architect robust databases, eliminate redundant anomalies via normalization, execute complex queries with subqueries and JOINs, implement transactions (ACID), and optimize queries for high-traffic environments.',
    instructorName: 'David Mensah',
    instructorTitle: 'Database Administrator',
    instructorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    durationWeeks: 8,
    durationHours: 48,
    level: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    reviewCount: 82,
    price: 35.00,
    isActive: true,
    requirements: [
      'Basic understanding of computers and spreadsheet data tables',
      'Computer capable of installing MySQL Workbench or phpMyAdmin'
    ],
    syllabus: [
      { week: 1, title: 'Relational Database Foundations', topics: ['Entity-relationship models', 'Primary and foreign keys', 'Data types', 'Schema creation'] },
      { week: 2, title: 'Intermediate to Advanced SQL Queries', topics: ['SELECT, WHERE, ORDER BY', 'INNER/LEFT/RIGHT JOINs', 'Aggregate functions', 'Subqueries'] },
      { week: 3, title: 'Normalization & Database Integrity', topics: ['1NF, 2NF, 3NF', 'Referential integrity constraints', 'Triggers and stored procedures'] },
      { week: 4, title: 'Indexing, Performance & Administration', topics: ['B-Tree indexes', 'EXPLAIN query plans', 'Backups and phpMyAdmin migrations', 'Security & user privileges'] }
    ]
  },
  {
    id: 'crs_5',
    title: 'Digital Marketing & Growth Strategy',
    category: 'Digital Marketing',
    shortDescription: 'Drive organic search visibility, execute high-converting paid ads, content strategy, and data-driven marketing analytics.',
    fullDescription: 'Grow any business or career with targeted digital marketing expertise. Master SEO fundamentals, content strategy, meta advertisements, Google Ads, email marketing automation, conversion rate optimization, and measurable Google Analytics 4 tracking.',
    instructorName: 'Engr. Sarah Johnson',
    instructorTitle: 'Growth Strategy Lead',
    instructorImage: '/src/assets/images/instructor_portrait_female_1793883782763.jpg',
    durationWeeks: 10,
    durationHours: 60,
    level: 'Beginner',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviewCount: 88,
    price: 39.00,
    isActive: true,
    requirements: [
      'Computer with web access',
      'Desire to master digital marketing and organic growth'
    ],
    syllabus: [
      { week: 1, title: 'Digital Marketing Funnel & Customer Journey', topics: ['Inbound vs outbound', 'Buyer personas', 'Conversion funnels'] },
      { week: 2, title: 'SEO & Content Marketing Mastery', topics: ['Keyword research', 'On-page SEO', 'Technical SEO basics', 'Content calendars'] },
      { week: 3, title: 'Social Media & Paid Advertising Campaigns', topics: ['Meta Ads Manager', 'Targeting audiences', 'Budget allocation & A/B testing'] },
      { week: 4, title: 'Email Marketing & Performance Analytics', topics: ['Automated email sequences', 'GA4 setup', 'Conversion metrics & ROI'] }
    ]
  },
  {
    id: 'crs_6',
    title: 'Graphics Design & Brand Visual Identity',
    category: 'Design',
    shortDescription: 'Master visual storytelling, logo design, typography layout, Photoshop and Illustrator techniques for impactful brand assets.',
    fullDescription: 'Translate ideas into captivating visual identities. Learn the core principles of composition, balance, color psychology, vector illustration, brand book creation, and marketing collateral design that stand out in client pitches.',
    instructorName: 'Chioma Okeke',
    instructorTitle: 'Lead Brand Designer',
    instructorImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    durationWeeks: 6,
    durationHours: 36,
    level: 'Beginner',
    thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    reviewCount: 76,
    price: 29.00,
    isActive: true,
    requirements: [
      'Computer capable of running graphic editing tools or open-source equivalents',
      'Curiosity for visual arts and brand design'
    ],
    syllabus: [
      { week: 1, title: 'Visual Composition & Principles of Design', topics: ['Balance and contrast', 'Hierarchy and scale', 'Color psychology'] },
      { week: 2, title: 'Vector Illustration & Logo Architecture', topics: ['Pen tool mastery', 'Geometric grid logos', 'Export formats'] },
      { week: 3, title: 'Brand Guidelines & Marketing Collateral', topics: ['Brand style guides', 'Social media templates', 'Print vs digital resolution'] }
    ]
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_admin',
    fullName: 'System Administrator',
    email: 'admin@devgenius.ac',
    phone: '+234 803 123 4567',
    role: 'admin',
    bio: 'Chief Academy Director and Academic Supervisor at DevGenius Academy.',
    enrolledAt: '2026-01-01',
  },
  {
    id: 'usr_student_1',
    fullName: 'Emmanuel Eze',
    email: 'emmanuel@student.devgenius.ac',
    phone: '+234 812 345 6789',
    role: 'student',
    bio: 'Aspiring full-stack engineer and tech enthusiast enthusiastic about cloud development.',
    enrolledAt: '2026-02-10',
  },
  {
    id: 'usr_student_2',
    fullName: 'Fatima Al-Mansur',
    email: 'fatima@student.devgenius.ac',
    phone: '+234 809 987 6543',
    role: 'student',
    bio: 'Passionate UI/UX designer focused on accessibility and human-computer interaction.',
    enrolledAt: '2026-02-15',
  },
  {
    id: 'usr_student_3',
    fullName: 'Kwame Mensah',
    email: 'kwame@student.devgenius.ac',
    phone: '+233 24 555 7890',
    role: 'student',
    bio: 'Junior Python programmer working towards entering data analytics and backend development.',
    enrolledAt: '2026-03-01',
  }
];

export const INITIAL_ENROLMENTS: CourseEnrolment[] = [
  {
    id: 'enr_1',
    userId: 'usr_student_1',
    courseId: 'crs_1',
    enrolledDate: '2026-02-12',
    progressPercentage: 65,
    status: 'active'
  },
  {
    id: 'enr_2',
    userId: 'usr_student_1',
    courseId: 'crs_2',
    enrolledDate: '2026-02-20',
    progressPercentage: 40,
    status: 'active'
  },
  {
    id: 'enr_3',
    userId: 'usr_student_2',
    courseId: 'crs_3',
    enrolledDate: '2026-02-18',
    progressPercentage: 85,
    status: 'active'
  },
  {
    id: 'enr_4',
    userId: 'usr_student_3',
    courseId: 'crs_2',
    enrolledDate: '2026-03-02',
    progressPercentage: 25,
    status: 'active'
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg_1',
    courseId: 'crs_1',
    title: 'Assignment 1: Responsive Landing Page with CSS Grid',
    description: 'Build a semantic, fully responsive 3-section landing page adhering to mobile-first layout rules, clean navigation, and accessible forms. Submit a single ZIP file containing your HTML and CSS assets.',
    deadline: '2026-11-20',
    maxScore: 100
  },
  {
    id: 'asg_2',
    courseId: 'crs_1',
    title: 'Assignment 2: Interactive JavaScript Shopping Cart',
    description: 'Implement a working client-side product cart with add/remove items, quantity updates, order summary calculation, and local state persistence. Submit source files.',
    deadline: '2026-11-28',
    maxScore: 100
  },
  {
    id: 'asg_3',
    courseId: 'crs_2',
    title: 'Assignment 1: Python CLI Data Analyzer',
    description: 'Write a Python program that reads student assessment CSV files, calculates statistical metrics (mean, median, standard deviation), and outputs formatted summary reports.',
    deadline: '2026-11-25',
    maxScore: 100
  },
  {
    id: 'asg_4',
    courseId: 'crs_3',
    title: 'Assignment 1: E-Learning Mobile App Wireframe',
    description: 'Create a comprehensive low-to-mid fidelity mobile wireframe for an online student course player in Figma. Submit exported PDF presentation with rationale.',
    deadline: '2026-11-22',
    maxScore: 100
  }
];

export const INITIAL_SUBMISSIONS: AssignmentSubmission[] = [
  {
    id: 'sub_1',
    assignmentId: 'asg_1',
    userId: 'usr_student_1',
    studentName: 'Emmanuel Eze',
    studentEmail: 'emmanuel@student.devgenius.ac',
    courseId: 'crs_1',
    courseTitle: 'Full-Stack Web Development Bootcamp',
    assignmentTitle: 'Assignment 1: Responsive Landing Page with CSS Grid',
    fileName: 'emmanuel_eze_landing_page.zip',
    fileSize: '1.4 MB',
    comments: 'Completed all responsive breakpoints and tested on mobile and tablet viewport sizes. Added dark mode styles as a bonus!',
    submittedAt: '2026-11-04 14:32',
    score: 94,
    feedback: 'Outstanding layout structure Emmanuel! Clean semantic HTML5 tags and clean CSS grid implementation. Fluid typography handled gracefully.',
    gradedAt: '2026-11-05 09:15',
    gradedBy: 'Engr. Sarah Johnson',
    status: 'graded'
  },
  {
    id: 'sub_2',
    assignmentId: 'asg_3',
    userId: 'usr_student_1',
    studentName: 'Emmanuel Eze',
    studentEmail: 'emmanuel@student.devgenius.ac',
    courseId: 'crs_2',
    courseTitle: 'Python Programming & Data Analysis From Scratch',
    assignmentTitle: 'Assignment 1: Python CLI Data Analyzer',
    fileName: 'python_analyzer_emmanuel.py',
    fileSize: '24 KB',
    comments: 'Included error handling for missing files and malformed CSV rows. Script tested against 10,000 mock student records.',
    submittedAt: '2026-11-04 18:20',
    status: 'pending'
  },
  {
    id: 'sub_3',
    assignmentId: 'asg_4',
    userId: 'usr_student_2',
    studentName: 'Fatima Al-Mansur',
    studentEmail: 'fatima@student.devgenius.ac',
    courseId: 'crs_3',
    courseTitle: 'UI/UX Design Fundamentals & Modern Prototyping',
    assignmentTitle: 'Assignment 1: E-Learning Mobile App Wireframe',
    fileName: 'fatima_elearning_wireframes.pdf',
    fileSize: '4.8 MB',
    comments: 'Focused on the course video player screen, syllabus navigation, and quick quiz drawer. Included interactive flow links.',
    submittedAt: '2026-11-03 11:10',
    score: 98,
    feedback: 'Flawless visual hierarchy Fatima! The auto-layout spacing and ergonomic thumb reach on mobile components are exceptionally well executed.',
    gradedAt: '2026-11-04 16:40',
    gradedBy: 'Chioma Okeke',
    status: 'graded'
  }
];

export const INITIAL_ANNOUNCEMENTS = [
  {
    id: 'ann_1',
    title: 'Welcome to the First Semester 2026 Cohort!',
    date: '2026-11-01',
    content: 'All enrolled students are invited to join the live orientation seminar. Ensure your development environment is installed.',
    category: 'Academy News'
  },
  {
    id: 'ann_2',
    title: 'New Cloud Computing Modules Added to Web Development',
    date: '2026-10-25',
    content: 'We have updated the syllabus with dedicated modules covering cPanel deployment, Apache configuration, and database security.',
    category: 'Curriculum Update'
  }
];
