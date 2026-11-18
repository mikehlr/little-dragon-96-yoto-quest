# Little Dragon ’96 · Yoto Quest — HD Edition

Play: https://mikehlr.github.io/little-dragon-96-yoto-quest/

A buildless, one- or two-player illustrated action adventure through five worlds.
Serve this directory as static files; GitHub Pages publishes `main` directly.
The original single-file release remains recoverable in Git history.

## Arcade expansion · 2.1

- Choose Giorgos or Thodoris in single player. In co-op, each seat chooses
  independently, with large portraits, outlined focus and a confirmation flash.
  Hero appearance and HUD follow the choice; keyboard/controller seats stay fixed.
- Easy / Normal / Hard are selected before the story. Normal retains the original
  balance. Difficulty persists across stage transitions and checkpoint retries.
- Eight extra storybook foes use distinct telegraphed spells, charges, leaps,
  rings and projectiles. Their defeat counts normally toward clearing encounters.
- More roadside dressing, carryable/breakable chests and urns, one-time chest
  rewards, animated fountains, torch flames, local light, birds and fireflies.
- The title features both heroes. Five layered comic scenes use authored pose
  changes, comic timing and sound. Scenes advance automatically, with no Continue
  buttons. A/×, Enter or a tap advances; Start skips the opening story.
- Native text selection, image dragging and mobile long-press menus are disabled
  on the game surface. Rotation immediately recomputes the viewport and resets
  touch input, without layout transitions.

## HD presentation

- A 1920×1080 drawing buffer, with optional 1440×810 and 960×540 settings.
- New high-resolution scenic paintings, independent clean distant plates and
  transparent near silhouettes for all five worlds, and new material floors.
- Regenerated hero, carrying, enemy and boss atlases, with one fixed camera
  calibration per sheet. Physics and hit detection retain their original units.
- Separate clouds, distant scenery, near scenery, world floor, foreground and
  atmosphere planes. Lighting follows the actual lamps/torches in each painting.
- Individually saved lighting, atmosphere, grain, parallax and calm preferences.
- Three display treatments: clean HD, real low-resolution Pixel sampling, and
  CRT sampling with scanlines, restrained phosphor texture and edge falloff.
  The HUD, menus and touch controls remain readable above the world filter.

Native image dimensions vary; a Full HD renderer does not make every source
image native 1080p. `art-provenance.json` records prompts, dimensions, hashes and
which generated images are reference masters. Delivery uses WebP at native size.

## Controls

All title, story, stage, pause, guide and settings screens work with a standard
Xbox/PlayStation-compatible controller. D-pad/left stick navigates; A/× confirms;
B/○ returns; LB/RB changes settings tabs; left/right adjusts a selected setting.
Menu/Options pauses or resumes. Keyboard arrows/Enter/Escape also operate menus.

Gameplay: left stick/D-pad moves, X/□ punches, B/○ kicks, A/× jumps, Y/△ fires,
LB/L1 or triggers block, RB/R1 picks up or throws, stick clicks dodge.
Two standard pads can control the two players. One pad can be assigned in Settings.

Keyboard P1: arrows, J/K/L, Space, H/U/I. P2: WASD, F/G/R, T, Y/E/Q.

On touch screens, the left floating stick uses continuous direction and magnitude,
with a radial dead zone. The right thumb controls attack, jump, guard, energy and
dodge. Holding attack alternates punches and kicks in a combo. Pickup/throw/help
appears only when relevant. Controls support simultaneous pointers, cancellation,
safe areas, vibration where available, and a left-handed side-swap setting.
Landscape gives the largest playfield; portrait keeps controls below the game.

## Local use

No package installation or build is required. For a local HTTP preview:

```text
python -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000/. Browser controller, audio, vibration and fullscreen
support depends on the device. Graphical/controller/touch QA was performed with
Chrome, emulated mobile multi-touch and virtual standard gamepads; this does not
claim testing on a physical phone or physical controller.

Touch-design references: [Apple: handheld game interfaces](https://developer.apple.com/videos/play/meet-with-apple/243/),
[Apple: simultaneous game gestures](https://developer.apple.com/design/human-interface-guidelines/gestures),
and [Android: natural input across form factors](https://developer.android.com/games/develop/multiplatform/enable-natural-input-on-all-form-factors).

## Artwork and verification

New raster artwork uses built-in ImageGen, with the exact prompt set in
`art-provenance.json` and `expansion-provenance.json`. Shadows and effects are 2D/2.5D approximations.
The game rules, five worlds, enemies, boss phases, co-op, pickups and story beats
are preserved. Automated checks cover menus, both players, combat, pickup/throw,
all five boss renderers, graphics options, touch magnitude and input release.
