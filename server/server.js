import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

const activeOTPs = new Map(); // email -> { otp, expires }

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'khandelwalprachi42@gmail.com',
    pass: 'lnyk aplv fydp kbve'
  }
});


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'database.json');

const JWT_SECRET = 'HACKCLUB_VIT_SECRET_SESSION_TOKEN_KEY_2026';

const app = express();
app.use(cors());
app.use(express.json());

// Database Helpers
async function readDB() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading database file:', err);
    return {};
  }
}

async function writeDB(data) {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing database file:', err);
  }
}

// Password Strength Validator (Matching Client Rules)
function validatePassword(p) {
  if (p.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(p)) return "Password must have at least 1 uppercase letter.";
  if (!/[a-z]/.test(p)) return "Password must have at least 1 lowercase letter.";
  if (!/[0-9]/.test(p)) return "Password must have at least 1 digit.";
  if (!/[^A-Za-z0-9]/.test(p)) return "Password must have at least 1 special character.";
  
  // Consecutive identical characters
  if (/([a-zA-Z0-9])\1/.test(p)) return "No identical consecutive alphabets or numbers allowed (e.g., 'aa', '11').";
  
  // Sequential characters
  for (let i = 0; i < p.length - 1; i++) {
    let c1 = p.charCodeAt(i);
    let c2 = p.charCodeAt(i + 1);
    if (c1 >= 48 && c1 <= 57 && c2 === c1 + 1) return "No sequential numbers allowed (e.g., '12').";
    if (c1 >= 97 && c1 <= 122 && c2 === c1 + 1) return "No sequential alphabets allowed (e.g., 'ab').";
    if (c1 >= 65 && c1 <= 90 && c2 === c1 + 1) return "No sequential alphabets allowed (e.g., 'AB').";
  }
  return null;
}

function validateEmail(email) {
  if (email === 'khandelwalprachi42@gmail.com') return true;
  if (email === 'admin@vitstudent.ac.in' || email === 'user@vitstudent.ac.in') return true;
  // Matches name.year@vitstudent.ac.in or name.lastnameyear@vitstudent.ac.in where year is 4 digits
  const regex = /^[a-zA-Z-]+\.([a-zA-Z-]+)?[0-9]{4}@vitstudent\.ac\.in$/;
  return regex.test(email);
}

// Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Access token required.' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired session token.' });
    req.user = user;
    next();
  });
}

