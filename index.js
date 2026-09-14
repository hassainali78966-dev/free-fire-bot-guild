const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const BotManager = require('./src/botManager');
const GuildManager = require('./src/guildManager');

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize managers
const botManager = new BotManager();
const guildManager = new GuildManager(process.env.GUILD_ID);

// Simulate bot requests coming in
const initiateBotRequests = async () => {
  const delay = parseInt(process.env.BOT_DELAY) || 1000;
  for (const bot of botManager.getBots()) {
    guildManager.addPendingRequest(bot.id, bot.name);
    await new Promise(resolve => setTimeout(resolve, delay));
  }
};

// Routes
app.get('/', (req, res) => {
  res.json({
    message: '🔥 Free Fire Bot Guild System',
    status: 'running',
    guildId: process.env.GUILD_ID,
    botsTotal: botManager.getBots().length,
    botsActive: botManager.getActiveBots().length,
    pendingRequests: guildManager.getPendingRequests().length,
    acceptedMembers: guildManager.getAcceptedRequests().length,
    teamsFormed: guildManager.getTeams().length
  });
});

// Get guild status
app.get('/api/guild/status', (req, res) => {
  res.json({
    guildId: process.env.GUILD_ID,
    totalBots: botManager.getBots().length,
    activeBots: botManager.getActiveBots().length,
    pendingRequests: guildManager.getPendingRequests().length,
    acceptedMembers: guildManager.getAcceptedRequests().length,
    guildMembers: guildManager.getGuildMembers().length,
    teamsFormed: guildManager.getTeams().length,
    teamSize: process.env.TEAM_SIZE || 4
  });
});

// Get all bots status
app.get('/api/bots/status', (req, res) => {
  res.json({
    totalBots: botManager.getBots().length,
    bots: botManager.getBots().map(bot => bot.getStatus())
  });
});

// Get pending requests
app.get('/api/guild/pending-requests', (req, res) => {
  res.json({
    pendingCount: guildManager.getPendingRequests().length,
    requests: guildManager.getPendingRequests()
  });
});

// Accept specific request
app.post('/api/guild/accept-request', (req, res) => {
  const { botId } = req.body;
  if (!botId) {
    return res.status(400).json({ error: 'botId is required' });
  }
  const result = guildManager.acceptRequest(botId);
  res.json(result);
});

// Accept all pending requests
app.post('/api/guild/accept-all-requests', (req, res) => {
  const results = guildManager.acceptAllRequests();
  res.json({
    message: `✅ All ${results.length} requests accepted!`,
    accepted: results.length,
    totalMembers: guildManager.getGuildMembers().length,
    details: results
  });
});

// Start bot operations (send requests)
app.post('/api/bots/start', async (req, res) => {
  try {
    await botManager.startAllBots(process.env.GUILD_ID);
    res.json({ 
      message: `✅ All ${botManager.getBots().length} bots started!`,
      botsCount: botManager.getBots().length,
      pendingRequests: guildManager.getPendingRequests().length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stop bot operations
app.post('/api/bots/stop', (req, res) => {
  botManager.stopAllBots();
  res.json({ message: '⛔ All bots stopped' });
});

// Form teams from accepted members
app.post('/api/teams/form', async (req, res) => {
  try {
    const teams = await guildManager.formTeams();
    res.json({
      message: `✅ ${teams.length} teams formed!`,
      teamsCount: teams.length,
      teamSize: process.env.TEAM_SIZE || 4,
      teams: teams.map((t, i) => ({
        teamNumber: i + 1,
        members: t.members.length,
        playerNames: t.members.map(m => m.botName)
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start playing
app.post('/api/teams/play', async (req, res) => {
  try {
    const results = await guildManager.startPlaying();
    res.json({
      message: `🎮 ${results.length} teams started playing!`,
      teamCount: results.length,
      results: results
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get guild members
app.get('/api/guild/members', (req, res) => {
  const members = guildManager.getGuildMembers();
  res.json({
    guildId: process.env.GUILD_ID,
    totalMembers: members.length,
    members: members
  });
});

// Get teams info
app.get('/api/teams/info', (req, res) => {
  const teams = guildManager.getTeams();
  res.json({
    totalTeams: teams.length,
    teamSize: process.env.TEAM_SIZE || 4,
    teams: teams
  });
});

// Quick start: Start bots + Accept requests + Form teams + Play
app.post('/api/quick-start', async (req, res) => {
  try {
    console.log('\n\n═══════════════════════════════════════');
    console.log('🚀 QUICK START: Full Guild Automation');
    console.log('═══════════════════════════════════════\n');

    // Step 1: Start all bots
    await botManager.startAllBots(process.env.GUILD_ID);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 2: Accept all requests
    const acceptedCount = guildManager.acceptAllRequests().length;
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 3: Form teams
    const teams = await guildManager.formTeams();
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 4: Start playing
    const playingTeams = await guildManager.startPlaying();

    console.log('═══════════════════════════════════════\n');

    res.json({
      message: '🎮 Full automation complete!',
      steps: {
        botsStarted: botManager.getBots().length,
        requestsAccepted: acceptedCount,
        teamsFormed: teams.length,
        teamsPlaying: playingTeams.length
      },
      summary: {
        totalBots: botManager.getBots().length,
        guildMembers: guildManager.getGuildMembers().length,
        activeTeams: teams.length,
        teamSize: process.env.TEAM_SIZE || 4
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n╔════════════════════════════════════════╗`);
  console.log(`║  🔥 Free Fire Bot Guild System 🔥     ║`);
  console.log(`╚════════════════════════════════════════╝\n`);
  console.log(`📍 Guild ID:        ${process.env.GUILD_ID}`);
  console.log(`🤖 Total Bots:      ${botManager.getBots().length}`);
  console.log(`👥 Team Size:       ${process.env.TEAM_SIZE || 4} players`);
  console.log(`🌐 Server Port:     ${PORT}`);
  console.log(`\n📋 API Endpoints:\n`);
  console.log(`  🏠 GET  /                              - Server status`);
  console.log(`  📊 GET  /api/guild/status              - Guild overview`);
  console.log(`  🤖 GET  /api/bots/status               - All bots info`);
  console.log(`  📨 GET  /api/guild/pending-requests    - Pending join requests`);
  console.log(`  👥 GET  /api/guild/members            - Guild members`);
  console.log(`  🎯 GET  /api/teams/info                - Teams information`);
  console.log(`  `);
  console.log(`  ▶️  POST /api/bots/start                - Start all bots (send requests)`);
  console.log(`  ✅ POST /api/guild/accept-all-requests - Accept all pending requests`);
  console.log(`  👥 POST /api/teams/form                - Form teams from members`);
  console.log(`  🎮 POST /api/teams/play                - Start playing`);
  console.log(`  ⚡ POST /api/quick-start               - Full automation (1-4 in sequence)`);
  console.log(`\n\n🎯 Quick Start Guide:\n`);
  console.log(`  1. POST http://localhost:${PORT}/api/quick-start`);
  console.log(`  OR follow manual steps:`);
  console.log(`  2. POST http://localhost:${PORT}/api/bots/start`);
  console.log(`  3. POST http://localhost:${PORT}/api/guild/accept-all-requests`);
  console.log(`  4. POST http://localhost:${PORT}/api/teams/form`);
  console.log(`  5. POST http://localhost:${PORT}/api/teams/play\n`);
});

module.exports = app;
