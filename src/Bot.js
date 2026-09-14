class Bot {
  constructor(name, id) {
    this.id = id;
    this.name = name;
    this.status = 'idle';
    this.inGuild = false;
    this.inTeam = false;
    this.teamId = null;
    this.guildId = null;
    this.createdAt = new Date();
  }

  async joinGuild(guildId) {
    this.guildId = guildId;
    this.status = 'requesting';
    console.log(`📨 ${this.name} (${this.id.substring(0, 8)}) sending join request to guild ${guildId}`);
    
    // Simulate API call to Free Fire
    await new Promise(resolve => setTimeout(resolve, 500));
    
    this.status = 'pending';
    return true;
  }

  acceptRequest() {
    this.inGuild = true;
    this.status = 'active';
    console.log(`✅ ${this.name} accepted to guild ${this.guildId}`);
    return true;
  }

  joinTeam(teamId) {
    this.inTeam = true;
    this.teamId = teamId;
    this.status = 'in_team';
    console.log(`👥 ${this.name} joined team ${teamId}`);
    return true;
  }

  startPlaying() {
    if (!this.inTeam) {
      console.log(`⚠️  ${this.name} not in team, cannot play`);
      return false;
    }
    this.status = 'playing';
    console.log(`🎮 ${this.name} started playing in team ${this.teamId}`);
    return true;
  }

  stop() {
    this.status = 'offline';
    this.inGuild = false;
    this.inTeam = false;
    this.teamId = null;
    console.log(`⛔ ${this.name} stopped`);
  }

  getStatus() {
    return {
      id: this.id,
      name: this.name,
      status: this.status,
      inGuild: this.inGuild,
      inTeam: this.inTeam,
      teamId: this.teamId,
      guildId: this.guildId,
      createdAt: this.createdAt
    };
  }
}

module.exports = Bot;
