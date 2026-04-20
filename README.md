# TodoList Fullstack Project

## Overview
This is a task management application featuring a .NET Minimal API backend and a React frontend.

## Technologies Used
* **Backend:** .NET 8, Minimal API, Entity Framework Core.
* **Database:** MySQL.
* **Frontend:** React, Axios.
* **Security:** JWT Authentication (Optional/Challenge).

## Features
* CRUD operations (Create, Read, Update, Delete) for tasks.
* Database-first approach with EF Core.
* CORS configuration for frontend-backend communication.
* Axios Interceptors for error handling.

## How to Run
1. **Backend:**
   - Update `appsettings.json` with your MySQL connection string.
   - Run `dotnet build` and `dotnet watch run`.
2. **Frontend:**
   - Go to client folder: `cd ToDoListReact`.
   - Install dependencies: `npm install`.
   - Start the app: `npm start`.
