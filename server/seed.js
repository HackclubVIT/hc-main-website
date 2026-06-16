import 'dotenv/config';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from './prismaClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'database.json');

const COLLECTION_KEYS = [
  'announcements', 'uploads', 'recentActivities', 'eventsList',
  'teamUpdates', 'feedbacks', 'systemStatus', 'weeklyWinners',
  'monthlyWinners', 'profile', 'contributions'
];

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

// Demo accounts that must always be able to sign in.
const DEMO_USERS = [
  { id: 9000000000001, name: 'Admin', email: 'admin@vitstudent.ac.in', role: 'Admin', isReviewer: true, badges: ['Lead Organizer'] },
  { id: 9000000000002, name: 'Priya Sharma', email: 'user@vitstudent.ac.in', role: 'Member', badges: ['Top Performer'] }
];

async function main() {
  console.log('🌱 Seeding Neon database from database.json ...');

  let json = {};
  try {
    json = JSON.parse(await fs.readFile(DB_PATH, 'utf8'));
  } catch (err) {
    console.warn('Could not read database.json, seeding demo data only.', err.message);
  }

  // ---- Users (existing + demo) ----
  const rawUsers = Array.isArray(json.users) ? json.users : [];
  const usersById = new Map();
  for (const u of [...rawUsers, ...DEMO_USERS]) {
    const mapped = mapUser(u);
    usersById.set(mapped.id.toString(), mapped);
  }
  const users = [...usersById.values()];

  // Ensure every emailed user is on the allowlist + demo accounts.
  const allowlistEmails = new Set();
  for (const u of users) {
    if (u.email) allowlistEmails.add(u.email.toLowerCase());
  }
  allowlistEmails.add('admin@vitstudent.ac.in');
  allowlistEmails.add('user@vitstudent.ac.in');

  const projects = (Array.isArray(json.projects) ? json.projects : []).map(mapProject);

  const recruitment = (Array.isArray(json.recruitmentApplications) ? json.recruitmentApplications : []).map((a) => ({
    id: toBig(a.id ?? Date.now()),
    name: a.name ?? 'Applicant',
    registerNumber: a.registerNumber ?? `REG${a.id}`,
    email: a.email ?? `applicant${a.id}@vitstudent.ac.in`,
    phoneNumber: a.phoneNumber ?? '',
    domain: a.domain ?? 'General',
    yearOfStudy: a.yearOfStudy ?? '1st',
    github: a.github ?? '',
    linkedin: a.linkedin ?? '',
    whyJoin: a.whyJoin ?? '',
    projectDetails: a.projectDetails ?? '',
    status: a.status ?? 'Pending',
    appliedDate: a.appliedDate ?? new Date().toISOString().split('T')[0]
  }));

  // Wipe + reseed (idempotent).
  await prisma.$transaction([
    prisma.collection.deleteMany({}),
    prisma.allowedEmail.deleteMany({}),
    prisma.recruitmentApplication.deleteMany({}),
    prisma.project.deleteMany({}),
    prisma.user.deleteMany({})
  ]);

  await prisma.user.createMany({ data: users });
  console.log(`  ✓ ${users.length} users`);

  if (projects.length) {
    await prisma.project.createMany({ data: projects });
    console.log(`  ✓ ${projects.length} projects`);
  }

  if (recruitment.length) {
    await prisma.recruitmentApplication.createMany({ data: recruitment, skipDuplicates: true });
    console.log(`  ✓ ${recruitment.length} recruitment applications`);
  }

  await prisma.allowedEmail.createMany({
    data: [...allowlistEmails].map((email) => ({ email, addedBy: 'seed' })),
    skipDuplicates: true
  });
  console.log(`  ✓ ${allowlistEmails.size} allowlisted emails`);

  for (const key of COLLECTION_KEYS) {
    if (json[key] !== undefined) {
      await prisma.collection.upsert({
        where: { name: key },
        update: { data: json[key] },
        create: { name: key, data: json[key] }
      });
    }
  }
  console.log('  ✓ collections');

  console.log('✅ Seed complete.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
