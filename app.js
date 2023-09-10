const express = require('express');
const app = express();
const fs = require('fs');
const cors = require('cors'); // Import the 'cors' middleware

// Enable CORS for all routes
app.use(cors());

const PORT = process.env.PORT || 3001; // Use port 3001 for the API

// Read user data from the users.json file
const userData = JSON.parse(fs.readFileSync('users.json', 'utf-8'));

app.get('/', (req, res) => {
  res.json(userData);
});



// Endpoint to get user details without projects
app.get('/api/users', (req, res) => {
  // Create a new array to store user details without projects
  const usersWithoutProjects = userData.users.map(user => {
    // Destructure the user object and remove the "projects" property
    const { projects, ...userWithoutProjects } = user;
    return userWithoutProjects;
  });

  res.json(usersWithoutProjects);
});

// Endpoint to get all projects of a specific user by ID
app.get('/api/users/:id/projects', (req, res) => {
  const userId = parseInt(req.params.id);

  // Find the user with the specified ID
  const user = userData.users.find(user => user.id === userId);

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  // Add the user's ID to each project
  const projectsWithUserId = user.projects.map(project => {
    return {
      user_id: user.id,
      ...project
    };
  });

  // Return the projects of the specific user with user IDs
  res.json(projectsWithUserId);
});

app.listen(PORT, () => {
  console.log(`API is running on port ${PORT}`);
});
