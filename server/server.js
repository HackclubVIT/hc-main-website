import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import prisma from './prismaClient.js';

const activeOTPs = new Map(); // email -> { otp, expires }  (login)
const passwordResetOTPs = new Map(); // email -> { otp, expires }  (password reset)

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER || 'khandelwalprachi42@gmail.com',
    pass: process.env.SMTP_PASS || 'lnyk aplv fydp kbve'
  }
});

const JWT_SECRET = process.env.JWT_SECRET || 'HACKCLUB_VIT_SECRET_SESSION_TOKEN_KEY_2026';

const app = express();
app.use(cors());
app.use(express.json());

/* ------------------------------------------------------------------ */
/* Collection (key/value) helpers                                      */
/* ------------------------------------------------------------------ */

const COLLECTION_KEYS = [
  'announcements', 'uploads', 'recentActivities', 'eventsList',
  'teamUpdates', 'feedbacks', 'systemStatus', 'weeklyWinners',
  'monthlyWinners', 'profile', 'contributions'
];

async function getCollection(name, fallback = []) {
  const row = await prisma.collection.findUnique({ where: { name } });
  return row ? row.data : fallback;
}

async function setCollection(name, data) {
  await prisma.collection.upsert({
    where: { name },
    update: { data },
    create: { name, data }
  });
  return data;
}

/* ------------------------------------------------------------------ */
/* Row mappers (sanitize incoming payloads to known columns)           */
/* ------------------------------------------------------------------ */

const toBig = (v) => BigInt(typeof v === 'string' ? v.replace(/[^0-9]/g, '') || Date.now() : Math.round(v));

function mapUser(u) {
  return {
    id: toBig(u.id ?? Date.now()),
    name: u.name ?? 'Member',
    email: u.email ?? null,
    password: u.password ?? null,
    role: u.role ?? 'Member',
    status: u.status ?? 'Active',
    isReviewer: !!u.isReviewer,
    projectsUploaded: Number(u.projectsUploaded ?? 0),
    averageRating: String(u.averageRating ?? '0.0'),
    badges: u.badges ?? [],
    recentProjects: u.recentProjects ?? [],
    projectRatingScore: Number(u.projectRatingScore ?? 0),
    contributionScore: Number(u.contributionScore ?? 10),
    eventScore: Number(u.eventScore ?? 5),
    totalScore: Number(u.totalScore ?? 7),
    registerNumber: u.registerNumber ?? null,
    phoneNumber: u.phoneNumber ?? null,
    location: u.location ?? null,
    joined: u.joined ?? null,
    github: u.github ?? null,
    portfolio: u.portfolio ?? null,
    avatar: u.avatar ?? null
  };
}

function mapProject(p) {
  return {
    id: toBig(p.id ?? Date.now()),
    title: p.title ?? 'Untitled',
    description: p.description ?? null,
    github: p.github ?? null,
    deployment: p.deployment ?? null,
    status: p.status ?? 'Pending',
    owner: p.owner ?? null,
    rating: String(p.rating ?? '0.0'),
    contributors: p.contributors ?? null,
    submissionDate: p.submissionDate ?? null,
    technologiesUsed: p.technologiesUsed ?? [],
    awards: p.awards ?? [],
    individualRatings: p.individualRatings ?? []
  };
}

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

function validatePassword(p) {
  if (p.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(p)) return "Password must have at least 1 uppercase letter.";
  if (!/[a-z]/.test(p)) return "Password must have at least 1 lowercase letter.";
  if (!/[0-9]/.test(p)) return "Password must have at least 1 digit.";
  if (!/[^A-Za-z0-9]/.test(p)) return "Password must have at least 1 special character.";
  if (/([a-zA-Z0-9])\1/.test(p)) return "No identical consecutive alphabets or numbers allowed (e.g., 'aa', '11').";
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
  const regex = /^[a-zA-Z-]+\.([a-zA-Z-]+)?[0-9]{4}@vitstudent\.ac\.in$/;
  return regex.test(email);
}

async function findUserByEmail(email) {
  if (!email) return null;
  return prisma.user.findUnique({ where: { email } });
}

