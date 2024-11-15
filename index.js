// Import required modules
const express = require('express');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Initialize express app
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the "public" and "static" directories
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(path.join(__dirname, 'static'))); // Serve static folder for images, CSS, JS, etc.

// Google OAuth2 setup using environment variables
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,        // Client ID from environment variable
  process.env.GOOGLE_CLIENT_SECRET,    // Client Secret from environment variable
  process.env.GOOGLE_REDIRECT_URI      // Redirect URI from environment variable
);

// Google Calendar API setup
const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

// Google Tasks API setup
const tasks = google.tasks({ version: 'v1', auth: oauth2Client });

// Route: Google Authentication
app.get('/auth/google', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/tasks',
    ],
  });
  res.redirect(authUrl);
});

// Route: Google OAuth2 callback
app.get('/auth/google/callback', async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Error during Google authentication:', err);
    res.status(500).send('Authentication failed');
  }
});

// Route: Serve dashboard page after successful login
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Route: Create a new calendar event
app.post('/create-event', async (req, res) => {
  const { summary, description, location, startTime, endTime } = req.body;

  if (!oauth2Client.credentials) {
    return res.status(401).send('User is not authenticated');
  }
  const start = new Date(startTime).toISOString();
  const end = new Date(endTime).toISOString();
  const event = {
    summary,
    location,
    description,
    start: {
      dateTime: start,
      timeZone: 'Asia/Kolkata'
    },
    end: {
      dateTime: end,
      timeZone: 'Asia/Kolkata'
    },
    reminders: {
      useDefault: true,
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });
    res.json({ eventId: response.data.id, message: 'Event created successfully' });
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).send('Failed to create event');
  }
});

// Route: Get upcoming events
app.get('/events', async (req, res) => {
  if (!oauth2Client.credentials) {
    return res.status(401).send('User is not authenticated');
  }

  const now = new Date().toISOString();
  try {
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: now,
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items;
    if (events.length) {
      res.json(events);
    } else {
      res.status(404).send('No upcoming events found.');
    }
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).send('Failed to fetch events');
  }
});

// Route: Get tasks from Google Tasks
app.get('/tasks', async (req, res) => {
  if (!oauth2Client.credentials) {
    return res.status(401).send('User is not authenticated');
  }

  try {
    const response = await tasks.tasks.list({
      tasklist: '@default',
    });

    const tasksList = response.data.items;
    if (tasksList && tasksList.length) {
      res.json(tasksList.map(task => ({
        id: task.id,
        title: task.title,
        due: task.due,
        completed: task.status === 'completed', // Add completed status
      })));
    } else {
      res.status(404).send('No tasks found.');
    }
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).send('Failed to fetch tasks');
  }
});

// Route: Create a new task in Google Tasks
app.post('/create-task', async (req, res) => {
  const { title, dueDate } = req.body;

  if (!oauth2Client.credentials) {
    return res.status(401).send('User is not authenticated');
  }

  try {
    const task = {
      title: title,
      due: new Date(dueDate).toISOString(),
      status: 'needsAction' // New task is set as not completed
    };

    const response = await tasks.tasks.insert({
      tasklist: '@default',
      resource: task,
    });

    res.json({ taskId: response.data.id, message: 'Task created successfully' });
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).send('Failed to create task');
  }
});

// Serve the tasks.html page when requested
app.get('/tasks.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tasks.html'));
});

// Serve the events.html page when requested
app.get('/events.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'events.html'));
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
