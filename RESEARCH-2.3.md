# Family Arcade 2.3 — design references and implementation

Primary references consulted:

- [Guard Crush / Lizardcube / Dotemu developer interview, PlayStation Blog](https://blog.playstation.com/archive/2020/04/30/streets-of-rage-4-how-three-studios-revived-the-legendary-beat-em-up-series/feed/): approachable controls, character-specific specials and the tradeoffs between cooldown and health costs.
- [SEGA Streets of Rage 3 manual](https://www.sega.jp/genesismini2/assets/manual/pdf/US_Streets-of-Rage-3.pdf): arcade lives and special-energy conventions.
- [Jan Willem Nijman, Vlambeer: The Art of Screenshake, INDIGO Classes 2013](https://www.youtube.com/watch?v=AJdEqssNZ-U), published by the event organizer Dutch Game Garden: layered action feedback and localized impact cues.

These informed our design decisions; this game does not reproduce another game's control scheme or combat balance. A separate rechargeable meter was chosen over spending health, for younger players. Each player starts with three attempts. Health upgrades cap at 160; life rewards cap at five remaining attempts. Starting a new stage preserves upgrades and remaining lives. Explicit checkpoint retry restores three lives. An exhausted co-op player stays out until retry or a new game.

Four face buttons: X attack, A jump, B guard (direction + press dodges), Y context. Hold attack for 0.72 seconds to use a ready special. Giorgos fires a golden dragon wave; Thodoris performs a radial spinning kick. Each costs 60/100 energy, with a seven-second cooldown and slow passive recovery. Releasing a held attack is required after a successful special. Optional shoulder buttons run. Touch uses the same actions, with an outer joystick ring for running.

Contact stars and rings spawn only after actual damage; missed attacks create no impact. Material-colored splinters and dust accompany broken props. Finishing blows and specials have stronger localized bursts. The existing brief hit pause and sound remain. Calm mode reduces particles and light; no full-screen flash was added. Effects are capped and expire rather than accumulating.

Seven new ImageGen sheets/props are recorded with their complete prompts, native dimensions and hashes in `family-provenance.json`. Run and special clips each contain eight authored poses per hero. NPC sheets have a dedicated idle, eight walking poses and a greeting pose for each identity; actual runtime walking uses distance, not elapsed time. Atlas scale is fixed. Contact anchors were measured on the finished sources, including the lamp's actual pedestal at 99.2% of source height. No per-frame body resizing is used.

Story text reveals at 34 characters/second. The reading timer starts only after the line is fully shown; A/Enter/touch first reveals, then advances. Start still skips the introduction. A narrow or rotated display immediately recomputes its frame and controls.

Verification covers Chrome keyboard, virtual standard gamepads and emulated multitouch. The campaign diagnostic visits all 480 difficulty/player-count/arena combinations and 30 three-phase bosses using injected damage after valid entrance; it is not a manual full-campaign playthrough or a physical-device certification. Current reports are bound to the runtime hashes in `qa-results.json`.
