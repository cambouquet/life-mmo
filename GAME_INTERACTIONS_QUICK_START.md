# Game Interactions - Quick Start

## What Is It?

An **admin playground** for exploring and testing game mechanics. It's the foundation for what could later be shared with players in different ways (streaming tools, educational features, quest debugging, etc.).

## How to Access

1. Start the game: `npm run dev`
2. Click **⚙ Admin Menu** (bottom right corner)
3. Click **🎮 Game Interactions**
4. Panel appears with buttons - click any to explore!

## What Can You Do?

### Inspect Things
- **👤 Inspect Player** - Where are you? What direction are you facing? Moving fast?
- **🌍 Inspect World** - How many rooms? Where are the mirrors and NPC?

### Debug Things
- **📍 Check Proximity** - What's near me? (Useful: mirrors, NPCs, doors)
- **🧱 Scan Collisions** - Are there walls around me? (Debug movement issues)

### Verify Things
- **✓ Verify Game State** - Is everything initialized correctly?
- **❓ Help** - Show all interactions
- **🗑 Clear Log** - Clear history

## Example Usage

### "I want to know where I am exactly"
→ Click **👤 Inspect Player**

Output:
```
Player Position: (480.5, 320.2)
Tile Coordinates: (30, 20)
Facing: down
Velocity: (0.00, 1.50)
```

### "Can I interact with the mirror?"
→ Click **📍 Check Proximity**

Output:
```
Mirror 1: 45.2px (CLOSE)
Mirror 2: 125.8px
NPC: 85.3px
```

### "Why can't I move somewhere?"
→ Click **🧱 Scan Collisions** at that location

Output:
```
Scanning around (25, 15) radius 3
Found 7 collision tiles nearby
```

### "Is the game working?"
→ Click **✓ Verify Game State**

Output:
```
✓ Player initialized
✓ World initialized
✓ Player has position
... (all checks)
Status: 8/8 checks passed
```

## Log Colors

- 🔵 **Blue** - Information
- 🟢 **Green** - Success/working
- 🟡 **Yellow** - Warning/issue
- 🔴 **Red** - Error
- 🟦 **Cyan** - Headers/sections

## For Developers

The playground is built to be extended. Currently it's inspection-only, but could add:
- Teleport player
- Change direction
- Toggle collisions
- Record/replay sequences
- And more...

See [GAME_INTERACTIONS.md](GAME_INTERACTIONS.md) for full documentation.

## Key Idea

This is **not tests**. It's a tool to understand how the game works - for development now, and later for players in whatever form makes sense (streaming, educational, quests, etc.).

---

**File:** Click ⚙ → 🎮