// Never send the password column to the client.
function stripPassword(user) {
  if (!user) return user;
  // eslint-disable-next-line no-unused-vars
  const { password, ...safe } = user;
  return safe;
}
const stripPasswords = (users) => users.map(stripPassword);

async function isEmailAllowed(email) {
  // Demo accounts are always permitted.
  if (email === 'admin@vitstudent.ac.in' || email === 'user@vitstudent.ac.in' || email === 'khandelwalprachi42@gmail.com') {
    return true;
  }
  const entry = await prisma.allowedEmail.findUnique({ where: { email } });
  return !!entry;
}

/* ------------------------------------------------------------------ */
/* Auth middleware                                                     */
/* ------------------------------------------------------------------ */

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

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admin access only.' });
  }
  next();
}

function resolveDisplayName(email, dbUser) {
  if (dbUser?.name) return dbUser.name;
  let emailPrefix = email.split('@')[0];
  let nameParts = emailPrefix.replace(/[0-9]/g, '').split('.').filter(Boolean);
  return nameParts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ') || 'Member';
}

function resolveRole(email, dbUser, requested) {
  if (email === 'admin@vitstudent.ac.in') return 'admin';
  if (email === 'user@vitstudent.ac.in') return 'user';
  if (dbUser) return (dbUser.role || '').toLowerCase() === 'admin' ? 'admin' : 'user';
  return requested || 'user';
}

function buildOtpEmail(email, otp) {
  return {
    from: `"HackClub VIT Chennai" <${process.env.SMTP_USER || 'khandelwalprachi42@gmail.com'}>`,
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
}

/* ================================================================== */
/* AUTH                                                                */
/* ================================================================== */

// Send OTP — requires the email to already belong to a registered user.
app.post('/api/auth/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Please enter your email.' });
  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Enter your student email only in format name.lastnameYYYY@vitstudent.ac.in' });
  }

  const isDemo = email === 'admin@vitstudent.ac.in' || email === 'user@vitstudent.ac.in';
  const user = await findUserByEmail(email);
  if (!user && !isDemo) {
    return res.status(404).json({ error: 'No account found with this email. Please sign up first.' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + 5 * 60 * 1000;
  activeOTPs.set(email, { otp, expires });

  transporter.sendMail(buildOtpEmail(email, otp))
    .then(() => console.log(`[OTP] Sent successfully to ${email}`))
    .catch((err) => console.error('SMTP sending error:', err));

  return res.json({ success: true, message: 'OTP sent to your email.' });
});

// Login via OTP — verifies code and that the user exists.
app.post('/api/auth/login-otp', async (req, res) => {
  const { email, otp, role } = req.body;
  if (!email || !otp) return res.status(400).json({ error: 'Please enter both email and OTP.' });

  const record = activeOTPs.get(email);
  if (!record) return res.status(400).json({ error: 'No active OTP found. Please send a new OTP.' });
  if (Date.now() > record.expires) {
    activeOTPs.delete(email);
    return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
  }
  if (record.otp !== otp) return res.status(400).json({ error: 'Incorrect OTP. Please try again.' });
  activeOTPs.delete(email);

  const dbUser = await findUserByEmail(email);
  const isDemo = email === 'admin@vitstudent.ac.in' || email === 'user@vitstudent.ac.in';
  if (!dbUser && !isDemo) {
    return res.status(404).json({ error: 'No account found with this email. Please sign up first.' });
  }

  const resolvedRole = resolveRole(email, dbUser, role);
  const name = resolveDisplayName(email, dbUser);
  const token = jwt.sign({ name, email, role: resolvedRole }, JWT_SECRET, { expiresIn: '7d' });
  return res.json({ token, role: resolvedRole, user: { name, email, role: resolvedRole } });
});

// Password login — verifies the email exists and the shared club password.
app.post('/api/auth/login', async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Please enter both email and password.' });
  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Enter your student email only in format name.lastnameYYYY@vitstudent.ac.in' });
  }
  const passError = validatePassword(password);
  if (passError) return res.status(400).json({ error: passError });

  const dbUser = await findUserByEmail(email);
  const isDemo = email === 'admin@vitstudent.ac.in' || email === 'user@vitstudent.ac.in';
  if (!dbUser && !isDemo) {
    return res.status(404).json({ error: 'No account found with this email. Please sign up first.' });
  }

  // A user's own password (set at signup or via reset) takes precedence; otherwise
  // the shared club password is accepted.
  const expectedPassword = dbUser?.password || 'Hackclub@2026';
  if (password !== expectedPassword) return res.status(400).json({ error: 'Invalid email or password.' });

  const resolvedRole = resolveRole(email, dbUser, role);
  const name = resolveDisplayName(email, dbUser);
  const token = jwt.sign({ name, email, role: resolvedRole }, JWT_SECRET, { expiresIn: '7d' });
  return res.json({ token, role: resolvedRole, user: { name, email, role: resolvedRole } });
});

