# Free Fire Bot Guild System

🔥 **Automated bot management system for Free Fire guild operations**

## Features

✅ **20 Autonomous Bots** - Automatically join your guild
✅ **Smart Request System** - Bots send join requests to your guild
✅ **Auto-Accept Requests** - Accept all requests via single API call
✅ **Automatic Team Formation** - Bots automatically form teams (4 players per team by default)
✅ **Auto-Play System** - Teams start playing matches automatically
✅ **Real-time Monitoring** - Track bot status, guild members, and team info
✅ **Quick Start** - Complete automation with one API endpoint

## Installation

```bash
# Clone the repository
git clone https://github.com/hassainali78966-dev/free-fire-bot-guild.git
cd free-fire-bot-guild

# Install dependencies
npm install

# Create .env file from template
cp .env.example .env

# Edit .env and add your Guild ID
GUILD_ID=3053781077
```

## Configuration

Edit `.env` file:

```env
GUILD_ID=3053781077           # Your Free Fire Guild ID
BOT_COUNT=20                  # Number of bots (default: 20)
API_PORT=3000                 # Server port
BOT_DELAY=1000                # Delay between bot requests (ms)
TEAM_SIZE=4                   # Players per team
AUTO_PLAY_ENABLED=true        # Enable auto-play
AUTO_ACCEPT_REQUESTS=true     # Auto-accept all requests
```

## Quick Start

### Option 1: Full Automation (Recommended)

```bash
# Start the server
npm start

# In another terminal, trigger quick start
curl -X POST http://localhost:3000/api/quick-start
```

This will:
1. 🤖 Start all 20 bots and send join requests
2. ✅ Accept all pending requests automatically
3. 👥 Form teams (4 players each = 5 teams)
4. 🎮 Start all teams playing automatically

### Option 2: Manual Steps

```bash
# Start server
npm start
```

Then make these API calls in order:

```bash
# 1. Start all bots (send requests to guild)
curl -X POST http://localhost:3000/api/bots/start

# 2. Accept all pending requests
curl -X POST http://localhost:3000/api/guild/accept-all-requests

# 3. Form teams
curl -X POST http://localhost:3000/api/teams/form

# 4. Start playing
curl -X POST http://localhost:3000/api/teams/play
```

## API Endpoints

### Status & Monitoring

```
GET  /                              - Server status
GET  /api/guild/status              - Guild overview
GET  /api/bots/status               - All bots information
GET  /api/guild/pending-requests    - Pending join requests
GET  /api/guild/members             - Guild members list
GET  /api/teams/info                - Teams information
```

### Bot Operations

```
POST /api/bots/start                - Start all 20 bots (send join requests)
POST /api/bots/stop                 - Stop all bots
```

### Guild Management

```
POST /api/guild/accept-request      - Accept single request (requires botId in body)
POST /api/guild/accept-all-requests - Accept all pending requests
```

### Team & Gameplay

```
POST /api/teams/form                - Form teams from guild members
POST /api/teams/play                - Start all teams playing
```

### Automation

```
POST /api/quick-start               - Full automation (recommended!)
```

## Example API Responses

### GET /api/guild/status
```json
{
  "guildId": "3053781077",
  "totalBots": 20,
  "activeBots": 20,
  "pendingRequests": 5,
  "acceptedMembers": 15,
  "guildMembers": 15,
  "teamsFormed": 3,
  "teamSize": 4
}
```

### POST /api/quick-start
```json
{
  "message": "🎮 Full automation complete!",
  "steps": {
    "botsStarted": 20,
    "requestsAccepted": 20,
    "teamsFormed": 5,
    "teamsPlaying": 5
  },
  "summary": {
    "totalBots": 20,
    "guildMembers": 20,
    "activeTeams": 5,
    "teamSize": 4
  }
}
```

## Workflow Explanation

