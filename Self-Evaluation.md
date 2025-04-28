

# Self Evaluation


This submission covers all the project requirements:
- Built a fully functional task management dashboard in Angular.
- Integrated drag & drop functionality to move tasks between statuses.
- Provided role-based access for Admins and Users.
- Tasks and user data are persisted in a Firebase Realtime Database.
- Added authentication with route guards, toastr popups for alerts, and structured the application with good practices.
- The project is responsive and lightweight, designed for fast performance.


Explained Summary:
This project successfully meets all the specified requirements:

Task Management Dashboard in Angular:
A fully functional dashboard was built using Angular, providing a smooth and responsive user experience. The tasks are organized neatly in a Kanban-style layout with three columns: To Do, In Progress, and Done.

Drag & Drop Functionality:
Implemented using Angular's DragDropModule (Cdk), users can easily drag tasks between different status columns. This makes task handling intuitive and improves usability.

Role-Based Access Control (RBAC):
Access to functionalities is controlled based on the user's role (Admin or User).

Admins can create, assign, and update tasks and users.

Regular users can view and update only their own tasks.

Data Persistence Using Firebase:
All tasks and user data are stored and retrieved in real time from a Firebase Realtime Database, ensuring that the application’s state is always synchronized with the backend.

Authentication with Route Guards:
Authentication was added to the project, protecting routes based on login status and user roles. Angular Route Guards ensure that only authorized users can access protected pages.

Toastr Notifications:
Toast popup messages (using ngx-toastr) inform users about the success or failure of their actions, enhancing feedback and user experience.

Responsive and Lightweight Design:
The application is mobile-friendly and responsive across devices. It loads quickly and handles updates smoothly, thanks to efficient Angular practices and avoiding unnecessary heavy dependencies.

## Self-Criticism
While the application meets the basic requirements, a few areas could be improved:
- No lazy loading implemented because the project was small. For bigger applications, lazy loading would improve performance.
- Firebase authentication (proper login/signup) was not implemented — used a simple login system instead.
- Timer feature for tasks (time spent) is not yet added.
- Admin dashboard with analytics (graphs, charts) was not added due to time constraints.

## Improvements (if more time was available)
- Implement full lazy-loading module structure.
- Add a task timer to track time spent per task.
- Add analytics dashboard (Pie charts, Bar graphs) showing task status summary.
- Implement JWT-based authentication.
- Add detailed user and task activity history tracking.

## Technology Rating
| Technology | Rating |
|:-----------|:------:|
| Angular | 8/10 |
| Firebase | 7/10 |
| Routing & Guards | 8/10 |
| Forms & Validation | 8/10 |
| Toastr Notifications | 9/10 |
| Drag & Drop | 8/10 |

---