// Signup — gated by the admin-managed allowlist + email format.
app.post('/api/auth/signup', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) return res.status(400).json({ error: 'Please fill in all fields.' });
  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Enter your student email only in format name.lastnameYYYY@vitstudent.ac.in' });
  }

  const allowed = await isEmailAllowed(email);
  if (!allowed) {
    return res.status(403).json({ error: 'This email is not approved for signup. Please contact a HackClub admin to be added to the allowlist.' });
  }

  const passError = validatePassword(password);
  if (passError) return res.status(400).json({ error: passError });

  const existing = await findUserByEmail(email);
  if (existing) return res.status(400).json({ error: 'Account with this email already exists.' });

  await prisma.user.create({
    data: mapUser({
      id: Date.now(),
      name,
      email,
      password,
      role: 'Member',
      status: 'Active',
      badges: ['New Maker'],
      contributionScore: 10,
      eventScore: 5,
      totalScore: 7
    })
  });

  return res.status(201).json({ success: true, message: 'Registration successful. You can now login.' });
});

// Forgot password (step 1) — emails a reset OTP if the account exists.
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Please enter your email.' });
  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Enter your student email only in format name.lastnameYYYY@vitstudent.ac.in' });
  }
  const isDemo = email === 'admin@vitstudent.ac.in' || email === 'user@vitstudent.ac.in';
  const user = await findUserByEmail(email);
  if (!user && !isDemo) {
    return res.status(404).json({ error: 'No account found with this email.' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + 5 * 60 * 1000; // 5 minutes
  passwordResetOTPs.set(email, { otp, expires });

  transporter.sendMail(buildOtpEmail(email, otp))
    .then(() => console.log(`[RESET OTP] Sent successfully to ${email}`))
    .catch((err) => console.error('SMTP sending error (reset):', err));

  return res.json({ success: true, message: 'A password reset OTP has been sent to your email.' });
});

// Forgot password (step 2) — verifies the reset OTP without consuming it.
app.post('/api/auth/verify-reset-otp', async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: 'Please enter both email and OTP.' });

  const record = passwordResetOTPs.get(email);
  if (!record) return res.status(400).json({ error: 'No active reset request found. Please request a new OTP.' });
  if (Date.now() > record.expires) {
    passwordResetOTPs.delete(email);
    return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
  }
  if (record.otp !== otp) return res.status(400).json({ error: 'Incorrect OTP. Please try again.' });

  return res.json({ success: true, message: 'OTP verified. You can now set a new password.' });
});

// Forgot password (step 3) — re-verifies the OTP and sets the new password.
app.post('/api/auth/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ error: 'Email, OTP and new password are all required.' });
  }

  const record = passwordResetOTPs.get(email);
  if (!record) return res.status(400).json({ error: 'No active reset request found. Please request a new OTP.' });
  if (Date.now() > record.expires) {
    passwordResetOTPs.delete(email);
    return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
  }
  if (record.otp !== otp) return res.status(400).json({ error: 'Incorrect OTP. Please try again.' });

  const passError = validatePassword(newPassword);
  if (passError) return res.status(400).json({ error: passError });

  const user = await findUserByEmail(email);
  if (!user) return res.status(404).json({ error: 'No account found with this email.' });

  await prisma.user.update({ where: { id: user.id }, data: { password: newPassword } });
  passwordResetOTPs.delete(email);

  return res.json({ success: true, message: 'Password updated successfully. You can now log in with your new password.' });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

