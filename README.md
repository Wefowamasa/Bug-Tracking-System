# Bug-Tracking-System

ZONE 127.0.0.1 — Bug Tracking System
The link to the project files :  https://github.com/Wefowamasa/Bug-Tracking-System.git
A browser-based bug tracking application built with vanilla HTML, CSS, and JavaScript. The system allows teams to log, assign, monitor, and resolve software issues across multiple projects, with all data stored locally in the browser using the Web Storage API.
---
Project Structure
```
├── index.html          # Main application (dashboard, issues, people, projects, analytics)
├── app.js              # Core application logic
├── styles.css          # Main application styles
├── login.html          # Login page
├── login.js            # Login logic and circuit background animation
├── login_styles.css    # Login page styles
├── register.html       # New user registration page
├── register.js         # Registration logic and circuit background animation
├── register.css        # Registration page styles
└── README.md           # Project documentation
```
---
Getting Started
No installation or server setup is required. All pages are static HTML files.
Open `login.html` in any modern web browser.
If you do not have an account, click Register here and create one.
Log in with your credentials to access the dashboard.
> **Note:** All data is stored in your browser's `localStorage`. Clearing browser data will erase all stored issues, people, and projects.
---
Features
Authentication
Register — Create an operator account with a first name, last name, unique username, email address, and password.
Login — Authenticate using your username and password. The session is stored in `localStorage` under `currentUser`.
Logout — Clears the current session and returns you to the login page.
Issue Management
Create Issue — Log a new bug ticket with the following fields:
Summary and detailed description
Person who identified the issue
Date the issue was identified
Associated project
Assigned operator
Status (`open`, `resolved`, `overdue`)
Priority (`low`, `medium`, `high`)
Target resolution date
Actual resolution date
Resolution notes
View Issues — The dashboard displays all issues in a table with key fields visible at a glance.
View Single Issue — Click an issue to see all its details on a dedicated view screen.
Edit Issue — Update any field of an existing issue, including reassigning it to a different operator.
Delete Issue — Remove an issue permanently from the system.
Search & Filter — Filter issues by status, project, or keyword using the search bar and dropdowns.
People Management
Add operators to the system with an ID, first name, surname, email, and unique username.
Search through the operator directory.
Delete operators from the system.
Operators appear in assignment dropdowns when creating or editing issues.
Project Management
Create projects by name; each project is assigned a unique ID automatically.
Search through the project list.
Delete projects from the system.
Projects are linked to issues for filtering and reporting purposes.
Analytics Dashboard
The Graphs section provides a visual overview of the system's current state:
Chart	Type	Description
Issues by Status	Doughnut	Breakdown of open, resolved, and overdue issues
Issues by Priority	Doughnut	Breakdown across low, medium, and high priorities
Issues by Project	Horizontal Bar	Number of issues per project
Assigned vs Unassigned	Doughnut	Ratio of assigned to unassigned issues
Daily Issue Creation	Line	Issues created over the last 14 days
Summary stat cards at the top of the page show live counts for open, overdue, resolved, and unassigned issues.
An Operator Stats section shows each person's total assigned issues with a proportional bar and a breakdown by status.
---
Data Storage
All data is persisted using `localStorage` under the following keys:
Key	Description
`users`	Registered user accounts
`currentUser`	The currently logged-in user
`issues`	All bug/issue tickets
`people`	Operators who can be assigned to issues
`projects`	Active projects that issues are linked to
Default seed data (one project and one person) is created automatically on first load if no data exists.
---
Technologies Used
HTML5 — Page structure and markup
CSS3 — Styling, animations, and responsive layout
Vanilla JavaScript (ES6+) — All application logic, DOM manipulation, and data handling
Web Storage API (`localStorage`) — Client-side data persistence
Chart.js (v4.4.1) — Analytics charts and graphs (loaded via CDN)
Google Fonts — Orbitron, Share Tech Mono, and Rajdhani typefaces
---
UI Design Notes
The interface uses a custom cyberpunk / terminal aesthetic called ZONE 127.0.0.1, featuring:
A dark navy colour scheme with cyan (`#00f5ff`) and green (`#00ff88`) accent colours
An animated circuit board canvas background rendered with the HTML5 Canvas API
CRT-style scanline overlay for visual effect
Custom clip-path geometry on panels and buttons for an angular, tech-forward look
Glitch animation on the logo
Toast notifications for user feedback on all actions
---
Usage Notes
At least 10 issues should be populated for testing, with varied priorities, dates, and assigned operators.
Issues with a target date in the past and a status of `open` should be manually marked as `overdue`.
The system supports a single admin-style session; there are no role-based access controls.
All relationships between objects (e.g. issue → person, issue → project) are managed by ID references in `localStorage`.
---
Recommended Improvements (Beyond Scope)
Automatic `overdue` status detection based on the current date vs. target date
Profile picture upload for operators
Filtering issues by assigned person
Export to CSV functionality
GitHub integration for syncing issues
---
Authors
Web Programming 27(8)1 — Group Project 
