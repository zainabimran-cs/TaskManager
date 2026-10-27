# Task Manager

A simple and responsive Task Manager application built with Next.js, MongoDB, and TanStack Query. It allows users to manage daily tasks through an easy-to-use interface.

## Features

- Add new tasks
- Edit task titles
- Delete tasks
- Mark tasks as completed or undo completion
- Filter tasks by All, Active, and Done
- Form validation and error handling
- Loading and error states
- Store tasks in MongoDB
- Cache and refresh data using TanStack Query
- Responsive user interface

## Technologies Used

- Next.js
- React
- JavaScript
- Tailwind CSS
- MongoDB
- MongoDB Node.js Driver
- TanStack Query
- ESLint

## Project Structure

```text
TaskManager/
├── app/
│   ├── api/
│   │   └── tasks/
│   │       ├── route.js
│   │       └── [id]/
│   │           └── route.js
│   ├── globals.css
│   ├── layout.js
│   ├── page.js
│   └── providers.js
├── lib/
│   └── mongodb.js
├── services/
│   └── taskService.js
├── .env.local
├── .gitignore
├── package.json
└── README.md
```

## Prerequisites

Before running the project, make sure you have:

- Node.js and npm installed
- A MongoDB database, such as MongoDB Atlas
- A MongoDB connection string

## Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd TaskManager
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual GitHub repository URL.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root and add:

```env
MONGODB_URI=your_mongodb_connection_string
```

Replace the placeholder with your MongoDB connection string. Never share or commit your actual database credentials.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Routes

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/tasks` | Fetch all tasks |
| POST | `/api/tasks` | Add a new task |
| PUT | `/api/tasks/[id]` | Edit a task title |
| PATCH | `/api/tasks/[id]` | Update task completion status |
| DELETE | `/api/tasks/[id]` | Delete a task |

The API validates incoming data and returns appropriate HTTP status codes for errors.

## Available Scripts

```bash
npm run dev
npm run lint
npm run build
```

- `npm run dev` starts the development server.
- `npm run lint` checks code for linting issues.
- `npm run build` creates a production build.

## Data Storage

Tasks are stored in MongoDB. The application uses a server-side API layer and a dedicated task service to keep database operations separate from UI components.

## Deployment

The application can be deployed on Vercel. Configure `MONGODB_URI` in the Vercel project's environment variables before deployment.

## Author

Developed as a Task Manager project using Next.js and MongoDB.