/* ================================================================== */
/* GLOBAL STATE                                                        */
/* ================================================================== */

app.get('/api/data', authenticateToken, async (req, res) => {
  let dbUser = await findUserByEmail(req.user.email);

  // Create a user record on first login if one doesn't exist yet (demo accounts).
  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: mapUser({
        id: Date.now(),
        name: req.user.name,
        email: req.user.email,
        role: req.user.role === 'admin' ? 'Admin' : 'Member',
        isReviewer: req.user.role === 'admin',
        badges: req.user.role === 'admin' ? ['Lead Organizer'] : ['New Maker'],
        contributionScore: 10,
        eventScore: 5,
        totalScore: 7
      })
    });
  }

  const [users, projects, recruitmentApplications, allowedEmails] = await Promise.all([
    prisma.user.findMany({ orderBy: { id: 'asc' } }),
    prisma.project.findMany({ orderBy: { id: 'desc' } }),
    prisma.recruitmentApplication.findMany({ orderBy: { id: 'desc' } }),
    prisma.allowedEmail.findMany({ orderBy: { createdAt: 'asc' } })
  ]);

  const collections = {};
  for (const key of COLLECTION_KEYS) {
    collections[key] = await getCollection(key, key === 'weeklyWinners' || key === 'monthlyWinners' || key === 'profile' ? {} : []);
  }

  const profile = {
    name: dbUser.name,
    role: dbUser.role,
    registerNumber: dbUser.registerNumber || '24BCE' + (Number(dbUser.id % 9000n) + 1000),
    email: dbUser.email,
    phoneNumber: dbUser.phoneNumber || '+91 98765 ' + (Number(dbUser.id % 90000n) + 10000),
    location: dbUser.location || 'Chennai',
    joined: dbUser.joined || 'Jun 2026',
    github: dbUser.github || `github.com/${(dbUser.email || 'member').split('@')[0]}`,
    portfolio: dbUser.portfolio || `${(dbUser.email || 'member').split('@')[0]}.dev`,
    badges: dbUser.badges,
    isReviewer: dbUser.isReviewer,
    avatar: dbUser.avatar || `emoji:👤`
  };

  const contributions = [
    { label: 'Projects contributed', value: String(dbUser.projectsUploaded) },
    { label: 'Contribution Score', value: String(dbUser.contributionScore) },
    { label: 'Event Score', value: String(dbUser.eventScore) },
    { label: 'Total Performance Score', value: `${dbUser.totalScore} pts` }
  ];

  res.json({
    users: stripPasswords(users),
    projects,
    recruitmentApplications,
    allowedEmails,
    ...collections,
    profile,
    contributions
  });
});

app.get('/api/public/leaderboard', async (req, res) => {
  const users = await prisma.user.findMany();
  const sorted = [...users].sort((a, b) => b.totalScore - a.totalScore);
  res.json(stripPasswords(sorted));
});

/* ================================================================== */
/* PROJECTS                                                            */
/* ================================================================== */

app.post('/api/projects', authenticateToken, async (req, res) => {
  const { title, description, github, deployment, owner } = req.body;
  const created = await prisma.project.create({
    data: mapProject({
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
    })
  });

  const activities = await getCollection('recentActivities', []);
  const newActivity = { id: Date.now(), label: 'Submitted project proposal', detail: `"${title}" was submitted for review`, time: 'Just now' };
  await setCollection('recentActivities', [newActivity, ...activities].slice(0, 10));

  res.status(201).json({ project: created });
});

// Replace entire projects list.
app.put('/api/projects', authenticateToken, async (req, res) => {
  const incoming = Array.isArray(req.body) ? req.body : [];
  await prisma.$transaction([
    prisma.project.deleteMany({}),
    prisma.project.createMany({ data: incoming.map(mapProject) })
  ]);
  const projects = await prisma.project.findMany({ orderBy: { id: 'desc' } });
  res.json({ projects });
});

