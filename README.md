# TaskIt
**TaskIt** is a task management application that allows users to manage their to-do lists, schedule events, and track work sessions using the Pomodoro technique. With seamless integration with Google Tasks and Google Calendar, TaskIt lets you view, add, and manage tasks and events in one place while staying productive with built-in Pomodoro timers.

## Try it!
You can try the app by visiting: [https://task-it-beryl.vercel.app/](https://task-it-beryl.vercel.app/)

## Features
- **Google Task Integration** - Add, view, and sync your tasks with Google Tasks in real-time.
- **Google Calendar Integration** - Add and view events on your Google Calendar directly from the app and sync events to stay up-to-date with your schedule.
- **Pomodoro Timer** - Work efficiently using the Pomodoro technique (25-minute work intervals with 5-minute breaks).

## Screenshots
- **Landing Page**  
  ![Landing Page](https://github.com/user-attachments/assets/c1623c35-8b45-4c8e-b91f-78b1c45644ef)

- **Tasks Page**  
  ![Tasks Page](https://github.com/user-attachments/assets/62800bcb-4e6a-47a7-b0ba-6295cbc7ae6f)

- **Events Page**  
  ![Events Page](https://github.com/user-attachments/assets/99efd5e0-e89e-4b6f-9023-3c2dde73a8f9)

- **Pomodoro Timer**  
  ![Pomodoro Timer](https://github.com/user-attachments/assets/1f52645e-e1e9-4b05-bbfd-ee8b47edde63)

## Installation
To run TaskIt locally, follow these steps:

### Prerequisites
- Node.js (version 14 or higher)
- npm (or yarn)
- Google API credentials for Google Tasks and Google Calendar integration.

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/Drisanth/TaskIt.git
   ```
2. Navigate to the project directory:
   ```bash
   cd TaskIt
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up Google API credentials:
   - Go to the [Google Developer Console](https://console.developers.google.com/).
   - Create a new project.
   - Enable the Google Tasks API and Google Calendar API.
   - Create OAuth 2.0 credentials for your app.
   - Download the credentials file (`credentials.json`) and place it in the root of the project.

### Run the application:
```bash
npm start
```

The app will be available at [http://localhost:3000](http://localhost:3000).
