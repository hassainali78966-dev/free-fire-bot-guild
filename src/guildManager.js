const { v4: uuidv4 } = require('uuid');

class GuildManager {
  constructor(guildId) {
    this.guildId = guildId;
    this.members = [];
    this.pendingRequests = [];
    this.acceptedRequests = [];
    this.teams = [];
    this.teamSize = parseInt(process.env.TEAM_SIZE) || 4;
    console.log(`🏰 Guild Manager initialized for guild ${guildId}`);
  }

  addPendingRequest(botId, botName) {
    this.pendingRequests.push({
      botId,
      botName,
      timestamp: new Date(),
      status: 'pending'
    });
    console.log(`📥 New request from ${botName} (${botId.substring(0, 8)}) - Total pending: ${this.pendingRequests.length}`);
    return true;
  }

  acceptRequest(botId) {
    const request = this.pendingRequests.find(r => r.botId === botId);
    if (!request) {
      return { success: false, message: 'Request not found' };
    }

    this.pendingRequests = this.pendingRequests.filter(r => r.botId !== botId);
    request.status = 'accepted';
    request.acceptedAt = new Date();
    this.acceptedRequests.push(request);
    this.members.push({ botId, botName: request.botName });
    
    console.log(`✅ ${request.botName} accepted - Total members: ${this.members.length}`);
    return { success: true, botName: request.botName, totalMembers: this.members.length };
  }

  acceptAllRequests() {
    const results = [];
    const requests = [...this.pendingRequests];
    
    for (const request of requests) {
      this.acceptRequest(request.botId);
      results.push(request);
    }
    
    console.log(`\n🎉 All ${results.length} requests accepted!`);
    console.log(`👥 Total guild members: ${this.members.length}`);
    return results;
  }

  async formTeams() {
    if (this.acceptedRequests.length === 0) {
      console.log('⚠️  No members to form teams');
      return [];
    }

    this.teams = [];
    const members = [...this.members];
    let teamNumber = 1;

    console.log(`\n👥 Forming teams with ${this.teamSize} members each...`);

    for (let i = 0; i < members.length; i += this.teamSize) {
      const teamMembers = members.slice(i, i + this.teamSize);
      if (teamMembers.length > 0) {
        const team = {
          id: uuidv4(),
          teamNumber: teamNumber,
          members: teamMembers,
          status: 'formed',
          createdAt: new Date()
        };
        this.teams.push(team);
        console.log(`  🎯 Team ${teamNumber}: ${teamMembers.map(m => m.botName).join(', ')}`);
        teamNumber++;
      }
    }

    console.log(`\n✅ ${this.teams.length} teams formed!\n`);
    return this.teams;
  }

  async startPlaying() {
    if (this.teams.length === 0) {
      console.log('⚠️  No teams formed. Form teams first.');
      return [];
    }

    console.log(`\n🎮 Starting gameplay for ${this.teams.length} teams...`);
    const results = [];

    for (const team of this.teams) {
      team.status = 'playing';
      team.startedAt = new Date();
      console.log(`  🚀 Team ${team.teamNumber} started playing (${team.members.length} players)`);
      results.push({
        teamNumber: team.teamNumber,
        teamId: team.id,
        players: team.members.length,
        status: 'playing',
        startTime: team.startedAt
      });
    }

    console.log(`\n✅ All ${this.teams.length} teams are now playing!\n`);
    return results;
  }

  getPendingRequests() {
    return this.pendingRequests;
  }

  getAcceptedRequests() {
    return this.acceptedRequests;
  }

  getGuildMembers() {
    return this.members;
  }

  getTeams() {
    return this.teams.map(team => ({
      id: team.id,
      teamNumber: team.teamNumber,
      status: team.status,
      members: team.members.length,
      membersList: team.members.map(m => m.botName),
      createdAt: team.createdAt
    }));
  }
}

module.exports = GuildManager;
