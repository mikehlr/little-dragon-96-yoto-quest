# Little Dragon 96 · Living Worlds 2.9

Play: https://mikehlr.github.io/little-dragon-96-yoto-quest/?v=2.9

Bosses now receive three phase-linked reinforcement waves with regional enemies, physical side entrances, difficulty/co-op scaling and a visible retreat when their leader falls. The first region progresses through morning, noon, afternoon, sunset and full night. Grounded streetlamps restore warm local light to the street and passing fighters while unlit areas darken. The forest has moving mist behind trees and low drifting fog across the path. Fog and calm-motion preferences remain available.

The production Review Studio now includes all five day states and the forest fog. See [2.9 implementation and checks](RELEASE-2.9.md), [production review](motion-review.html) and [scoped QA](qa-results.json). Greek, English and Ukrainian, six stages, Story/Practice and one/two players remain.

Previous release notes follow.

# Little Dragon 96 · Arcade Brawler 2.8

Play: https://mikehlr.github.io/little-dragon-96-yoto-quest/?v=2.8

Six regions built around fighting again: eleven ordinary encounters, a rival and a boss in each region, with automatic breathers and individual end scenes. All mandatory puzzles and errands are removed. Twenty new enemies have distinct approach/attack/counter profiles and child-friendly attack pacing. Jump attacks work with a held club; other carried objects can be thrown in the air.

Three optional shops offer health, energy and a fresh club for collected coins. Themed supply pockets replace scattered objects. Region-specific people and wildlife react to nearby action. Facades are grounded against the actual floor; all six extra parallax layers remain.

Greek is default; English and Ukrainian cover menus, story, shop and combat hints. Story/Practice, one/two players, unique hero selection and three difficulties remain. See [2.8 implementation and checks](RELEASE-2.8.md), [production review](motion-review.html) and [scoped QA](qa-results.json). Serve the directory as static files; GitHub Pages publishes main.

Previous release notes follow.
# Little Dragon 96 · Six Connected Chapters 2.7

Play: https://mikehlr.github.io/little-dragon-96-yoto-quest/?v=2.7

Six story-connected stages, forty enemy identities, an additional grounded parallax layer in every region, distinct regional entrances and transport, varied contextual objectives and six individual end cutscenes. The new Frozen Pass comes between the Ruins and Castle. Story and Practice retain one/two players, unique hero selection, three difficulties and Greek/English/Ukrainian throughout.

Use the four arcade actions: attack (hold for charged special), jump (attack in air for kick), guard/dodge and context. Context handles mission interaction, pickup and throw. Optional shoulders or the mobile analog stick's outer range run. New content adds no extra mandatory action buttons.

The extra art pack is streamed one region at a time. Serve this directory as static files; GitHub Pages publishes main. See [implementation and testing](RESEARCH-2.7.md), [new asset provenance](campaign-provenance.json), [production review](motion-review.html) and [scoped QA](qa-results.json).

Previous release notes follow.
# Little Dragon 96 · Story & Practice 2.6

Play at https://mikehlr.github.io/little-dragon-96-yoto-quest/?v=2.6

Choose Story Mode or Practice before choosing one/two players, characters and difficulty. Practice offers all five stages, a full-stage fresh replay, and stage selection from pause/completion without advancing the campaign. Both heroes use eight distance-driven carried-walk poses, with a single authored club owner and prop support behind their actual palms.

Story intros, progression and final ending remain intact. Mobile menus were checked with Chrome and WebKit emulation; no physical-device certification. See carry-provenance.json for native ImageGen prompts and sources, and qa-results.json for scoped current checks and runtime hashes.


Play at https://mikehlr.github.io/little-dragon-96-yoto-quest/?v=2.5

Five authored enemy arrival methods in every world, working enemies who visibly react, staggered cohorts and recovery beats. New furniture keeps native proportions and is composed into appropriate street, dock, forest, ruin and castle pockets. Greek is the default; English and Ukrainian remain available throughout.

See [2.5 research and implementation](RESEARCH-2.5.md), [asset provenance](director-provenance.json), [production review](motion-review.html) and [verification](qa-results.json).


Play: https://mikehlr.github.io/little-dragon-96-yoto-quest/

A buildless, one- or two-player illustrated action adventure through five worlds.
Serve this directory as static files; GitHub Pages publishes `main` directly.
The original single-file release remains recoverable in Git history.

## Arcade Action · 2.4

- Jump then press attack for an air kick, with eight new authored frames per
  hero. Gravity, movement and landing remain continuous; each target is hit once.
