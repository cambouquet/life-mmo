# Map Editor with Real Persistence

The map editor now saves all changes directly to the source PNG files and regenerates `mapData.js`.

## How It Works

1. **Frontend**: The game editor stores changes in the `layerEdits` state
2. **API**: When edits are made, they're automatically POSTed to `/api/map/save` 
3. **Backend**: The Express server (port 3001) reads the PNG layer files, applies edits, and rewrites them
4. **Generation**: After PNG files are updated, `mapData.js` is regenerated with new base64-encoded layer data
5. **Persistence**: Changes are now baked into the actual map files — they persist across browser reloads and new browser instances

## Setup

### Install Dependencies
```bash
npm install
```

### Run Development Server (With Map Persistence)

Open two terminals:

**Terminal 1 - Backend API:**
```bash
node server.mjs
```
This starts the Express API on http://localhost:3001

**Terminal 2 - Frontend:**
```bash
npm run dev
```
This starts Vite on http://localhost:5173

The Vite dev server is configured to proxy `/api/*` requests to the backend.

### Or Use Combined Script
```bash
npm run dev:with-api
```
(This runs both in the same shell)

## How to Test

1. Open the game in your browser at http://localhost:5173
2. Press 'M' to open the map editor debug panel
3. Click on tiles to edit them
4. Close the browser tab or refresh — your edits will still be there
5. Open a new browser tab and navigate to the game — edits persist!

## Technical Details

- **PNG Files**: `/src/assets/maps/layer0_ground.png`, `layer1_walls.png`, `layer2_objects.png`, `layer3_entities.png`
- **Regenerated**: `/src/assets/maps/mapData.js` (auto-generated, do not edit manually)
- **Encoding**: Each pixel is RGBA where R=spritesheet ID, G=row, B=variant, A=255 (opaque) or 0 (empty)

## Troubleshooting

- If edits don't appear after reload, check that the backend server is running on port 3001
- Check browser console for any fetch errors
- The server logs will show "✓ Regenerated mapData.js" when edits are saved
- Make sure Vite proxy is configured in `vite.config.js` for `/api` routes
