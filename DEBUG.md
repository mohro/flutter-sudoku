# ⚠️ DEBUG MODE ACTIVE

The application is currently running in **DEBUG MODE**.
Every new game will start with the puzzle **almost fully solved** (only ~3 empty cells) to allow for rapid testing of the Win State and end-game logic.

## How to Disable
To restore normal gameplay, edit `src/store/gameStore.ts`:
1. Locate the `startGame` action.
2. Remove or comment out the `if (true) { ... }` block that overrides the `puzzle` variable.

```typescript
// REMOVE THIS BLOCK
if (true) {
    const solArr = solution.split('');
    // Hide 3 random cells
    for(let i=0; i<3; i++) {
        const idx = Math.floor(Math.random() * 81);
        solArr[idx] = '-';
    }
    puzzle = solArr.join('');
}
```
