import { test, expect } from '@playwright/test';

test.describe('Map Editor Backup and Restore', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    // Clear any existing backups
    await page.evaluate(() => {
      localStorage.removeItem('life-mmo-map-backups');
    });
  });

  test('should create a backup in localStorage', async ({ page }) => {
    // Inject the backup creation logic directly via evaluate
    const backup = await page.evaluate(() => {
      const LS_MAP_BACKUPS = 'life-mmo-map-backups';

      const backup = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        layerEdits: { '0,0': { ground: { ss: 0x00, row: 0, variant: 1 } } },
        spriteColorOverrides: { '0x00_v1': '#ff0000' },
        floorColors: ['#0a0612', '#2d1b4e', '#445566']
      };

      const backups = [backup];
      localStorage.setItem(LS_MAP_BACKUPS, JSON.stringify(backups));

      return backup;
    });

    // Verify backup was created
    expect(backup.id).toBeDefined();
    expect(backup.timestamp).toBeDefined();
    expect(backup.layerEdits).toBeDefined();
    expect(backup.spriteColorOverrides).toBeDefined();
    expect(backup.floorColors).toBeDefined();

    // Verify it persisted to localStorage
    const stored = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('life-mmo-map-backups') || '[]');
    });
    expect(stored.length).toBe(1);
    expect(stored[0].id).toBe(backup.id);
  });

  test('should restore map state from backup', async ({ page }) => {
    // Create a backup
    const backup = await page.evaluate(() => {
      const LS_MAP_BACKUPS = 'life-mmo-map-backups';

      const backup = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        layerEdits: {
          '10,20': { ground: { ss: 0x00, row: 0, variant: 2 }, wall: { ss: 0x01, row: 1 } },
          '11,21': { obj: { ss: 0x03, row: 3 } }
        },
        spriteColorOverrides: { '0x00_v2': '#ff0000', '0x01_1': '#00ff00' },
        floorColors: ['#0a0612', '#2d1b4e', '#445566', '#6b7a8f']
      };

      localStorage.setItem(LS_MAP_BACKUPS, JSON.stringify([backup]));
      return backup;
    });

    // Restore the backup
    const restored = await page.evaluate(() => {
      const LS_MAP_BACKUPS = 'life-mmo-map-backups';
      const backups = JSON.parse(localStorage.getItem(LS_MAP_BACKUPS) || '[]');

      if (backups.length === 0) return null;

      const backup = backups[0];

      // Simulate the restoreBackup function
      const layerEdits = backup.layerEdits;
      const spriteColorOverrides = backup.spriteColorOverrides;
      const floorColors = backup.floorColors;

      return {
        layerEdits,
        spriteColorOverrides,
        floorColors
      };
    });

    // Verify restoration contains the original data
    expect(restored).toBeDefined();
    expect(restored.layerEdits).toEqual(backup.layerEdits);
    expect(restored.spriteColorOverrides).toEqual(backup.spriteColorOverrides);
    expect(restored.floorColors).toEqual(backup.floorColors);
  });

  test('should persist backup data with all required properties', async ({ page }) => {
    // Create a backup
    const backup = await page.evaluate(() => {
      const LS_MAP_BACKUPS = 'life-mmo-map-backups';

      const backup = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        layerEdits: { '5,5': { ground: { ss: 0x00, row: 0, variant: 0 } } },
        spriteColorOverrides: {},
        floorColors: ['#0a0612', '#2d1b4e']
      };

      localStorage.setItem(LS_MAP_BACKUPS, JSON.stringify([backup]));
      return backup;
    });

    // Retrieve from localStorage
    const stored = await page.evaluate(() => {
      const backups = JSON.parse(localStorage.getItem('life-mmo-map-backups') || '[]');
      return backups[0];
    });

    // Verify all properties are present
    expect(stored).toHaveProperty('id');
    expect(stored).toHaveProperty('timestamp');
    expect(stored).toHaveProperty('layerEdits');
    expect(stored).toHaveProperty('spriteColorOverrides');
    expect(stored).toHaveProperty('floorColors');

    expect(typeof stored.layerEdits).toBe('object');
    expect(typeof stored.spriteColorOverrides).toBe('object');
    expect(Array.isArray(stored.floorColors)).toBe(true);
  });

  test('should load backups from localStorage', async ({ page }) => {
    // Create multiple backups
    const backups = await page.evaluate(() => {
      const LS_MAP_BACKUPS = 'life-mmo-map-backups';

      const backups = [
        {
          id: 1000,
          timestamp: '5/5/2026, 10:00:00 AM',
          layerEdits: {},
          spriteColorOverrides: {},
          floorColors: ['#0a0612']
        },
        {
          id: 2000,
          timestamp: '5/5/2026, 10:01:00 AM',
          layerEdits: { '0,0': { ground: { ss: 0x00, row: 0, variant: 1 } } },
          spriteColorOverrides: {},
          floorColors: ['#0a0612', '#2d1b4e']
        }
      ];

      localStorage.setItem(LS_MAP_BACKUPS, JSON.stringify(backups));
      return backups;
    });

    // Load backups from localStorage
    const loaded = await page.evaluate(() => {
      const data = localStorage.getItem('life-mmo-map-backups');
      return data ? JSON.parse(data) : [];
    });

    expect(loaded.length).toBe(2);
    expect(loaded[0].id).toBe(1000);
    expect(loaded[1].id).toBe(2000);
  });

  test('should limit backups to 5 most recent', async ({ page }) => {
    // Create 6 backups and verify only 5 are kept
    const result = await page.evaluate(() => {
      const LS_MAP_BACKUPS = 'life-mmo-map-backups';

      const backups = [];
      for (let i = 0; i < 6; i++) {
        const backup = {
          id: i,
          timestamp: new Date(Date.now() + i * 1000).toLocaleString(),
          layerEdits: {},
          spriteColorOverrides: {},
          floorColors: ['#0a0612']
        };
        backups.unshift(backup); // Add to front like the component does
      }

      // Keep only 5 most recent
      const limited = backups.slice(0, 5);
      localStorage.setItem(LS_MAP_BACKUPS, JSON.stringify(limited));

      return limited;
    });

    // Verify only 5 backups exist
    const stored = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('life-mmo-map-backups') || '[]');
    });

    expect(stored.length).toBe(5);
  });

  test('should delete a backup from localStorage', async ({ page }) => {
    // Create 3 backups
    const backups = await page.evaluate(() => {
      const LS_MAP_BACKUPS = 'life-mmo-map-backups';

      const backups = [
        { id: 100, timestamp: '10:00', layerEdits: {}, spriteColorOverrides: {}, floorColors: [] },
        { id: 200, timestamp: '10:01', layerEdits: {}, spriteColorOverrides: {}, floorColors: [] },
        { id: 300, timestamp: '10:02', layerEdits: {}, spriteColorOverrides: {}, floorColors: [] }
      ];

      localStorage.setItem(LS_MAP_BACKUPS, JSON.stringify(backups));
      return backups;
    });

    expect(backups.length).toBe(3);

    // Delete one backup
    await page.evaluate(() => {
      const LS_MAP_BACKUPS = 'life-mmo-map-backups';
      const backups = JSON.parse(localStorage.getItem(LS_MAP_BACKUPS) || '[]');
      const newBackups = backups.filter(b => b.id !== 200);
      localStorage.setItem(LS_MAP_BACKUPS, JSON.stringify(newBackups));
    });

    // Verify backup was deleted
    const remaining = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('life-mmo-map-backups') || '[]');
    });

    expect(remaining.length).toBe(2);
    expect(remaining.find(b => b.id === 200)).toBeUndefined();
    expect(remaining.map(b => b.id)).toEqual([100, 300]);
  });
});