- Co-op players choose different heroes. The selected P1 hero is visibly locked
  for P2 and rejected by the selection handler.
- Large graphic command plaques cover home, settings, guide, challenge, pause,
  stage, retry and clear screens. All retain keyboard and controller operation.
- A new iPhone Home Screen icon and standalone manifest. The game surface owns
  touch gestures; analog reversal changes facing instantly, without squeezing
  the character through intermediate horizontal scales.
- Greek / English / Ukrainian throughout menus, cutscenes, NPC speech, HUD,
  move names and item notices. Greek is default and the selected language is
  remembered. The globe button opens the language panel; it is also in settings.
- [Motion Review](motion-review.html) includes both new aerial clips.
  [Implementation references](RESEARCH-2.4.md) explain the input/icon/localization
  decisions and test limits; `arcade24-provenance.json` records the new art.

## Family Arcade · 2.3

- Three lives per player, a protected drop-in respawn and a single landing shock
  that hits nearby enemies. Co-op continues while one player has attempts left.
- Visible health gems, food, maximum-health hearts and extra-life charms.
  Upgrades persist between stages; a checkpoint retry restores three lives.
- Four face buttons: **X attack, A jump, B guard, Y context**. Hold X for a
  ready special; direction + B dodges. Optional LB/RB run. Giorgos has a golden
  dragon wave; Thodoris has a spinning wind kick. Both use independent energy
  and cooldowns. Running uses new eight-pose artwork for each hero.
- Keyboard P1: arrows, J attack/hold special, Space jump, K guard, U context,
  left Shift run. P2: WASD, F attack, T jump, G guard, E context, right Shift run.
- Mobile: four large action discs and a floating analog stick. Drag beyond the
  stick ring to run; multitouch supports moving and acting together. Pause,
  cancellation and rotation release held actions.
- Framed animated intro/outro, progressively revealed text and reading time
  after completion. A/Enter/touch reveals first, advances second; Start skips.
- Six new pedestrian identities, eight scheduled walkers in every stage,
  local vendors, connected street-lamp artwork and better facade registration.
- Local hit flashes, finishing bursts, guard sparks, material debris, dust,
  landing rings and special trails. Calm mode reduces the effect intensity.
- Independent [Motion Review](motion-review.html) includes heroes, all six new
  NPC identities, rewards and impact effects using the production renderer.
  See [design references](RESEARCH-2.3.md), `family-provenance.json` and
  `qa-results.json` for source prompts and verification scope.

## Living Arcade · 2.2

- Cinematics now use 10–12 coherent authored neighboring poses per scene,
  with registered source rows, stable anatomical scale and direct opaque drawing.
  Two compressed poses were rejected from the first scene. No whole-body fades
  are used to hide pose changes. Timed reading, tap/A/Enter and Start skip remain.
- Encounters lock the camera. Each player can use the full visible width,
  without the previous 322-unit co-op tether or an interior glowing barrier.
  Forward-only window scrolling resumes when the fight clears.
- Twelve enemy identities now have eight distance-driven walk frames plus
  distinct anticipation, strike, recovery, hurt and fall artwork.
- Fifteen new floor variations, sixteen ground-detail silhouettes, bonus barrels,
  energy flasks, coins and occasional escaping golden beetles enrich the routes.
- Garages roll their shutters upwards; stone gates swing a connected door in
  perspective. Enemies wait for clearance and cross the actual threshold into
  the street before fighting. Doors close after passage.
- Fruit, fish, potion and book stalls have animated vendors, local conversations,
  short nonmodal greetings and evolving chapter clues. Talk with the contextual
  pickup button (U / E / Y, or ΜΙΛΑ on touch). Optional gifts commit once after
  the offering action. Props occupy different walking depths, with local
  footprints and room to go around. Pedestrians yield with a dedicated idle.
- [Motion Review](motion-review.html) independently seeks the production story,
  enemy, floor, door, vendor and pedestrian renderers. See [research](RESEARCH-2.2.md)
  for the arcade camera and staging sources used in this update.

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
`art-provenance.json`, `expansion-provenance.json`, `motion-provenance.json` and
`town-provenance.json`, `family-provenance.json` and `arcade24-provenance.json`. Shadows and effects are 2D/2.5D approximations.
The game rules, five worlds, enemies, boss phases, co-op, pickups and story beats
are preserved. Automated checks cover menus, both players, combat, pickup/throw,
all five boss renderers, graphics options, touch magnitude and input release.