app.put('/api/projects/:id/rate', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  const project = await prisma.project.findUnique({ where: { id: toBig(id) } });
  if (!project) return res.status(404).json({ error: 'Project not found.' });

  const individualRatings = Array.isArray(project.individualRatings) ? [...project.individualRatings] : [];
  const idx = individualRatings.findIndex((r) => r.user === req.user.name);
  const entry = { user: req.user.name, rating: parseFloat(rating), comment };
  if (idx !== -1) individualRatings[idx] = entry; else individualRatings.push(entry);

  const valid = individualRatings.filter((r) => !isNaN(parseFloat(r.rating)));
  const avg = valid.length > 0 ? valid.reduce((s, r) => s + r.rating, 0) / valid.length : 0;

  const updated = await prisma.project.update({
    where: { id: project.id },
    data: { individualRatings, rating: avg.toFixed(1) }
  });

  const activities = await getCollection('recentActivities', []);
  const newActivity = { id: Date.now(), label: 'Reviewed project', detail: `Left evaluation on "${project.title}"`, time: 'Just now' };
  await setCollection('recentActivities', [newActivity, ...activities].slice(0, 10));

  res.json({ project: updated });
});

/* ================================================================== */
/* USERS (Admin)                                                       */
/* ================================================================== */

app.put('/api/users', authenticateToken, async (req, res) => {
  const incoming = Array.isArray(req.body) ? req.body : [];

  // The client never sees or sends passwords, so preserve existing ones
  // (keyed by id) when the admin saves the whole users list.
  const existing = await prisma.user.findMany({ select: { id: true, password: true } });
  const passwordById = new Map(existing.map((u) => [u.id.toString(), u.password]));

  const data = incoming.map((u) => {
    const mapped = mapUser(u);
    if (mapped.password == null) {
      mapped.password = passwordById.get(mapped.id.toString()) ?? null;
    }
    return mapped;
  });

  await prisma.$transaction([
    prisma.user.deleteMany({}),
    prisma.user.createMany({ data })
  ]);
  const users = await prisma.user.findMany({ orderBy: { id: 'asc' } });
  res.json({ users: stripPasswords(users) });
});

app.put('/api/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const data = mapUser({ ...req.body, id });
  // Don't allow id mutation, and never wipe the password when the client
  // (which doesn't hold it) saves a user edit.
  delete data.id;
  if (data.password == null) delete data.password;
  const updated = await prisma.user.update({ where: { id: toBig(id) }, data });
  res.json({ user: stripPassword(updated) });
});

app.delete('/api/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  await prisma.user.delete({ where: { id: toBig(id) } }).catch(() => {});
  const users = await prisma.user.findMany({ orderBy: { id: 'asc' } });
  res.json({ users: stripPasswords(users) });
});

/* ================================================================== */
/* COLLECTIONS (bulk wholesale sync)                                   */
/* ================================================================== */

function collectionRoute(path, key) {
  app.put(path, authenticateToken, async (req, res) => {
    const data = await setCollection(key, req.body);
    res.json({ [key]: data });
  });
}

collectionRoute('/api/uploads', 'uploads');
collectionRoute('/api/announcements', 'announcements');
collectionRoute('/api/feedbacks', 'feedbacks');
collectionRoute('/api/events', 'eventsList');
collectionRoute('/api/team-updates', 'teamUpdates');
collectionRoute('/api/contributions', 'contributions');
collectionRoute('/api/system-status', 'systemStatus');
collectionRoute('/api/activities', 'recentActivities');
collectionRoute('/api/weekly-winners', 'weeklyWinners');
collectionRoute('/api/monthly-winners', 'monthlyWinners');

app.put('/api/uploads/:id/status', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const uploads = await getCollection('uploads', []);
  const next = uploads.map((u) => (u.id === parseInt(id, 10) ? { ...u, status } : u));
  await setCollection('uploads', next);
  res.json({ uploads: next });
});

