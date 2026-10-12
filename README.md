# THE SECOND KEY — 1990
### A playable first-person illustrated psychological horror game for GitHub Pages

**He already has a way in.**

This is a self-contained, client-side HTML/CSS/JavaScript game following the supplied *The Second Key — Game Bible*. Its original, procedural SVG illustrations were made specifically for this build. **None of the user's reference screenshots are used as assets.** Nathaniel Cross is a detailed 2D illustrated figure, not a pixel-art or 3D model; Evelyn Price is seen from first person. No on-screen hands appear.

## Get it running

**GitHub Pages:**

1. Create a public GitHub repository (or use an existing game repository).
2. Upload the **contents** of this package to the repository root: `index.html`, `styles.css`, `game.js`, `assets/`, etc. Be sure `assets/` keeps its subfolders and filenames.
3. Commit to the default branch, typically `main`.
4. Open your repository's **Settings → Pages → Build and deployment → Deploy from a branch**.
5. Select `main` and `/ (root)`, and save. After publishing, open the Pages URL GitHub gives you.
6. Press **NEW GAME** on the title screen.

The game uses no external game engine, API keys, database, server, or build step. Fonts have Georgia fallbacks if the optional Google Fonts font request is unavailable. Sound, save data, and gameplay code all run in the browser. The bundled local `.ogg` voice clips do not require internet access.

**Local preview:** Opening `index.html` in a desktop browser may work; for more predictable loading, use a local server such as `python -m http.server 8000` from the extracted folder, then visit `http://localhost:8000/`. (For public hosting, use GitHub Pages.)

## Controls

| Action | Desktop | Phone / tablet |
| --- | --- | --- |
| Freely look 360° horizontally, up/down | Drag scene with mouse | Drag scene with finger |
| Walk forward / backward / strafe | W A S D | On-screen movement arrows |
| Run (noisier) | Hold Shift while walking | Use quick route choices to escape |
| Turn without dragging | Q / right-arrow and left-arrow | Drag anywhere on scene |
| Interact with an object | Click visible world markers or press E while looking at one | Tap world markers, **INTERACT**, or story choice |
| Switch flashlight | F or click inventory item | Tap FLASHLIGHT |
| Equip camera | C, or inventory slot | Tap CAMERA |
| Shoot a 35mm photograph | Space in camera mode, **TAKE PHOTO**, or choice | **TAKE PHOTO** or choice |
| Take a 360° photo | Choose **Capture a 360° panoramic photograph** in camera mode | Same |
| Hide / come out | H, or contextual choice | Contextual **HIDE** choice |
| Floor plan | Tab or MAP | MAP |
| Evidence/photos journal | J or JOURNAL | JOURNAL |
| Pause and settings | Escape or PAUSE | PAUSE |

**Photo roll:** Evelyn begins with six exposures, camera located in her bedroom. A normal shot uses one exposure; an explorable 360° panorama costs two. Open **JOURNAL → VIEW INTERACTIVE 360° PANORAMA** to rotate the recorded room panorama. Photographs can catch Nathaniel in-frame, generating useful evidence. These are illustrated in-game photo records, not full-resolution screenshots of the DOM.

## Gameplay systems

- Twelve original 360° wraparound illustrated panoramic areas: living room, foyer, kitchen, dining room, upstairs hall, Evelyn's bedroom, parents' bedroom, bathroom, basement, garage, back yard, and front porch.
- Freely rotating first-person camera with smooth WASD movement **within each room**, smooth head bob and positional parallax, door/room transitions, and click/tap navigation. This is a **2.5D illustrated panorama engine**, not a polygonal 3D simulation; movements create a first-person sense of exploration but do not rebuild room perspective as full 3D geometry.
- Nathaniel moves across a **connected house-room graph** through explicit entrances instead of teleporting. Each difficulty changes walking/chase speed, detection distance, and the likelihood he successfully searches a hiding place.
- Investigations: muddy prints, copied-key evidence, a stolen photograph, appliance repair receipts, answering machine messages, voice cassette, and more. The first family key vs. unauthorized duplicate is the central mystery.
- Dynamic objectives, contextual choices, active world markers, branching phone calls, local sound/noise detection, hide-and-search events, 1990 household ambiance, storm and power failure, jump-scare with configurable shake/flashes, game-over and checkpoint pages.
- Seven included offline, synthetic, character-specific voice recordings plus procedural rain, phone, camera, thunder, footsteps, hum, and jump-scare layers. You may turn the voice clips off under Settings; browser speech synthesis may be used for other spoken lines.
- Saved progress/checkpoints/settings and discovered endings use browser `localStorage`. They are per-browser/device, not cloud synced.