// Send OTP Endpoint
app.post('/api/auth/send-otp', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Please enter your email.' });
  }
  
  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Enter your student email only in format name.lastnameYYYY@vitstudent.ac.in' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + 5 * 60 * 1000; // 5 minutes
  
  activeOTPs.set(email, { otp, expires });

  const mailOptions = {
    from: '"HackClub VIT Chennai" <khandelwalprachi42@gmail.com>',
    to: email,
    subject: '🔑 Your HackClub OTP Verification Code',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: auto; padding: 30px; border: 1px solid rgba(255, 68, 68, 0.2); border-radius: 16px; background-color: #0c0809; color: #f4ede4;">
        <div style="text-align: center; margin-bottom: 20px;">
          <span style="font-size: 24px; font-weight: bold; color: #ec3750; letter-spacing: 2px;">HACKCLUB</span>
          <span style="font-size: 24px; font-weight: bold; color: #f4ede4; letter-spacing: 2px;"> VIT CHENNAI</span>
        </div>
        <hr style="border: 0; border-top: 1px solid rgba(255, 68, 68, 0.2); margin-bottom: 20px;" />
        <p style="font-size: 16px; line-height: 1.6; color: #bfa8a2;">Hello,</p>
        <p style="font-size: 16px; line-height: 1.6; color: #bfa8a2;">Use the following security code to log in to the HackClub Portal:</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="display: inline-block; font-family: monospace; font-size: 38px; font-weight: bold; letter-spacing: 8px; color: #fff; background: linear-gradient(135deg, #ec3750, #d07d22); padding: 16px 32px; border-radius: 12px; box-shadow: 0 8px 20px rgba(236, 55, 80, 0.2);">${otp}</div>
        </div>
        <p style="font-size: 14px; line-height: 1.5; color: #ac120c; text-align: center; font-weight: 500;">This OTP is valid for 5 minutes. Do not share this code with anyone.</p>
        <hr style="border: 0; border-top: 1px solid rgba(255, 68, 68, 0.2); margin-top: 30px; margin-bottom: 20px;" />
        <p style="font-size: 12px; color: #bfa8a2; text-align: center; margin: 0;">This is an automated message. If you did not request this login, please ignore this email.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[OTP] Sent successfully to ${email}`);
    return res.json({ success: true, message: 'OTP sent to your email.' });
  } catch (err) {
    console.error('SMTP sending error:', err);
    return res.status(500).json({ error: 'Failed to send email. Please check your credentials or try again later.' });
  }
});

// Login via OTP Endpoint
app.post('/api/auth/login-otp', async (req, res) => {
  const { email, otp, role } = req.body;
  
  if (!email || !otp) {
    return res.status(400).json({ error: 'Please enter both email and OTP.' });
  }
  
  const record = activeOTPs.get(email);
  if (!record) {
    return res.status(400).json({ error: 'No active OTP found. Please send a new OTP.' });
  }
  
  if (Date.now() > record.expires) {
    activeOTPs.delete(email);
    return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
  }
  
  if (record.otp !== otp) {
    return res.status(400).json({ error: 'Incorrect OTP. Please try again.' });
  }
  
  // OTP is correct! Clear it.
  activeOTPs.delete(email);
  
  // Pre-configured mock credentials mapping
  const adminEmail = 'admin@vitstudent.ac.in';
  const userEmail = 'user@vitstudent.ac.in';
  
  let resolvedRole = role || 'user';
  let name = '';
  
  if (email === adminEmail) {
    resolvedRole = 'admin';
    name = 'Admin';
  } else if (email === userEmail) {
    resolvedRole = 'user';
    name = 'Priya Sharma';
  } else {
    // Dynamic user login fallback
    let emailPrefix = email.split('@')[0];
    let nameParts = emailPrefix.replace(/[0-9]/g, '').split('.').filter(Boolean);
    name = nameParts.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
  }
  
  const token = jwt.sign({ name, email, role: resolvedRole }, JWT_SECRET, { expiresIn: '7d' });
  return res.json({ token, role: resolvedRole, user: { name, email, role: resolvedRole } });
});

// Login Endpoint
app.post('/api/auth/login', async (req, res) => {
  const { email, password, role } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Please enter both email and password.' });
  }
  
  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Enter your student email only in format name.lastnameYYYY@vitstudent.ac.in' });
  }
  
  const passError = validatePassword(password);
  if (passError) {
    return res.status(400).json({ error: passError });
  }

  // Pre-configured mock credentials
  const adminEmail = 'admin@vitstudent.ac.in';
  const userEmail = 'user@vitstudent.ac.in';
  const validPassword = 'Hackclub@2026';

  if (password !== validPassword) {
    return res.status(400).json({ error: 'Invalid email or password.' });
  }

  let resolvedRole = role || 'user';
  let name = '';
  
  if (email === adminEmail) {
    resolvedRole = 'admin';
    name = 'Admin';
  } else if (email === userEmail) {
    resolvedRole = 'user';
    name = 'Priya Sharma';
  } else {
    // Dynamic user login fallback
    let emailPrefix = email.split('@')[0];
    let nameParts = emailPrefix.replace(/[0-9]/g, '').split('.').filter(Boolean);
    name = nameParts.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
  }

  const token = jwt.sign({ name, email, role: resolvedRole }, JWT_SECRET, { expiresIn: '7d' });
  return res.json({ token, role: resolvedRole, user: { name, email, role: resolvedRole } });
});

// Signup Endpoint
app.post('/api/auth/signup', async (req, res) => {
  const { email, password, name } = req.body;
  
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Please fill in all fields.' });
  }
  
  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Enter your student email only in format name.lastnameYYYY@vitstudent.ac.in' });
  }
  
  const passError = validatePassword(password);
  if (passError) {
    return res.status(400).json({ error: passError });
  }
  
  const db = await readDB();
  if (!db.users) db.users = [];
  
  const userExists = db.users.some(u => u.email === email);
  if (userExists) {
    return res.status(400).json({ error: 'Account with this email already exists.' });
  }
  
  const newUser = {
    id: Date.now(),
    name,
    email,
    role: 'Member',
    status: 'Active',
    isReviewer: false,
    projectsUploaded: 0,
    averageRating: '0.0',
    badges: ['New Maker'],
    recentProjects: [],
    projectRatingScore: 0,
    contributionScore: 10,
    eventScore: 5,
    totalScore: 7
  };
  
  db.users.push(newUser);
  await writeDB(db);
  
  return res.status(201).json({ success: true, message: 'Registration successful. You can now login.' });
});

// Current User Details
app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// Fetch all database state (Dynamic User Personalization)
app.get('/api/data', authenticateToken, async (req, res) => {
  const db = await readDB();
  
  if (!db.users) db.users = [];
  
  // Find or create user entry in db.users matching the logged in user
  let user = db.users.find(u => u.email === req.user.email || u.name === req.user.name);
  if (!user) {
    user = {
      id: Date.now(),
      name: req.user.name,
      email: req.user.email,
      role: req.user.role === 'admin' ? 'Admin' : 'Member',
      status: 'Active',
      isReviewer: req.user.role === 'admin',
      projectsUploaded: 0,
      averageRating: '0.0',
      badges: req.user.role === 'admin' ? ['Lead Organizer'] : ['New Maker'],
      recentProjects: [],
      projectRatingScore: 0,
      contributionScore: 10,
      eventScore: 5,
      totalScore: 7
    };
    db.users.push(user);
    await writeDB(db);
  }

  // Customize profile and contributions for the session user
  const profile = {
    name: user.name,
    role: user.role,
    registerNumber: user.registerNumber || '24BCE' + (user.id % 9000 + 1000),
    email: user.email,
    phoneNumber: user.phoneNumber || '+91 98765 ' + (user.id % 90000 + 10000),
    location: user.location || 'Chennai',
    joined: user.joined || 'Jun 2026',
    github: user.github || `github.com/${user.email.split('@')[0]}`,
    portfolio: user.portfolio || `${user.email.split('@')[0]}.dev`,
    badges: user.badges,
    isReviewer: user.isReviewer,
    avatar: user.avatar || `emoji:👤`
  };

  const contributions = [
    { label: 'Projects contributed', value: String(user.projectsUploaded) },
    { label: 'Contribution Score', value: String(user.contributionScore) },
    { label: 'Event Score', value: String(user.eventScore) },
    { label: 'Total Performance Score', value: `${user.totalScore} pts` }
  ];

  res.json({
    ...db,
    profile,
    contributions
  });
});

// Fetch public leaderboard state (No token required for public landing page!)
app.get('/api/public/leaderboard', async (req, res) => {
  const db = await readDB();
  const sortedUsers = [...(db.users || [])].sort((a, b) => b.totalScore - a.totalScore);
  res.json(sortedUsers);
});

// Submit a new project
app.post('/api/projects', authenticateToken, async (req, res) => {
  const db = await readDB();
  const { title, description, github, deployment, owner } = req.body;
  
  const newProj = {
    id: Date.now(),
    title,
    description,
    github,
    deployment,
    status: 'Pending',
    owner: owner || req.user.name,
    rating: '0.0',
    submissionDate: new Date().toISOString().split('T')[0],
    technologiesUsed: ['React', 'CSS'],
    individualRatings: [],
    awards: []
  };

  db.projects = [newProj, ...(db.projects || [])];
  
  // Add to recent activity
  const newActivity = {
    id: Date.now(),
    label: 'Submitted project proposal',
    detail: `"${title}" was submitted for review`,
    time: 'Just now'
  };
  db.recentActivities = [newActivity, ...(db.recentActivities || [])].slice(0, 10);
  
  await writeDB(db);
  res.status(201).json({ project: newProj, db });
});

// Save entire projects list
app.put('/api/projects', authenticateToken, async (req, res) => {
  const db = await readDB();
  db.projects = req.body;
  await writeDB(db);
  res.json(db);
});

// Evaluate a project
app.put('/api/projects/:id/rate', authenticateToken, async (req, res) => {
  const db = await readDB();
  const { id } = req.params;
  const { rating, comment } = req.body;

  const projectIndex = db.projects.findIndex(p => p.id === parseInt(id, 10));
  if (projectIndex === -1) return res.status(404).json({ error: 'Project not found.' });

  const project = db.projects[projectIndex];
  if (!project.individualRatings) project.individualRatings = [];

  // Update or insert rating by user
  const existingRatingIndex = project.individualRatings.findIndex(r => r.user === req.user.name);
  if (existingRatingIndex !== -1) {
    project.individualRatings[existingRatingIndex] = { user: req.user.name, rating: parseFloat(rating), comment };
  } else {
    project.individualRatings.push({ user: req.user.name, rating: parseFloat(rating), comment });
  }

  // Calculate new average rating
  const validRatings = project.individualRatings.filter(r => !isNaN(parseFloat(r.rating)));
  const avg = validRatings.length > 0
    ? (validRatings.reduce((sum, r) => sum + r.rating, 0) / validRatings.length)
    : 0;

  project.rating = avg.toFixed(1);
  db.projects[projectIndex] = project;

  // Add review activity
  const newActivity = {
    id: Date.now(),
    label: 'Reviewed project',
    detail: `Left evaluation on "${project.title}"`,
    time: 'Just now'
  };
  db.recentActivities = [newActivity, ...(db.recentActivities || [])].slice(0, 10);

  await writeDB(db);
  res.json({ project, db });
});

// Save entire uploads list
app.put('/api/uploads', authenticateToken, async (req, res) => {
  const db = await readDB();
  db.uploads = req.body;
  await writeDB(db);
  res.json(db);
});

// Update upload approval status
app.put('/api/uploads/:id/status', authenticateToken, async (req, res) => {
  const db = await readDB();
  const { id } = req.params;
  const { status } = req.body; // Approved / Rejected

  db.uploads = db.uploads.map(u => u.id === parseInt(id, 10) ? { ...u, status } : u);
  await writeDB(db);
  res.json(db);
});

// Save entire announcements list
app.put('/api/announcements', authenticateToken, async (req, res) => {
  const db = await readDB();
  db.announcements = req.body;
  await writeDB(db);
  res.json(db);
});

// Add announcements
app.post('/api/announcements', authenticateToken, async (req, res) => {
  const db = await readDB();
  const { title, body, label } = req.body;

  const newAnn = {
    id: Date.now(),
    title,
    body,
    label: label || 'Info'
  };

  db.announcements = [newAnn, ...(db.announcements || [])];
  await writeDB(db);
  res.status(201).json({ announcement: newAnn, db });
});

// Manage user details (Admin)
app.put('/api/users', authenticateToken, async (req, res) => {
  const db = await readDB();
  db.users = req.body;
  await writeDB(db);
  res.json(db);
});

app.put('/api/users/:id', authenticateToken, async (req, res) => {
  const db = await readDB();
  const { id } = req.params;
  const updateData = req.body;

  db.users = db.users.map(u => u.id === parseInt(id, 10) ? { ...u, ...updateData } : u);
  await writeDB(db);
  res.json(db);
});

// Delete user details (Admin)
app.delete('/api/users/:id', authenticateToken, async (req, res) => {
  const db = await readDB();
  const { id } = req.params;

  db.users = db.users.filter(u => u.id !== parseInt(id, 10));
  await writeDB(db);
  res.json(db);
});

// Submit user feedback or bug report
app.post('/api/feedback', authenticateToken, async (req, res) => {
  const db = await readDB();
  const { title, description } = req.body;

  const newFeedback = {
    id: Date.now(),
    user: req.user.name,
    message: description || title,
    type: 'Bug Report'
  };

  db.feedbacks = [newFeedback, ...(db.feedbacks || [])];
  await writeDB(db);
  res.status(201).json(db);
});

// Leaderboard engine - Recalculate and refresh scores
app.post('/api/leaderboard/refresh', authenticateToken, async (req, res) => {
  const db = await readDB();

  db.users = db.users.map(user => {
    // Calculate Project Rating score dynamically based on average ratings
    const userProjects = db.projects.filter(p => p.owner === user.name);
    let totalRatingSum = 0;
    let ratedProjectsCount = 0;
    
    userProjects.forEach(p => {
      const pRating = parseFloat(p.rating);
      if (!isNaN(pRating) && pRating > 0) {
        totalRatingSum += pRating;
        ratedProjectsCount++;
      }
    });
    
    const newAvgRating = ratedProjectsCount > 0 ? (totalRatingSum / ratedProjectsCount) : 0;
    const newProjectRatingScore = Math.round((newAvgRating / 10) * 100); // normalized based on 10 star rating

    // 70% project ratings + 20% contributions + 10% events
    const newTotalScore = Math.round(
      (newProjectRatingScore * 0.7) + 
      ((user.contributionScore || 0) * 0.2) + 
      ((user.eventScore || 0) * 0.1)
    );

    return {
      ...user,
      averageRating: newAvgRating.toFixed(1),
      projectRatingScore: newProjectRatingScore,
      totalScore: newTotalScore
    };
  });

  await writeDB(db);
  res.json(db);
});

// Leaderboard winners - Publish winners
app.post('/api/leaderboard/winners', authenticateToken, async (req, res) => {
  const db = await readDB();
  const { topContributor, topProject, mostActive, bestInnovation } = req.body;

  db.weeklyWinners = {
    topContributor,
    topProject,
    mostActive,
    bestInnovation
  };

  // Automatically publish to announcements
  const winnerAnnouncement = {
    id: Date.now(),
    title: '🏆 Weekly Winners Announced!',
    body: `Congratulations to ${topContributor} for being the Top Contributor, and "${topProject}" for being the Top Project of the week!`,
    label: 'Winner'
  };

  db.announcements = [winnerAnnouncement, ...(db.announcements || [])];
  await writeDB(db);
  res.json(db);
});

// Save entire events list
app.put('/api/events', authenticateToken, async (req, res) => {
  const db = await readDB();
  db.eventsList = req.body;
  await writeDB(db);
  res.json(db);
});

// Save entire team updates list
app.put('/api/team-updates', authenticateToken, async (req, res) => {
  const db = await readDB();
  db.teamUpdates = req.body;
  await writeDB(db);
  res.json(db);
});

// Save entire feedbacks list
app.put('/api/feedbacks', authenticateToken, async (req, res) => {
  const db = await readDB();
  db.feedbacks = req.body;
  await writeDB(db);
  res.json(db);
});

// Save user profile details
app.put('/api/profile', authenticateToken, async (req, res) => {
  const db = await readDB();
  const profileUpdate = req.body;
  
  if (!db.users) db.users = [];
  
  const userIndex = db.users.findIndex(u => u.email === req.user.email || u.name === req.user.name);
  if (userIndex !== -1) {
    db.users[userIndex] = {
      ...db.users[userIndex],
      name: profileUpdate.name || db.users[userIndex].name,
      phoneNumber: profileUpdate.phoneNumber || db.users[userIndex].phoneNumber,
      github: profileUpdate.github || db.users[userIndex].github,
      portfolio: profileUpdate.portfolio || db.users[userIndex].portfolio,
      avatar: profileUpdate.avatar || db.users[userIndex].avatar,
      registerNumber: profileUpdate.registerNumber || db.users[userIndex].registerNumber,
      location: profileUpdate.location || db.users[userIndex].location
    };
  }
  
  db.profile = profileUpdate;
  await writeDB(db);
  res.json(db);
});

// Save contributions details
app.put('/api/contributions', authenticateToken, async (req, res) => {
  const db = await readDB();
  db.contributions = req.body;
  await writeDB(db);
  res.json(db);
});

// Save system status details
app.put('/api/system-status', authenticateToken, async (req, res) => {
  const db = await readDB();
  db.systemStatus = req.body;
  await writeDB(db);
  res.json(db);
});

// Save recent activities details
app.put('/api/activities', authenticateToken, async (req, res) => {
  const db = await readDB();
  db.recentActivities = req.body;
  await writeDB(db);
  res.json(db);
});

// Save weekly winners
app.put('/api/weekly-winners', authenticateToken, async (req, res) => {
  const db = await readDB();
  db.weeklyWinners = req.body;
  await writeDB(db);
  res.json(db);
});

// Save monthly winners
app.put('/api/monthly-winners', authenticateToken, async (req, res) => {
  const db = await readDB();
  db.monthlyWinners = req.body;
  await writeDB(db);
  res.json(db);
});

// Launch server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 HackClub Server running on http://localhost:${PORT}`);
});