app.post('/api/announcements', authenticateToken, async (req, res) => {
  const { title, body, label } = req.body;
  const announcements = await getCollection('announcements', []);
  const newAnn = { id: Date.now(), title, body, label: label || 'Info' };
  const next = [newAnn, ...announcements];
  await setCollection('announcements', next);
  res.status(201).json({ announcement: newAnn, announcements: next });
});

app.post('/api/feedback', authenticateToken, async (req, res) => {
  const { title, description } = req.body;
  const feedbacks = await getCollection('feedbacks', []);
  const newFeedback = { id: Date.now(), user: req.user.name, message: description || title, type: 'Bug Report' };
  const next = [newFeedback, ...feedbacks];
  await setCollection('feedbacks', next);
  res.status(201).json({ feedbacks: next });
});

app.put('/api/profile', authenticateToken, async (req, res) => {
  const profileUpdate = req.body;
  const dbUser = await findUserByEmail(req.user.email);
  if (dbUser) {
    await prisma.user.update({
      where: { id: dbUser.id },
      data: {
        name: profileUpdate.name || dbUser.name,
        phoneNumber: profileUpdate.phoneNumber || dbUser.phoneNumber,
        github: profileUpdate.github || dbUser.github,
        portfolio: profileUpdate.portfolio || dbUser.portfolio,
        avatar: profileUpdate.avatar || dbUser.avatar,
        registerNumber: profileUpdate.registerNumber || dbUser.registerNumber,
        location: profileUpdate.location || dbUser.location
      }
    });
  }
  await setCollection('profile', profileUpdate);
  res.json({ profile: profileUpdate });
});

/* ================================================================== */
/* LEADERBOARD                                                         */
/* ================================================================== */

app.post('/api/leaderboard/refresh', authenticateToken, async (req, res) => {
  const [users, projects] = await Promise.all([
    prisma.user.findMany(),
    prisma.project.findMany()
  ]);

  await prisma.$transaction(users.map((user) => {
    const userProjects = projects.filter((p) => p.owner === user.name);
    let totalRatingSum = 0;
    let ratedProjectsCount = 0;
    userProjects.forEach((p) => {
      const pRating = parseFloat(p.rating);
      if (!isNaN(pRating) && pRating > 0) { totalRatingSum += pRating; ratedProjectsCount++; }
    });
    const newAvgRating = ratedProjectsCount > 0 ? totalRatingSum / ratedProjectsCount : 0;
    const newProjectRatingScore = Math.round((newAvgRating / 10) * 100);
    const newTotalScore = Math.round(
      (newProjectRatingScore * 0.7) + ((user.contributionScore || 0) * 0.2) + ((user.eventScore || 0) * 0.1)
    );
    return prisma.user.update({
      where: { id: user.id },
      data: { averageRating: newAvgRating.toFixed(1), projectRatingScore: newProjectRatingScore, totalScore: newTotalScore }
    });
  }));

  const updated = await prisma.user.findMany({ orderBy: { id: 'asc' } });
  res.json({ users: stripPasswords(updated) });
});

app.post('/api/leaderboard/winners', authenticateToken, async (req, res) => {
  const { topContributor, topProject, mostActive, bestInnovation } = req.body;
  const weeklyWinners = { topContributor, topProject, mostActive, bestInnovation };
  await setCollection('weeklyWinners', weeklyWinners);

  const announcements = await getCollection('announcements', []);
  const winnerAnnouncement = {
    id: Date.now(),
    title: '🏆 Weekly Winners Announced!',
    body: `Congratulations to ${topContributor} for being the Top Contributor, and "${topProject}" for being the Top Project of the week!`,
    label: 'Winner'
  };
  const nextAnnouncements = [winnerAnnouncement, ...announcements];
  await setCollection('announcements', nextAnnouncements);

  res.json({ weeklyWinners, announcements: nextAnnouncements });
});

/* ================================================================== */
/* RECRUITMENT                                                         */
/* ================================================================== */

