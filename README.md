## 🛠️ Features

### **1. User Routes**
The User module handles registration, login, and password management for users.

- **POST `/api/users/register`**: 
  - Registers a new user.
  - Expects: `name`, `email`, `password` in the request body.
  - Functionality: Creates a new user, hashes the password, and stores the user in the database.

- **POST `/api/users/login`**:
  - Authenticates a user and generates a JWT token.
  - Expects: `email`, `password` in the request body.
  - Functionality: Verifies credentials, issues a JWT token, and returns it to the user.

- **POST `/api/users/forget-password`**:
  - Allows users to request a password reset.
  - Expects: `email` in the request body.
  - Functionality: Sends a reset password link to the user's email.

- **POST `/api/users/reset-password/:token`**:
  - Resets the password using a provided token.
  - Expects: `password` and `confirmPassword` in the request body, token in the URL.
  - Functionality: Verifies the token, resets the password for the user, and sends a success response.

### **2. Transaction Routes**
The Transaction module handles book borrowing and return operations.

- **POST `/api/transactions/borrow`**:
  - Allows members to borrow a book.
  - Expects: `bookId` and `userId` in the request body.
  - Middleware: `protect` (JWT validation) and `roleCheck("Member")`.
  - Functionality: Checks if the user is authenticated and has "Member" role, then processes the borrowing of the book.

- **POST `/api/transactions/return`**:
  - Allows members to return a borrowed book.
  - Expects: `bookId` and `userId` in the request body.
  - Middleware: `protect` (JWT validation) and `roleCheck("Member")`.
  - Functionality: Verifies the user's identity, checks if the book was borrowed, and processes the return.

- **GET `/api/transactions/all`**:
  - Fetches all borrowed books (Admin only).
  - Middleware: `protect` (JWT validation) and `roleCheck("Admin")`.
  - Functionality: Admins can see all borrowing transactions in the system.

### **3. Book Routes**
The Book module handles operations related to books in the library.

- **POST `/api/books`**:
  - Allows adding a new book to the library.
  - Expects: `title`, `author`, `category`, and `ISBN` in the request body.
  - Middleware: `protect` (JWT validation) and `roleCheck("Admin")`.
  - Functionality: Admin users can add new books to the library catalog.

- **GET `/api/books`**:
  - Fetches all books in the library.
  - Middleware: None required.
  - Functionality: Returns a list of all available books.

- **GET `/api/books/:id`**:
  - Fetches details of a single book by its `id`.
  - Functionality: Provides details for the specified book based on its unique identifier.

- **PUT `/api/books/:id`**:
  - Allows updating book details (title, author, etc.).
  - Expects: `title`, `author`, `category`, and `ISBN` in the request body.
  - Middleware: `protect` (JWT validation) and `roleCheck("Admin")`.
  - Functionality: Admin users can update book details.

- **DELETE `/api/books/:id`**:
  - Allows deleting a book from the library.
  - Middleware: `protect` (JWT validation) and `roleCheck("Admin")`.
  - Functionality: Admin users can delete a book from the library.

## ## 4. API Endpoints

### User Routes:
- **POST `/api/users/register`** - User registration
 
  
- **POST `/api/users/login`** - User login
 

- **POST `/api/users/forget-password`** - Request password reset
 

- **POST `/api/users/reset-password/:token`** - Reset password 

---

### Book Routes:
- **GET `/api/books/`** - Fetch all books
  

- **POST `/api/books/`** - Add a new book (Admin only)
  

- **GET `/api/books/:id`** - Fetch a specific book by ID
 

- **PUT `/api/books/:id`** - Update book details (Admin only)


- **DELETE `/api/books/:id`** - Delete a book (Admin only)


---

### Transaction Routes:
- **POST `/api/transactions/borrow`** - Borrow a book


- **POST `/api/transactions/return`** - Return a borrowed book
 

- **GET `/api/transactions/all`** - View all borrowed books (Admin 
