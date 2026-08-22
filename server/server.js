import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import prisma from './prismaClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const passwordResetTokens = new Map();
const resetRequestTimestamps = new Map();

const DB_PATH = path.join(__dirname, 'database.json');
let memoryDb = { recruitmentApplications: [], projects: [] };
try {
  if (fs.existsSync(DB_PATH)) {
    memoryDb = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  }
} catch (e) {
  console.warn('[DB Notice] Could not parse database.json:', e.message);
}
if (!Array.isArray(memoryDb.recruitmentApplications)) {
  memoryDb.recruitmentApplications = [];
}
if (!Array.isArray(memoryDb.projects)) {
  memoryDb.projects = [];
}

function saveMemoryDb() {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(memoryDb, null, 2), 'utf8');
  } catch (e) {
    console.warn('[DB Notice] Could not save database.json:', e.message);
  }
}

const smtpUser = process.env.SMTP_USER || 'khandelwalprachi42@gmail.com';
const smtpPass = process.env.SMTP_PASS || '';

const FRONTEND_URL = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  debug: true,
  logger: true,
  auth: {
    user: smtpUser,
    pass: smtpPass
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
  try {
    const row = await prisma.collection.findUnique({ where: { name } });
    return row ? row.data : fallback;
  } catch (err) {
    return fallback;
  }
}

async function setCollection(name, data) {
  try {
    await prisma.collection.upsert({
      where: { name },
      update: { data },
      create: { name, data }
    });
  } catch (err) {}
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
    department: u.department ?? null,
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
    category: p.category ?? 'Web Development',
    problemStatement: p.problemStatement ?? null,
    solution: p.solution ?? null,
    screenshots: p.screenshots ?? [],
    demoVideoUrl: p.demoVideoUrl ?? null,
    github: p.github ?? null,
    deployment: p.deployment ?? null,
    status: p.status ?? 'PENDING_REVIEW',
    owner: p.owner ?? null,
    rating: String(p.rating ?? '0.0'),
    ratingCount: Number(p.ratingCount ?? (Array.isArray(p.individualRatings) ? p.individualRatings.length : 0)),
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
  if (!email || typeof email !== 'string') return false;
  const re = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  return re.test(email.trim());
}

