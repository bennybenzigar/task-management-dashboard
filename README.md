# Task Management Dashboard (Kanban Board)

Username: admin, Password: admin@123
Username: benny, Password: benny@123

## Overview
This project is a **Task Management Dashboard** built with **Angular**, featuring:
- Kanban-style board (To Do, In Progress, Done)
- Role-based user access
- Create, move, and assign tasks
- Authentication with route guards
- Toastr notifications
- API persistence using a mock backend (Firebase Realtime Database)
- Admin and User roles

---

## Features
- 🔹 View tasks categorized by status
- 🔹 Create new tasks (Admins only)
- 🔹 Drag & Drop tasks between columns
- 🔹 Role-based task status update access
- 🔹 Admin can assign tasks to users
- 🔹 Authentication system with route guards
- 🔹 Task summary
- 🔹 Toastr popups for success and error messages

---

## User Roles
- **Admin**:
  - Can create users
  - Can create and assign tasks
  - Can update user status
  - Username: `admin`, Password: `admin@123`

- **User**:
  - Can view and update assigned tasks
  - Username: `benny`, Password: `benny@123`

---

## Technologies Used
- Angular
- Angular Routing
- Angular Forms
- Angular Route Guards
- ngx-toastr
- Angular DragDropModule (Cdk)
- Firebase (Mock Realtime Database)
- Bootstrap
- Aggrid
- Angular materials

---

## Installation Instructions
1. Clone the repository:

git clone https://github.com/bennybenzigar/task-management-dashboard.git


2. Navigate to the project directory:


3. Open Terminal

cd task-management-dashboard


npm install
ng serve --open