app.post('/api/recruitment/apply', async (req, res) => {
  const { name, registerNumber, email, phoneNumber, domain, yearOfStudy, github, linkedin, whyJoin, projectDetails } = req.body;
  if (!name || !registerNumber || !email || !domain || !yearOfStudy) {
    return res.status(400).json({ error: 'Please fill in all required fields.' });
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Enter your student email only in format name.lastnameYYYY@vitstudent.ac.in' });
  }

  const dupe = await prisma.recruitmentApplication.findFirst({
    where: { OR: [{ email }, { registerNumber }] }
  });
  if (dupe) {
    return res.status(400).json({ error: 'An application with this email or register number has already been submitted.' });
  }

  try {
    await prisma.recruitmentApplication.create({
      data: {
        id: toBig(Date.now()),
        name,
        registerNumber,
        email,
        phoneNumber: phoneNumber || '',
        domain,
        yearOfStudy,
        github: github || '',
        linkedin: linkedin || '',
        whyJoin: whyJoin || '',
        projectDetails: projectDetails || '',
        status: 'Pending',
        appliedDate: new Date().toISOString().split('T')[0]
      }
    });
    return res.status(201).json({ success: true, message: 'Application submitted successfully!' });
  } catch (err) {
    // Unique constraint safety net (race against the check above).
    if (err.code === 'P2002') {
      return res.status(400).json({ error: 'An application with this email or register number has already been submitted.' });
    }
    console.error('Recruitment apply error:', err);
    return res.status(500).json({ error: 'Failed to submit application.' });
  }
});

app.get('/api/recruitment/applications', authenticateToken, requireAdmin, async (req, res) => {
  const applications = await prisma.recruitmentApplication.findMany({ orderBy: { id: 'desc' } });
  res.json(applications);
});

app.put('/api/recruitment/applications/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (status !== 'Accepted' && status !== 'Rejected') {
    return res.status(400).json({ error: 'Invalid status update.' });
  }

  const application = await prisma.recruitmentApplication.findUnique({ where: { id: toBig(id) } });
  if (!application) return res.status(404).json({ error: 'Application not found.' });

  await prisma.recruitmentApplication.update({ where: { id: application.id }, data: { status } });

  // On acceptance, register the applicant as a member and allowlist their email.
  if (status === 'Accepted') {
    const existing = await findUserByEmail(application.email);
    if (!existing) {
      await prisma.user.create({
        data: mapUser({
          id: Date.now(),
          name: application.name,
          email: application.email,
          registerNumber: application.registerNumber,
          phoneNumber: application.phoneNumber,
          role: 'Member',
          status: 'Active',
          badges: ['New Maker'],
          contributionScore: 10,
          eventScore: 5,
          totalScore: 7
        })
      });
    }
    await prisma.allowedEmail.upsert({
      where: { email: application.email },
      update: {},
      create: { email: application.email, addedBy: req.user.name }
    });
  }

  const applications = await prisma.recruitmentApplication.findMany({ orderBy: { id: 'desc' } });
  res.json({ success: true, applications });
});

/* ================================================================== */
/* SIGNUP ALLOWLIST (Admin)                                            */
/* ================================================================== */

app.get('/api/allowlist', authenticateToken, requireAdmin, async (req, res) => {
  const allowedEmails = await prisma.allowedEmail.findMany({ orderBy: { createdAt: 'asc' } });
  res.json(allowedEmails);
});

app.post('/api/allowlist', authenticateToken, requireAdmin, async (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();
  if (!email) return res.status(400).json({ error: 'Please enter an email.' });
  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Enter a valid student email in format name.lastnameYYYY@vitstudent.ac.in' });
  }
  const existing = await prisma.allowedEmail.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ error: 'This email is already on the allowlist.' });

  await prisma.allowedEmail.create({ data: { email, addedBy: req.user.name } });
  const allowedEmails = await prisma.allowedEmail.findMany({ orderBy: { createdAt: 'asc' } });
  res.status(201).json({ allowedEmails });
});

app.delete('/api/allowlist/:id', authenticateToken, requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  await prisma.allowedEmail.delete({ where: { id } }).catch(() => {});
  const allowedEmails = await prisma.allowedEmail.findMany({ orderBy: { createdAt: 'asc' } });
  res.json({ allowedEmails });
});

/* ------------------------------------------------------------------ */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 HackClub Server running on http://localhost:${PORT}`);
});