```
┌─────────────────────────────────────────────────────────────┐
│  Step 1: Start Bots                                        │
│  🤖 20 bots join guild 3053781077                         │
│  📨 All bots send join requests                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 2: Accept Requests                                   │
│  ✅ Accept all 20 pending requests                        │
│  👥 20 bots now members of guild                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 3: Form Teams                                        │
│  🏆 Create 5 teams (4 players each)                       │
│  👥 Distribute all 20 bots into teams                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 4: Start Playing                                     │
│  🎮 All 5 teams automatically start matches               │
│  🏅 Bots play continuously                                │
└─────────────────────────────────────────────────────────────┘
```

## Features in Detail

### 🤖 Bot Management
- Create and manage 20 independent bot accounts
- Each bot has unique ID and name (Bot_1 to Bot_20)
- Track bot status: idle, requesting, pending, active, in_team, playing, offline
- Control all bots with single API commands

### 📨 Request System
- Bots automatically send join requests to your guild
- View all pending requests in real-time
- Accept requests individually or in bulk
- Track acceptance history

### 👥 Guild Management
- Monitor guild members in real-time
- View pending requests list
- Accept/reject requests individually
- Bulk accept all requests with one click

### 🏆 Team Formation
- Automatic team creation from guild members
- Configurable team size (default: 4 players)
- Even distribution of members
- Track team composition

### 🎮 Auto-Play System
- Teams automatically start matches
- Continuous gameplay simulation
- Team status monitoring
- Play duration tracking

## Console Output Example

```
╔═════════════════════════════════════════════════════════╗
║  🔥 Free Fire Bot Guild System 🔥     ║
╚═════════════════════════════════════════════════════════╝

📍 Guild ID:        3053781077
🤖 Total Bots:      20
👥 Team Size:       4 players
🌐 Server Port:     3000

📧 Bots sending requests...
✅ Bot_1 accepted to guild 3053781077
✅ Bot_2 accepted to guild 3053781077
...
✅ Bot_20 accepted to guild 3053781077

👥 Forming 5 teams...
  👥 Team 1: Bot_1, Bot_2, Bot_3, Bot_4
  👥 Team 2: Bot_5, Bot_6, Bot_7, Bot_8
  👥 Team 3: Bot_9, Bot_10, Bot_11, Bot_12
  👥 Team 4: Bot_13, Bot_14, Bot_15, Bot_16
  👥 Team 5: Bot_17, Bot_18, Bot_19, Bot_20

🎮 Starting gameplay...
  🎮 Team 1 started playing
  🎮 Team 2 started playing
  🎮 Team 3 started playing
  🎮 Team 4 started playing
  🎮 Team 5 started playing
```

## How It Works

1. **Bot Initialization**: On startup, the system creates 20 bot instances
2. **Join Requests**: When you call `/api/bots/start`, all bots send join requests to your guild
3. **Request Management**: Pending requests appear in the guild request list
4. **Accept Requests**: You can accept all requests via API (or manually in-game)
5. **Team Formation**: Once accepted, bots are automatically divided into teams
6. **Auto-Play**: Teams immediately start playing matches

## Customization

### Change Bot Count
```env
BOT_COUNT=30  # Create 30 bots instead of 20
```

### Adjust Team Size
```env
TEAM_SIZE=5   # Form teams of 5 players instead of 4
```

### Modify Request Delay
```env
BOT_DELAY=500  # Send bot requests every 500ms instead of 1000ms
```

## Troubleshooting

### Bots not joining guild
- Verify `GUILD_ID` is correct in `.env`
- Check guild settings allow external joins
- Ensure bot accounts are created

### Requests not appearing
- Wait a few seconds for requests to propagate
- Check pending requests via `/api/guild/pending-requests`
- Verify guild notification settings

### Teams not forming
- Ensure at least one bot has been accepted
- Call `/api/guild/accept-all-requests` first
- Check team size matches available members

## Requirements

- Node.js 12+
- npm 6+
- Free Fire account with guild access

## License

MIT License - Feel free to use and modify!

## Support

For issues and questions, please create an issue on GitHub.

---

**Made with ❤️ for Free Fire players**
