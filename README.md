# React Dashboard Task

## Users List Page (`/`)

- Implemented using **plain CSS**.
- Loading state is shown for **1 second** to simulate data fetching.
- "Load more" functionality displays **5 records at a time**.
- Clicking a user navigates to their detail page.

## User Details Page (`/user/:id`)

- Implemented using **Material UI** for layout and styling.
- Displays user information (**name, email, phone, website**).
- User posts include a **search input** to filter by title.
- **Pagination** added for posts (**5 records per page**).
- **Edit, and Delete post** functionality implemented with popups and success notifications.
-   Added a **Back button** to navigate back to the user list. 
## Header

- **First name** is displayed using **Redux** (default, not editable).
- **Last name** is displayed using **Context API** (default, not editable).

## Notes

- All state changes are handled locally; data does **not persist** after a page refresh.

---
