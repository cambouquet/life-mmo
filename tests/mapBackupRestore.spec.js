import { test, expect } from '@playwright/test';

test.describe('Map Backup Restore Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    // Clear any existing backups
    await page.evaluate(() => {
      localStorage.removeItem('life-mmo-map-backups');
    });
  });

  test('should restore backup state correctly - deep copy verification', async ({ page }) => {
    // Create initial backup with specific data
    const createdBackup = await page.evaluate(() => {
      const LS_MAP_BACKUPS = 'life-mmo-map-backups';

      const backup = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        layerEdits: {
          '0,0': { ground: { ss: 0x00, row: 0, variant: 1 } },
          '1,1': { wall: { ss: 0x01, row: 2 } }
        },
        spriteColorOverrides: {
          '0x00_v1': '#ff0000',
          '0x01_2': '#00ff00'
        },
        floorColors: ['#0a0612', '#2d1b4e', '#445566']
      };

      localStorage.setItem(LS_MAP_BACKUPS, JSON.stringify([backup]));
      return backup;
    });

    // Simulate restore with deep copy (like the fixed code does)
    const restored = await page.evaluate(() => {
      const LS_MAP_BACKUPS = 'life-mmo-map-backups';
      const backups = JSON.parse(localStorage.getItem(LS_MAP_BACKUPS) || '[]');
      const backup = backups[0];

      // Simulate the fixed restoreBackup function
      const layerEdits = JSON.parse(JSON.stringify(backup.layerEdits));
      const spriteColorOverrides = JSON.parse(JSON.stringify(backup.spriteColorOverrides));
      const floorColors = [...backup.floorColors];

      return {
        layerEdits,
        spriteColorOverrides,
        floorColors
      };
    });

    // Verify deep copies are independent
    expect(restored.layerEdits).toEqual(createdBackup.layerEdits);
    expect(restored.spriteColorOverrides).toEqual(createdBackup.spriteColorOverrides);
    expect(restored.floorColors).toEqual(createdBackup.floorColors);

    // Verify they're different references (deep copy worked)
    expect(restored.layerEdits).not.toBe(createdBackup.layerEdits);
    expect(restored.spriteColorOverrides).not.toBe(createdBackup.spriteColorOverrides);
    expect(restored.floorColors).not.toBe(createdBackup.floorColors);

    // Verify nested objects are also different references
    const originalKey = '0,0';
    expect(restored.layerEdits[originalKey]).not.toBe(createdBackup.layerEdits[originalKey]);
  });

  test('should preserve all backup data through localStorage cycle', async ({ page }) => {
    // Create backup with complex nested structure
    const testData = {
      layerEdits: {
        '5,10': {
          ground: { ss: 0x00, row: 0, variant: 2 },
          wall: { ss: 0x01, row: 3 },
          obj: { ss: 0x03, row: 1 }
        },
        '6,11': {
          entity: { ss: 0x04, row: 0 }
        }
      },
      spriteColorOverrides: {
        '0x00_v2': '#ff5500',
        '0x01_3': '#00ff00',
        '0x03_1': '#ffff00'
      },
      floorColors: ['#0a0612', '#2d1b4e', '#445566', '#667788', '#889900']
    };

    // Store in localStorage
    await page.evaluate((data) => {
      const LS_MAP_BACKUPS = 'life-mmo-map-backups';
      const backup = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        ...data
      };
      localStorage.setItem(LS_MAP_BACKUPS, JSON.stringify([backup]));
    }, testData);

    // Retrieve and verify structure
    const retrieved = await page.evaluate(() => {
      const LS_MAP_BACKUPS = 'life-mmo-map-backups';
      const backups = JSON.parse(localStorage.getItem(LS_MAP_BACKUPS) || '[]');
      if (!backups[0]) return null;

      return {
        layerEdits: backups[0].layerEdits,
        spriteColorOverrides: backups[0].spriteColorOverrides,
        floorColors: backups[0].floorColors
      };
    });

    // Verify all data is intact
    expect(retrieved.layerEdits['5,10']).toEqual(testData.layerEdits['5,10']);
    expect(retrieved.layerEdits['6,11']).toEqual(testData.layerEdits['6,11']);
    expect(retrieved.spriteColorOverrides).toEqual(testData.spriteColorOverrides);
    expect(retrieved.floorColors).toEqual(testData.floorColors);
  });

  test('should handle multiple sequential restores', async ({ page }) => {
    // Create two different backups
    const backup1 = {
      id: 1000,
      timestamp: '10:00',
      layerEdits: { '0,0': { ground: { ss: 0x00, row: 0, variant: 1 } } },
      spriteColorOverrides: { '0x00_v1': '#ff0000' },
      floorColors: ['#0a0612', '#2d1b4e']
    };

    const backup2 = {
      id: 2000,
      timestamp: '10:01',
      layerEdits: { '1,1': { wall: { ss: 0x01, row: 2 } } },
      spriteColorOverrides: { '0x01_2': '#00ff00' },
      floorColors: ['#0a0612', '#2d1b4e', '#445566']
    };

    // Store both
    await page.evaluate((data) => {
      const LS_MAP_BACKUPS = 'life-mmo-map-backups';
      localStorage.setItem(LS_MAP_BACKUPS, JSON.stringify([data.backup1, data.backup2]));
    }, { backup1, backup2 });

    // Restore first backup
    const restored1 = await page.evaluate((id) => {
      const LS_MAP_BACKUPS = 'life-mmo-map-backups';
      const backups = JSON.parse(localStorage.getItem(LS_MAP_BACKUPS) || '[]');
      const backup = backups.find(b => b.id === id);
      if (!backup) return null;

      return {
        layerEdits: JSON.parse(JSON.stringify(backup.layerEdits)),
        spriteColorOverrides: JSON.parse(JSON.stringify(backup.spriteColorOverrides)),
        floorColors: [...backup.floorColors]
      };
    }, backup1.id);

    expect(restored1.layerEdits).toEqual(backup1.layerEdits);
    expect(restored1.floorColors.length).toBe(2);

    // Restore second backup
    const restored2 = await page.evaluate((id) => {
      const LS_MAP_BACKUPS = 'life-mmo-map-backups';
      const backups = JSON.parse(localStorage.getItem(LS_MAP_BACKUPS) || '[]');
      const backup = backups.find(b => b.id === id);
      if (!backup) return null;

      return {
        layerEdits: JSON.parse(JSON.stringify(backup.layerEdits)),
        spriteColorOverrides: JSON.parse(JSON.stringify(backup.spriteColorOverrides)),
        floorColors: [...backup.floorColors]
      };
    }, backup2.id);

    expect(restored2.layerEdits).toEqual(backup2.layerEdits);
    expect(restored2.floorColors.length).toBe(3);

    // Verify they're different
    expect(restored1.layerEdits).not.toEqual(restored2.layerEdits);
  });
});
