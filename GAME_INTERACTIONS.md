# Game Interactions Playground

Admin tool for exploring and testing game mechanics. Later, this foundation can be opened to players in different ways (quest system, debug mode for streaming, etc.).

## Accessing the Playground

1. Open the game (`npm run dev`)
2. Click **⚙ Admin Menu** (bottom right)
3. Click **🎮 Game Interactions**
4. A panel appears with interaction buttons

## Available Interactions

### Player Inspection
**👤 Inspect Player**
- View current position (pixels and tiles)
- View facing direction
- View velocity vector

```
Player Position: (480.5, 320.2)
Tile Coordinates: (30, 20)
Facing: down
Velocity: (0.00, 1.50)
```

### World Inspection
**🌍 Inspect World**
- World structure overview
- Number of rooms
- Interactive object positions (mirrors, NPC)
- Collision map status

```
=== World Structure ===
Rooms: 3
Mirror 1: (416, 320)
Mirror 2: (800, 320)
NPC: (850, 320)
Collision map: 30 rows
```

### Proximity Detection
**📍 Check Proximity**
- Find nearby interactive objects
- Shows distance to each
- Useful for debugging interaction triggers

```
Mirror 1: 45.2px (CLOSE)
Mirror 2: 125.8px
NPC: 85.3px
```

### Collision Scanning
**🧱 Scan Collisions**
- Find collision tiles around player
- Useful for debugging movement issues
- Shows collision density nearby

```
Scanning around (30, 20) radius 3
Found 4 collision tiles nearby
```

### Game State Verification
**✓ Verify Game State**
- Full health check of game state
- Verifies all required systems
- Shows what's initialized

```
=== Game State Verification ===
✓ Player initialized
✓ World initialized
✓ Player has position
✓ Player has facing
✓ World has rooms
✓ World has collision map
✓ Mirrors configured
✓ NPC configured
Status: 8/8 checks passed
```

### Utilities
**❓ Help**
- Show all available interactions

**🗑 Clear Log**
- Clear interaction history

## Log Output Format

Each log entry shows:
- **Timestamp** - When the interaction ran
- **Message** - What was checked/found
- **Color coding:**
  - 🔵 Blue - Information
  - 🟢 Green - Success/passed
  - 🟡 Yellow - Warning/needs attention
  - 🔴 Red - Error
  - 🟦 Cyan - Headers/sections

## Use Cases

### "Is the player initialized?"
→ Click **✓ Verify Game State**

### "Where is the player exactly?"
→ Click **👤 Inspect Player**

### "Can the player interact with the mirror?"
→ Click **📍 Check Proximity**

### "Why can't the player move here?"
→ Click **🧱 Scan Collisions** at that location

### "Is the world set up correctly?"
→ Click **🌍 Inspect World**

## Integration Points

The playground is built to be extensible. Future additions could include:

### Player Control
- Teleport player
- Change facing direction
- Test movement in direction

### World Manipulation
- Toggle collisions
- Highlight specific areas
- Modify interactive objects

### Scripting
- Record interaction sequences
- Replay gameplay
- Save/load states

### Data Export
- Export exploration map
- Export collision analysis
- Export state snapshots

## Architecture

**InteractionPlayground.js**
- Core interaction logic
- Methods for each inspection/test
- Logging system with timestamps

**InteractionPlayground.jsx**
- React UI component
- Button grid for interactions
- Real-time log display
- Auto-scrolling log

## Later: Player-Facing Features

This foundation enables future features:

**Streaming/Recording**
- Players could toggle interaction view while streaming
- Show collision layout to audience
- Demonstrate game mechanics

**Educational Mode**
- Show how game mechanics work
- Debug common issues
- Learn system layouts

**Community Tools**
- Export world data
- Share collision maps
- Create guides with highlighted areas

**Quest System**
- Verify quest requirements
- Check proximity triggers
- Test quest logic

## Technical Notes

- All interactions read live game state
- No mocking or simulation
- Direct access to player and world objects
- All checks are non-destructive (read-only)

## Files

- `src/game/interactions/InteractionPlayground.js` - Core logic (150+ lines)
- `src/components/DebugButton/InteractionPlayground.jsx` - React component
- `src/components/DebugButton/InteractionPlayground.scss` - Styling
- `src/components/HUD/AdminMenu.jsx` - Access button

## Future Roadmap

1. **Phase 1 (Current)** - Player/world inspection and verification
2. **Phase 2** - Player control (teleport, direction, movement)
3. **Phase 3** - World manipulation and testing
4. **Phase 4** - Recording and playback
5. **Phase 5** - Open to players in some form