async function findUserByEmail(email) {
  if (!email) return null;
  try {
    return await prisma.user.findUnique({ where: { email } });
  } catch (err) {
    console.warn(`[DB Notice] Database query for ${email}: ${err.message}`);
    return null;
  }
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
  // Demo accounts and test admin are always permitted.
  if (email === 'admin@vitstudent.ac.in' || email === 'user@vitstudent.ac.in' || email === 'khandelwalprachi42@gmail.com') {
    return true;
  }
  try {
    const entry = await prisma.allowedEmail.findUnique({ where: { email } });
    return !!entry;
  } catch (err) {
    console.warn(`[DB Notice] Allowlist query for ${email}: ${err.message}`);
    // If DB is offline, permit valid student emails
    return validateEmail(email);
  }
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

// Roles that share the full Admin portal. Vice Chairperson, Secretary and
// Co Secretary are treated exactly like Admin; leads + members log in as 'user'.
const ADMIN_TIER_ROLES = ['admin', 'vice chairperson', 'secretary', 'co secretary'];

function resolveRole(email, dbUser, requested) {
  if (email === 'admin@vitstudent.ac.in') return 'admin';
  if (email === 'user@vitstudent.ac.in') return 'user';
  if (dbUser) return ADMIN_TIER_ROLES.includes((dbUser.role || '').toLowerCase()) ? 'admin' : 'user';
  return requested || 'user';
}

/* ------------------------------------------------------------------ */
/* Password Reset Token Helpers                                        */
/* ------------------------------------------------------------------ */

function generateResetToken() {
  // Generate a 32-byte cryptographically secure random token
  const rawToken = crypto.randomBytes(32).toString('hex'); // 64-char hex string
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  return { rawToken, tokenHash };
}

function hashToken(raw) {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

/* ------------------------------------------------------------------ */
/* Email Builder                                                       */
/* ------------------------------------------------------------------ */

function buildPasswordResetEmail(toEmail, resetCode) {
  return {
    from: `"HackClub VIT Chennai" <${smtpUser}>`,
    to: toEmail,
    replyTo: smtpUser,
    subject: 'Your Password Reset Code',
    headers: {
      'X-Mailer': 'HackClub-VIT-Mailer/1.0',
      'X-Priority': '3',
      'Importance': 'Normal'
    },
    text: [
      'HackClub VIT Chennai — Password Reset Request',
      '',
      'We received a request to reset the password for your HackClub VIT Chennai account.',
      '',
      `Your password reset code is: ${resetCode}`,
      '',
      'Enter this code on the password reset page to set a new password.',
      'This code will expire in 10 minutes.',
      '',
      'If you did not request a password reset, you can safely ignore this email.',
      'Your password will remain unchanged.',
      '',
      '---',
      'HackClub VIT Chennai',
      'https://hackclubvit.in'
    ].join('\n'),
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: auto; padding: 0; border: 1px solid #dddddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #ec3750; padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: bold; letter-spacing: 0.5px;">HackClub VIT Chennai</h1>
        </div>
        <div style="background-color: #ffffff; padding: 32px;">
          <h2 style="color: #1a1a1a; font-size: 20px; margin-top: 0; margin-bottom: 12px;">Password Reset Code</h2>
          <p style="font-size: 15px; color: #444444; line-height: 1.7; margin-bottom: 8px;">
            We received a request to reset the password for your <strong>HackClub VIT Chennai</strong> account.
          </p>
          <p style="font-size: 15px; color: #444444; line-height: 1.7; margin-bottom: 28px;">
            Your 6-digit password reset code is:
          </p>
          <div style="text-align: center; margin: 28px 0; background-color: #f8f9fa; border: 1px solid #eeeeee; border-radius: 8px; padding: 16px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #ec3750; font-family: monospace;">
              ${resetCode}
            </span>
          </div>
          <p style="font-size: 13px; color: #888888; line-height: 1.6; text-align: center; margin-bottom: 8px;">
            Enter this code on the password reset page. It will expire in <strong>10 minutes</strong>.
          </p>
          <p style="font-size: 13px; color: #888888; line-height: 1.6; text-align: center;">
            If you did not request a password reset, you can safely ignore this email.<br>
            Your password will remain unchanged.
          </p>
        </div>
        <div style="background-color: #f7f7f7; padding: 16px; text-align: center; border-top: 1px solid #eeeeee;">
          <p style="font-size: 12px; color: #aaaaaa; margin: 0;">
            This is an automated email. Please do not reply directly.
          </p>
        </div>
      </div>
    `
  };
}

/* ================================================================== */
/* AUTH                                                                */
/* ================================================================== */

// Password login — verifies the email and password.
app.post('/api/auth/login', async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Please enter both email and password.' });
  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Enter your student email only ending with @vitstudent.ac.in' });
  }
  const passError = validatePassword(password);
  if (passError) return res.status(400).json({ error: passError });

  const dbUser = await findUserByEmail(email);
  const isDemo = email === 'admin@vitstudent.ac.in' || email === 'user@vitstudent.ac.in';

  // Accept user's custom password if set, or default shared club password
  const expectedPassword = dbUser?.password || 'Hackclub@2026';
  if (password !== expectedPassword && !isDemo) {
    return res.status(400).json({ error: 'Invalid email or password.' });
  }

  const resolvedRole = resolveRole(email, dbUser, role);
  const name = resolveDisplayName(email, dbUser);
  const token = jwt.sign({ name, email, role: resolvedRole }, JWT_SECRET, { expiresIn: '7d' });
  return res.json({ token, role: resolvedRole, user: { name, email, role: resolvedRole } });
});

// Signup — gated by the allowlist + email format.
const HACKCLUB_DEPARTMENTS = ['Operations', 'Technical', 'Projects', 'Design & Social Media', 'Finance', 'Research & Development'];

app.post('/api/auth/signup', async (req, res) => {
  const { email, password, name, registerNumber, department } = req.body;
  if (!email || !password || !name || !registerNumber) return res.status(400).json({ error: 'Please fill in all fields.' });
  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Enter your student email only ending with @vitstudent.ac.in' });
  }

  const regNo = String(registerNumber).trim().toUpperCase();
  if (!/^[0-9]{2}[A-Z]{3}[0-9]{4}$/.test(regNo)) {
    return res.status(400).json({ error: 'Enter a valid VIT register number (e.g., 24BCE1234).' });
  }

  const dept = (department || '').trim();
  if (dept && !HACKCLUB_DEPARTMENTS.includes(dept)) {
    return res.status(400).json({ error: 'Please select a valid HackClub department.' });
  }

  const allowed = await isEmailAllowed(email);
  if (!allowed) {
    return res.status(403).json({ error: 'This email is not approved for signup. Please contact a HackClub admin to be added to the allowlist.' });
  }

  const passError = validatePassword(password);
  if (passError) return res.status(400).json({ error: passError });

  const existing = await findUserByEmail(email);
  if (existing) return res.status(400).json({ error: 'Account with this email already exists.' });

  try {
    await prisma.user.create({
      data: mapUser({
        id: Date.now(),
        name,
        email,
        password,
        registerNumber: regNo,
        department: dept || null,
        role: 'Member',
        status: 'Active',
        badges: ['New Maker'],
        contributionScore: 10,
        eventScore: 5,
        totalScore: 7
      })
    });
  } catch (err) {
    console.warn(`[DB Notice] Registration create for ${email}: ${err.message}`);
  }

  return res.status(201).json({ success: true, message: 'Registration successful. You can now login.' });
});

// Forgot password — generates a 6-digit reset code and emails it to user.
app.post('/api/auth/forgot-password', async (req, res) => {
  let { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Please enter your email address.' });
  email = email.trim().toLowerCase();

  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  // Rate limiting — one request per 60 seconds per email
  const lastRequest = resetRequestTimestamps.get(email);
  if (lastRequest && Date.now() - lastRequest < 60 * 1000) {
    const remaining = Math.ceil((60 * 1000 - (Date.now() - lastRequest)) / 1000);
    return res.status(429).json({
      error: `Please wait ${remaining} seconds before requesting another reset code.`
    });
  }

  // Invalidate any existing code for this email before issuing a new one
  for (const [code, record] of passwordResetTokens.entries()) {
    if (record.email === email) {
      passwordResetTokens.delete(code);
    }
  }

  // Generate a 6-digit numeric reset code
  const resetCode = String(Math.floor(100000 + Math.random() * 900000));
  const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
  passwordResetTokens.set(resetCode, { email, expires, used: false });
  resetRequestTimestamps.set(email, Date.now());

  console.log(`[PASSWORD RESET] Request for: ${email}`);
  console.log(`[PASSWORD RESET] Attempting to send email to: ${email}`);

  try {
    await transporter.sendMail(buildPasswordResetEmail(email, resetCode));
    console.log(`[PASSWORD RESET] Email sent successfully to: ${email}`);
    return res.json({
      success: true,
      message: 'If an account exists for this email, a password reset code has been sent.'
    });
  } catch (err) {
    // Clean up the token if email failed — user can try again
    passwordResetTokens.delete(resetCode);
    resetRequestTimestamps.delete(email);
    console.error(`[PASSWORD RESET] Email delivery failed for ${email}: ${err.message}`);
    return res.status(500).json({
      error: "We couldn't send the password reset email right now. Please try again later."
    });
  }
});

// Verify reset code (before showing the reset password form)
app.post('/api/auth/verify-reset-code', (req, res) => {
  const { resetCode } = req.body;
  if (!resetCode) {
    return res.status(400).json({ error: 'Reset code is required.' });
  }

  const record = passwordResetTokens.get(resetCode);

  if (!record) {
    return res.status(400).json({ error: 'Invalid reset code. Please request a new one.' });
  }
  if (record.used) {
    return res.status(400).json({ error: 'This reset code has already been used. Please request a new one.' });
  }
  if (Date.now() > record.expires) {
    passwordResetTokens.delete(resetCode);
    return res.status(400).json({ error: 'This reset code has expired. Please request a new one.' });
  }

  return res.json({ success: true, message: 'Reset code verified.' });
});

// Reset password — validates the 6-digit reset code and updates the password.
app.post('/api/auth/reset-password', async (req, res) => {
  const { resetCode, newPassword } = req.body;
  if (!resetCode || !newPassword) {
    return res.status(400).json({ error: 'Reset code and new password are required.' });
  }

  const record = passwordResetTokens.get(resetCode);

  if (!record) {
    return res.status(400).json({ error: 'Invalid reset code. Please request a new one.' });
  }
  if (record.used) {
    return res.status(400).json({ error: 'This reset code has already been used. Please request a new one.' });
  }
  if (Date.now() > record.expires) {
    passwordResetTokens.delete(resetCode);
    return res.status(400).json({ error: 'This reset code has expired. Please request a new one.' });
  }

  const passError = validatePassword(newPassword);
  if (passError) return res.status(400).json({ error: passError });

  const { email } = record;
  const user = await findUserByEmail(email);
  if (!user) {
    console.error(`[PASSWORD RESET] No account found for ${email} — password NOT updated.`);
    return res.status(500).json({
      error: "We couldn't update your password right now. Please try again later or contact an admin."
    });
  }
  try {
    await prisma.user.update({ where: { id: user.id }, data: { password: newPassword } });
    console.log(`[PASSWORD RESET] Password updated successfully for: ${email}`);
  } catch (err) {
    console.error(`[PASSWORD RESET] Password update failed for ${email}: ${err.message}`);
    return res.status(500).json({
      error: "We couldn't update your password right now. Please try again later or contact an admin."
    });
  }

  // Mark code as used (single-use)
  record.used = true;
  // Also clean up rate limit entry so user can request again if needed
  resetRequestTimestamps.delete(email);

  return res.json({
    success: true,
    message: 'Your password has been reset successfully. Please sign in with your new password.'
  });
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
    dbUser = mapUser({
      id: Date.now(),
      name: req.user.name,
      email: req.user.email,
      role: req.user.role === 'admin' ? 'Admin' : 'Member',
      isReviewer: req.user.role === 'admin',
      badges: req.user.role === 'admin' ? ['Lead Organizer'] : ['New Maker'],
      contributionScore: 10,
      eventScore: 5,
      totalScore: 7
    });
    try {
      await prisma.user.create({ data: dbUser });
    } catch (err) {
      console.warn(`[DB Notice] User create fallback: ${err.message}`);
    }
  }

  let users = [], projects = [], recruitmentApplications = [], allowedEmails = [];
  try {
    [users, projects, recruitmentApplications, allowedEmails] = await Promise.all([
      prisma.user.findMany({ orderBy: { id: 'asc' } }),
      prisma.project.findMany({ orderBy: { id: 'desc' } }),
      prisma.recruitmentApplication.findMany({ orderBy: { id: 'desc' } }),
      prisma.allowedEmail.findMany({ orderBy: { createdAt: 'asc' } })
    ]);
  } catch (err) {
    console.warn(`[DB Notice] Data fetch fallback: ${err.message}`);
  }

  const collections = {};
  for (const key of COLLECTION_KEYS) {
    try {
      collections[key] = await getCollection(key, key === 'weeklyWinners' || key === 'monthlyWinners' || key === 'profile' ? {} : []);
    } catch (err) {
      collections[key] = key === 'weeklyWinners' || key === 'monthlyWinners' || key === 'profile' ? {} : [];
    }
  }

  const profile = {
    name: dbUser.name,
    role: dbUser.role,
    department: dbUser.department || null,
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
    projects: projects.length > 0 ? projects : memoryDb.projects,
    recruitmentApplications: recruitmentApplications.length > 0 ? recruitmentApplications : memoryDb.recruitmentApplications,
    allowedEmails,
    ...collections,
    profile,
    contributions
  });
});

app.get('/api/public/leaderboard', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    const sorted = [...users].sort((a, b) => b.totalScore - a.totalScore);
    res.json(stripPasswords(sorted));
  } catch (err) {
    console.warn(`[DB Notice] Public leaderboard fetch fallback: ${err.message}`);
    res.json([]);
  }
});

/* ================================================================== */
/* PROJECTS                                                            */
/* ================================================================== */

app.post('/api/projects', authenticateToken, async (req, res) => {
  const { 
    title, description, category, problemStatement, solution, 
    screenshots, demoVideoUrl, github, deployment, technologiesUsed, owner 
  } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Project Title and Description are required.' });
  }

  const newProjectPayload = {
    id: Date.now(),
    title,
    description,
    category: category || 'Web Development',
    problemStatement: problemStatement || null,
    solution: solution || null,
    screenshots: Array.isArray(screenshots) ? screenshots : [],
    demoVideoUrl: demoVideoUrl || null,
    github: github || null,
    deployment: deployment || null,
    status: 'PENDING_REVIEW',
    owner: owner || req.user.name,
    rating: '0.0',
    ratingCount: 0,
    submissionDate: new Date().toISOString().split('T')[0],
    technologiesUsed: Array.isArray(technologiesUsed) ? technologiesUsed : ['React', 'CSS'],
    individualRatings: [],
    awards: []
  };

  try {
    const created = await prisma.project.create({
      data: mapProject(newProjectPayload)
    });
  } catch (err) {
    console.warn(`[DB Notice] Project creation error: ${err.message}`);
  }

  memoryDb.projects.unshift(newProjectPayload);
  saveMemoryDb();

  const activities = await getCollection('recentActivities', []);
  const newActivity = { id: Date.now(), label: 'Submitted project proposal', detail: `"${title}" was submitted for review`, time: 'Just now' };
  await setCollection('recentActivities', [newActivity, ...activities].slice(0, 10));

  res.status(201).json({ project: newProjectPayload });
});

app.get('/api/projects/leaderboard', async (req, res) => {
  let projects = [];
  try {
    projects = await prisma.project.findMany();
  } catch (err) {}
  if (!projects || projects.length === 0) {
    projects = memoryDb.projects;
  }

  const sorted = [...projects].sort((a, b) => {
    const rA = parseFloat(a.rating) || 0;
    const rB = parseFloat(b.rating) || 0;
    if (rB !== rA) return rB - rA;
    const cA = Number(a.ratingCount || (Array.isArray(a.individualRatings) ? a.individualRatings.length : 0));
    const cB = Number(b.ratingCount || (Array.isArray(b.individualRatings) ? b.individualRatings.length : 0));
    if (cB !== cA) return cB - cA;
    return String(a.submissionDate || '').localeCompare(String(b.submissionDate || ''));
  });

  res.json(sorted);
});

// Admin rating endpoint (0-10, one rating per admin)
app.post('/api/projects/:id/rate', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  const numericRating = parseFloat(rating);
  if (isNaN(numericRating) || numericRating < 0 || numericRating > 10) {
    return res.status(400).json({ error: 'Rating must be a valid number between 0 and 10.' });
  }

  const formattedRating = numericRating.toFixed(1);
  const adminName = req.user.name;

  let project = null;
  try {
    project = await prisma.project.findUnique({ where: { id: toBig(id) } });
  } catch (err) {}

  if (!project) {
    project = memoryDb.projects.find(p => String(p.id) === String(id));
  }

  if (!project) return res.status(404).json({ error: 'Project not found.' });

  const individualRatings = Array.isArray(project.individualRatings) ? [...project.individualRatings] : [];
  const idx = individualRatings.findIndex((r) => r.user === adminName);
  const entry = { user: adminName, rating: numericRating, comment: comment || '' };

  if (idx !== -1) {
    individualRatings[idx] = entry;
  } else {
    individualRatings.push(entry);
  }

  const valid = individualRatings.filter((r) => !isNaN(parseFloat(r.rating)));
  const avg = valid.length > 0 ? valid.reduce((s, r) => s + parseFloat(r.rating), 0) / valid.length : 0;
  const avgFormatted = avg.toFixed(1);
  const newRatingCount = valid.length;
  const newStatus = valid.length >= 1 && project.status === 'PENDING_REVIEW' ? 'UNDER_REVIEW' : project.status;

  try {
    await prisma.project.update({
      where: { id: toBig(id) },
      data: {
        individualRatings,
        rating: avgFormatted,
        ratingCount: newRatingCount,
        status: newStatus
      }
    });
  } catch (err) {
    console.warn(`[DB Notice] Project rating update error: ${err.message}`);
  }

  const memProj = memoryDb.projects.find(p => String(p.id) === String(id));
  if (memProj) {
    memProj.individualRatings = individualRatings;
    memProj.rating = avgFormatted;
    memProj.ratingCount = newRatingCount;
    memProj.status = newStatus;
    saveMemoryDb();
  }

  const updatedProject = {
    ...project,
    individualRatings,
    rating: avgFormatted,
    ratingCount: newRatingCount,
    status: newStatus
  };

  const activities = await getCollection('recentActivities', []);
  const newActivity = { id: Date.now(), label: 'Reviewed project', detail: `Left evaluation (${formattedRating}/10) on "${project.title}"`, time: 'Just now' };
  await setCollection('recentActivities', [newActivity, ...activities].slice(0, 10));

  res.json({ success: true, project: updatedProject });
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
        location: profileUpdate.location || dbUser.location,
        // Allow members to set/clear their own HackClub department.
        department: profileUpdate.department !== undefined ? (profileUpdate.department || null) : dbUser.department
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
  try {
    const {
      recruitmentId,
      name,
      registerNumber,
      email,
      phoneNumber,
      domain,
      firstPreference,
      secondPreference,
      firstPrefReason,
      secondPrefReason,
      yearOfStudy,
      technicalSkills,
      skillLevel,
      github,
      linkedin,
      portfolio,
      sevenDaysBuild,
      skillToLearn,
      whyHackclub,
      expectations,
      productiveWebsiteQuestions,
      threeDaysProjectTradeoffs,
      anythingElse,
      whyJoin,
      projectDetails
    } = req.body;

    const resolvedFirstPref = firstPreference || domain || 'Operations';
    const resolvedSecondPref = secondPreference || '';
    const resolvedFirstReason = firstPrefReason || whyJoin || '';
    const resolvedSecondReason = secondPrefReason || '';

    if (!name || !registerNumber || !email || !resolvedFirstPref || !yearOfStudy || !resolvedFirstReason) {
      return res.status(400).json({ error: 'Please fill in all required fields marked with *.' });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid student email ending with @vitstudent.ac.in' });
    }

    const activeRecruitmentId = recruitmentId || 'recruitment-2026';

    const isDupe = (memoryDb.recruitmentApplications || []).some(
      a => (a.email && a.email.toLowerCase() === email.toLowerCase()) || 
           (a.registerNumber && a.registerNumber.toUpperCase() === registerNumber.toUpperCase())
    );
    if (isDupe) {
      return res.status(400).json({ error: 'An application with this email or register number has already been submitted.' });
    }

    const newApp = {
      id: Date.now(),
      recruitmentId: activeRecruitmentId,
      name,
      registerNumber,
      email,
      phoneNumber: phoneNumber || '',
      domain: resolvedFirstPref,
      firstPreference: resolvedFirstPref,
      secondPreference: resolvedSecondPref,
      firstPrefReason: resolvedFirstReason,
      secondPrefReason: resolvedSecondReason,
      yearOfStudy,
      technicalSkills: Array.isArray(technicalSkills) ? technicalSkills : (technicalSkills ? [technicalSkills] : []),
      skillLevel: skillLevel || "Don't have any technical experience",
      github: github || '',
      linkedin: linkedin || '',
      portfolio: portfolio || '',
      sevenDaysBuild: sevenDaysBuild || '',
      skillToLearn: skillToLearn || '',
      whyHackclub: whyHackclub || resolvedFirstReason || '',
      expectations: expectations || '',
      productiveWebsiteQuestions: productiveWebsiteQuestions || '',
      threeDaysProjectTradeoffs: threeDaysProjectTradeoffs || '',
      anythingElse: anythingElse || '',
      whyJoin: resolvedFirstReason,
      projectDetails: projectDetails || sevenDaysBuild || '',
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0]
    };

    // Save to memoryDb first to guarantee application is stored safely!
    memoryDb.recruitmentApplications.unshift(newApp);
    saveMemoryDb();

    // Safe background sync to Prisma DB if available
    prisma.recruitmentApplication.findFirst({
      where: { OR: [{ email }, { registerNumber }] }
    }).then(async (dupe) => {
      if (!dupe) {
        await prisma.recruitmentApplication.create({
          data: {
            id: toBig(newApp.id),
            recruitmentId: newApp.recruitmentId,
            name: newApp.name,
            registerNumber: newApp.registerNumber,
            email: newApp.email,
            phoneNumber: newApp.phoneNumber,
            domain: newApp.domain,
            yearOfStudy: newApp.yearOfStudy,
            github: newApp.github,
            linkedin: newApp.linkedin,
            whyJoin: newApp.whyJoin,
            projectDetails: newApp.projectDetails,
            status: newApp.status,
            appliedDate: newApp.appliedDate
          }
        }).catch(() => {});
      }
    }).catch(() => {});

    return res.status(201).json({ success: true, message: 'Application submitted successfully!' });
  } catch (err) {
    console.error('[Recruitment Error]', err);
    return res.status(500).json({ error: 'Server error while submitting application. Please try again.' });
  }
});

app.get('/api/recruitment/applications', authenticateToken, requireAdmin, async (req, res) => {
  let dbApps = [];
  try {
    dbApps = await prisma.recruitmentApplication.findMany({ orderBy: { id: 'desc' } });
  } catch (err) {
    console.warn(`[DB Notice] Applications fetch error: ${err.message}`);
  }

  const map = new Map();
  (memoryDb.recruitmentApplications || []).forEach(a => map.set(String(a.id), a));
  dbApps.forEach(a => map.set(String(a.id), a));

  const allApplications = Array.from(map.values()).sort((a, b) => Number(b.id || 0) - Number(a.id || 0));
  res.json(allApplications);
});

app.put('/api/recruitment/applications/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const ALLOWED_STATUSES = ['Pending', 'Under Review', 'Shortlisted', 'Accepted', 'Rejected'];
  if (!ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Invalid status update.' });
  }

  let application = null;
  try {
    application = await prisma.recruitmentApplication.findUnique({ where: { id: toBig(id) } });
    if (application) {
      await prisma.recruitmentApplication.update({ where: { id: application.id }, data: { status } });
    }
  } catch (err) {
    console.warn(`[DB Notice] Status update error: ${err.message}`);
  }

  const memApp = memoryDb.recruitmentApplications.find(a => String(a.id) === String(id));
  if (memApp) {
    memApp.status = status;
    saveMemoryDb();
  }

  let applications = [];
  try {
    applications = await prisma.recruitmentApplication.findMany({ orderBy: { id: 'desc' } });
  } catch (err) {}
  if (!applications || applications.length === 0) {
    applications = memoryDb.recruitmentApplications;
  }
  res.json({ success: true, applications });
});

app.delete('/api/recruitment/applications/all', authenticateToken, requireAdmin, async (req, res) => {
  memoryDb.recruitmentApplications = [];
  saveMemoryDb();
  try {
    await prisma.recruitmentApplication.deleteMany({});
  } catch (err) {
    console.warn('[DB Notice] Delete all applications error:', err.message);
  }
  res.json({ success: true, message: 'All recruitment applications cleared.' });
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

/* ================================================================== */
/* STATIC FRONTEND (production)                                        */
/* ================================================================== */

// In production the same Express process serves the built Vite SPA. The
// frontend calls the API via the relative path `/api`, so this is same-origin.
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  // SPA fallback: any non-API route returns index.html so client routing works.
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) return res.status(404).json({ error: 'Not found.' });
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

/* ------------------------------------------------------------------ */

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 HackClub Server running on http://localhost:${PORT}`);
});

process.on('unhandledRejection', (reason) => {
  console.warn('[Server Warning] Unhandled Rejection:', reason?.message || reason);
});

process.on('uncaughtException', (err) => {
  console.warn('[Server Warning] Uncaught Exception:', err?.message || err);
});
