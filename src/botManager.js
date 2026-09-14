const { v4: uuidv4 } = require('uuid');
const Bot = require('./Bot');

class BotManager {
  constructor() {
    this.bots = [];
    this.initializeBots();
  }

  initializeBots() {
    const botCount = parseInt(process.env.BOT_COUNT) || 20;
    for (let i = 1; i <= botCount; i++) {
      const bot = new Bot(`Bot_${i}`, uuidv4());
      this.bots.push(bot);
    }
    console.log(`✅ Initialized ${botCount} bots`);
  }

  async startAllBots(guildId) {
    console.log(`🚀 Starting all ${this.bots.length} bots...\n`);
    const delay = parseInt(process.env.BOT_DELAY) || 500;
    
    for (const bot of this.bots) {
      await bot.joinGuild(guildId);
      await this.sleep(delay);
    }
    
    console.log(`\n✅ All ${this.bots.length} bots sent requests to guild ${guildId}`);
    return this.bots;
  }

  stopAllBots() {
    this.bots.forEach(bot => bot.stop());
    console.log(`⛔ All bots stopped`);
  }

  getActiveBots() {
    return this.bots.filter(bot => bot.status === 'active');
  }

  getBots() {
    return this.bots;
  }

  getBot(botId) {
    return this.bots.find(bot => bot.id === botId);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = BotManager;
