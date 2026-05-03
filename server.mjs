// Backend API for map editor persistence
import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import path from 'path'
import { writeFileSync, readFileSync } from 'fs'
import { PNG } from 'pngjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

// Load the map generation script
const mapsDir = path.join(__dirname, 'src/assets/maps')
const pngFilesPath = {
  layer0: path.join(__dirname, 'src/assets/maps/layer0_ground.png'),
  layer1: path.join(__dirname, 'src/assets/maps/layer1_walls.png'),
  layer2: path.join(__dirname, 'src/assets/maps/layer2_objects.png'),
  layer3: path.join(__dirname, 'src/assets/maps/layer3_entities.png'),
}

// Read PNG file and convert to grid
function readPngLayer(filePath) {
  const data = readFileSync(filePath)
  const png = PNG.sync.read(data)
  const grid = []
  const { width, height } = png

  for (let r = 0; r < height; r++) {
    grid[r] = []
    for (let c = 0; c < width; c++) {
      const i = (r * width + c) * 4
      if (png.data[i + 3] === 0) {
        grid[r][c] = null
      } else {
        grid[r][c] = {
          ss: png.data[i],
          row: png.data[i + 1],
          variant: png.data[i + 2],
        }
      }
    }
  }
  return grid
}

// Convert grid back to PNG
function writePngLayer(filePath, grid) {
  const height = grid.length
  const width = grid[0]?.length || 0
  const png = new PNG({ width, height, filterType: -1 })
  png.data.fill(0)

  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      if (grid[r][c]) {
        const i = (r * width + c) * 4
        png.data[i] = grid[r][c].ss
        png.data[i + 1] = grid[r][c].row
        png.data[i + 2] = grid[r][c].variant
        png.data[i + 3] = 255
      }
    }
  }

  const buf = PNG.sync.write(png)
  writeFileSync(filePath, buf)
}

// Convert bytes to base64
function bytesToB64(bytes) {
  return Buffer.from(bytes).toString('base64')
}

// Regenerate mapData.js from PNG files
function regenerateMapData() {
  // Read all layers
  const layers = {
    layer0: readPngLayer(pngFilesPath.layer0),
    layer1: readPngLayer(pngFilesPath.layer1),
    layer2: readPngLayer(pngFilesPath.layer2),
    layer3: readPngLayer(pngFilesPath.layer3),
  }

  const MAP_W = layers.layer0[0].length
  const MAP_H = layers.layer0.length

  // Convert grids to base64
  function gridToB64(grid) {
    const bytes = new Uint8Array(MAP_W * MAP_H * 4)
    let idx = 0
    for (let r = 0; r < MAP_H; r++) {
      for (let c = 0; c < MAP_W; c++) {
        if (grid[r][c]) {
          bytes[idx] = grid[r][c].ss
          bytes[idx + 1] = grid[r][c].row
          bytes[idx + 2] = grid[r][c].variant
          bytes[idx + 3] = 255
        } else {
          bytes[idx + 3] = 0
        }
        idx += 4
      }
    }
    return bytesToB64(bytes)
  }

  const LAYER0 = gridToB64(layers.layer0)
  const LAYER1 = gridToB64(layers.layer1)
  const LAYER2 = gridToB64(layers.layer2)
  const LAYER3 = gridToB64(layers.layer3)

  // Generate mapData.js
  const mapDataContent = `// AUTO-GENERATED — do not edit. Run: node scripts/generate-maps.mjs
export const MAP_W = ${MAP_W}
export const MAP_H = ${MAP_H}
export const LAYER0 = '${LAYER0}'
export const LAYER1 = '${LAYER1}'
export const LAYER2 = '${LAYER2}'
export const LAYER3 = '${LAYER3}'
`

  writeFileSync(path.join(mapsDir, 'mapData.js'), mapDataContent)
  console.log('✓ Regenerated mapData.js')
}

app.post('/api/map/save', (req, res) => {
  try {
    const { layerEdits, spriteColorOverrides } = req.body

    if (!layerEdits) {
      return res.status(400).json({ error: 'Missing layerEdits' })
    }

    // Read all PNG layers
    const layers = {
      ground: readPngLayer(pngFilesPath.layer0),
      walls: readPngLayer(pngFilesPath.layer1),
      objects: readPngLayer(pngFilesPath.layer2),
      entities: readPngLayer(pngFilesPath.layer3),
    }

    const layerMap = {
      ground: layers.ground,
      wall: layers.walls,
      obj: layers.objects,
      entity: layers.entities,
    }

    // Apply edits
    Object.entries(layerEdits).forEach(([tileKey, edits]) => {
      const [c, r] = tileKey.split(',').map(Number)

      Object.entries(edits).forEach(([field, sprite]) => {
        if (sprite) {
          const layer = layerMap[field]
          if (layer && layer[r]) {
            layer[r][c] = sprite
          }
        }
      })
    })

    // Write back to PNG files
    writePngLayer(pngFilesPath.layer0, layers.ground)
    writePngLayer(pngFilesPath.layer1, layers.walls)
    writePngLayer(pngFilesPath.layer2, layers.objects)
    writePngLayer(pngFilesPath.layer3, layers.entities)

    // Regenerate mapData.js
    regenerateMapData()

    res.json({ success: true })
  } catch (error) {
    console.error('Error saving map:', error)
    res.status(500).json({ error: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`🎮 Map editor API running on http://localhost:${PORT}`)
})
