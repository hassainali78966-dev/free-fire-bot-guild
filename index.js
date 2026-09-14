const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const BotManager = require('./src/botManager');
const GuildManager = require('./src/guildManager');

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const botManager = new BotManager();
const guildManager = new GuildManager(process.env.GUILD_ID || '3053781077');

// Auto-start on server launch
const autoStartSequence = async () => {
  console.log('\n\n╔════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                  🔥 AUTO-STARTING BOT SYSTEM 🔥                      ║');
  console.log('╚═══════════════���════════════════════════════════════════════════════════════╝\n');
  
  try {
    // Step 1: Start all bots
    console.log('⏱️  [STEP 1/4] Starting all 20 bots...\n');
    await botManager.startAllBots(process.env.GUILD_ID || '3053781077');
    await sleep(2000);
    
    // Step 2: Accept all requests
    console.log('\n⏱️  [STEP 2/4] Accepting all join requests...\n');
    const acceptedCount = guildManager.acceptAllRequests().length;
    await sleep(1500);
    
    // Step 3: Form teams
    console.log('\n⏱️  [STEP 3/4] Forming teams...\n');
    const teams = await guildManager.formTeams();
    await sleep(1500);
    
    // Step 4: Start playing
    console.log('\n⏱️  [STEP 4/4] Starting gameplay...\n');
    const playingTeams = await guildManager.startPlaying();
    
    console.log('\n╔════════════════════════════════════════════════════════════════════════════╗');
    console.log('║                   ✅ AUTOMATION COMPLETE! ✅                          ║');
    console.log('╚════════════════════════════════════════════════════════════════════════════╝');
    console.log(`\n📊 SUMMARY:`);
    console.log(`   ├─ 🤖 Bots Started: ${botManager.getBots().length}`);
    console.log(`   ├─ ✅ Requests Accepted: ${acceptedCount}`);
    console.log(`   ├─ 👥 Guild Members: ${guildManager.getGuildMembers().length}`);
    console.log(`   ├─ 🏆 Teams Formed: ${teams.length}`);
    console.log(`   └─ 🎮 Teams Playing: ${playingTeams.length}\n`);
  } catch (error) {
    console.error('❌ Error during auto-start:', error.message);
  }
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Routes
app.get('/', (req, res) => {
  res.json({
    message: '🔥 Free Fire Bot Guild System',
    status: 'ACTIVE & RUNNING',
    guildId: process.env.GUILD_ID || '3053781077',
    botsTotal: botManager.getBots().length,
    botsActive: botManager.getActiveBots().length,
    guildMembers: guildManager.getGuildMembers().length,
    pendingRequests: guildManager.getPendingRequests().length,
    teamsFormed: guildManager.getTeams().length
  });
});

app.get('/api/guild/status', (req, res) => {
  res.json({
    guildId: process.env.GUILD_ID || '3053781077',
    totalBots: botManager.getBots().length,
    activeBots: botManager.getActiveBots().length,
    pendingRequests: guildManager.getPendingRequests().length,
    acceptedMembers: guildManager.getAcceptedRequests().length,
    guildMembers: guildManager.getGuildMembers().length,
    teamsFormed: guildManager.getTeams().length,
    teamSize: process.env.TEAM_SIZE || 4
  });
});

app.get('/api/bots/status', (req, res) => {
  res.json({
    totalBots: botManager.getBots().length,
    bots: botManager.getBots().map(bot => bot.getStatus())
  });
});

app.get('/api/guild/pending-requests', (req, res) => {
  res.json({
    pendingCount: guildManager.getPendingRequests().length,
    requests: guildManager.getPendingRequests()
  });
});

app.post('/api/guild/accept-request', (req, res) => {
  const { botId } = req.body;
  if (!botId) {
    return res.status(400).json({ error: 'botId is required' });
  }
  const result = guildManager.acceptRequest(botId);
  res.json(result);
});

app.post('/api/guild/accept-all-requests', (req, res) => {
  const results = guildManager.acceptAllRequests();
  res.json({
    message: `✅ All ${results.length} requests accepted!`,
    accepted: results.length,
    totalMembers: guildManager.getGuildMembers().length,
    details: results
  });
});

app.post('/api/bots/start', async (req, res) => {
  try {
    await botManager.startAllBots(process.env.GUILD_ID || '3053781077');
    res.json({ 
      message: `✅ All ${botManager.getBots().length} bots started!`,
      botsCount: botManager.getBots().length,
      pendingRequests: guildManager.getPendingRequests().length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/bots/stop', (req, res) => {
  botManager.stopAllBots();
  res.json({ message: '⛔ All bots stopped' });
});

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

app.get('/api/guild/members', (req, res) => {
  const members = guildManager.getGuildMembers();
  res.json({
    guildId: process.env.GUILD_ID || '3053781077',
    totalMembers: members.length,
    members: members
  });
});

app.get('/api/teams/info', (req, res) => {
  const teams = guildManager.getTeams();
  res.json({
    totalTeams: teams.length,
    teamSize: process.env.TEAM_SIZE || 4,
    teams: teams
  });
});

app.post('/api/quick-start', async (req, res) => {
  try {
    console.log('\n\n╔════════════════════════════════════════════════════════════════════════════╗');
    console.log('║                    🚀 QUICK START INITIATED 🚀                       ║');
    console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

    // Step 1
    console.log('⏱️  [STEP 1/4] Starting all 20 bots...\n');
    await botManager.startAllBots(process.env.GUILD_ID || '3053781077');
    await sleep(2000);

    // Step 2
    console.log('\n⏱️  [STEP 2/4] Accepting all join requests...\n');
    const acceptedCount = guildManager.acceptAllRequests().length;
    await sleep(1500);

    // Step 3
    console.log('\n⏱️  [STEP 3/4] Forming teams...\n');
    const teams = await guildManager.formTeams();
    await sleep(1500);

    // Step 4
    console.log('\n⏱️  [STEP 4/4] Starting gameplay...\n');
    const playingTeams = await guildManager.startPlaying();

    console.log('\n╔════════════════════════════════════════════════════════════════════════════╗');
    console.log('║                   ✅ AUTOMATION COMPLETE! ✅                          ║');
    console.log('╚════════════════════════════════════════════════════════════════════════════\n');

    res.json({
      message: '✅ Full automation complete!',
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

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

app.listen(PORT, async () => {
  console.log(`\n╔════════════════════════════════════════════════════════════════════════════╗`);
  console.log(`║               🔥 Free Fire Bot Guild System 🔥                       ║`);
  console.log(`╚════════════════════════════════════════════════════════════════════════════╝\n`);
  console.log(`✅ Server running on http://localhost:${PORT}\n`);
  console.log(`📍 Guild ID:        ${process.env.GUILD_ID || '3053781077'}`);
  console.log(`🤖 Total Bots:      ${botManager.getBots().length}`);
  console.log(`👥 Team Size:       ${process.env.TEAM_SIZE || 4} players`);
  console.log(`\n⚡ QUICK START:\n`);
  console.log(`   curl -X POST http://localhost:${PORT}/api/quick-start\n`);
  console.log(`   This will automatically:`);
  console.log(`   1. Start all 20 bots`);
  console.log(`   2. Accept all guild requests`);
  console.log(`   3. Form 5 teams (4 players each)`);
  console.log(`   4. Start all teams playing\n`);

  // Auto-start after 2 seconds
  console.log(`⏳ Auto-starting in 2 seconds...\n`);
  await sleep(2000);
  await autoStartSequence();
});

module.exports = app;