### Difficulty

| EASY | NORMAL | NIGHTMARE |
| --- | --- | --- |
| Slower Nathaniel, shorter detection range, safer hides | Moderate pursuit/searching | Faster Nathaniel, greater detection range, riskier hides |

You may also toggle voice lines, jump-scare visuals, flashing, camera shaking, subtitles, and overall audio volume.

## Story & characters

**Friday, October 26, 1990 — Grayswick, Pennsylvania.** Evelyn Price, 23, works at Redbird Video and dreams of becoming a photographer. Her parents are away, and she is home alone when a telephone call arrives at 10:47 PM. Nathaniel Cross, 28, previously worked on the house's electrical panel and quietly copied its spare key. To Evelyn, he was a customer she'd helped after a minor injury. To Nathaniel, that single kindness became a fabricated relationship. He now calls it love; he has already crossed into the house without permission.

Supporting characters: best friend April Serrano, mother Gloria Price (answering machine), and Deputy Daniel Ortiz (emergency contact). The story intentionally focuses only on Evelyn, Nathaniel, and this established supporting cast.

## Endings (spoilers)

1. **No More Keys** — Secret best ending: photographic proof, repair/key evidence, detailed police identification.
2. **Blue Lights** — Survive until help arrives; Nathaniel escapes.
3. **The Neighbor's Porch** — Reach the neighbor in the rain.
4. **The Back Gate** — Escape by the fence and the road.
5. **One Last Message** — Send substantial evidence, then be caught.
6. **Dinner for Two** — Voluntarily surrender during a close confrontation.
7. **You Let Him In** — Open the back door to Nathaniel.
8. **The Hollow Ring** — Be caught without forwarding sufficient evidence.

The game saves discoveries in the ENDINGS archive and provides retry/checkpoint/menu controls on game-over screens. Outcomes depend on choices, evidence, who you contact, your route and proximity to the stalker.

## File layout

```
index.html           Main menu + complete game UI
styles.css           Visual novel interface, cinematic effects, mobile responsiveness
game.js              Story engine, movement, 360° camera, stalker AI, endings, audio, save data
assets/*.svg         All-original environment panoramas, cover art, Nathaniel's 2D sprites
assets/audio/*.ogg   Original offline synthetic character voice lines
build_art.py         Optional original SVG art source/regenerator (Python standard library)
build_audio.sh       Optional voice re-generator (requires espeak and ffmpeg)
tests/               Browser smoke/branch QA scripts and preview captures (not needed to play)
.nojekyll            Prevent GitHub Pages processing of static game assets
```

### Limitations and practical notes

This is a substantial playable **illustrated web-game edition**, not a photorealistic AAA engine. The 360° feature is panorama rotation plus position-based navigation, not real-time 3D depth reconstruction; animated character drawings remain 2D. Audio clips are original synthetic placeholders, not human voice performances. Browser security does not allow **EXIT** to close tabs that were not opened by the game, so its menu explains how to exit. All eight stories have branching outcomes, but they are compact and can be further expanded with new rooms, artwork, scenes and more advanced AI.

## QA

Browser tests are under `tests/smoke.py`, `tests/branches.py`, and `tests/endings.py` (they require Playwright + Chromium). The tests exercised game opening, controls/inventory, chapter progression, evidence, camera/360 photo viewer, modal screens, room-to-room NPC routing, all eight ending outcomes, and a mobile viewport without uncaught script errors. The ending test uses a fake test-browser storage origin; the deployed game uses the browser's native localStorage. These tests do not establish that every device/browser/choice combination is bug-free.

**Designed as an original game experience; source images are not copied from reference screenshots.**
