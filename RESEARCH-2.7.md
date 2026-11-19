# Six connected chapters · 2.7

The campaign now follows Neighborhood → Harbor → Forest → Ruins → Frozen Pass → Castle. Existing stage identifiers remain stable; the narrative order is explicitly `[0,1,2,3,5,4]`. Practice exposes the same six regions without campaign advancement.

## Pacing and place

The encounter director retains five actual entrances per region: opening door, interrupted work, rope descent, cover reveal and transport disembarkation. Sixteen authored beats per chapter alternate combat with rescue, delivery, defense, escort, pursuit, ordered mechanisms, clues and recovery. Guards, objective participants and carried parcels have individual state and ownership; success depends on the specific objective rather than silently clearing another wave.

| Region | Distinct environment and objective response |
| --- | --- |
| Neighborhood | Repair deliveries and power, rescued residents, street lamps strengthen as the route progresses into evening. |
| Harbor | Net warehouse, inset water berth, moored launch cabin and hinged gangplank; cargo/winch work and tide pressure in the lower lane until the pump is powered. |
| Forest | Rooted hollow-tree entrance, light markers, tending a root patch, wind gusts and a guided forest resident. |
| Ruins | Temple portico, sun/mirror sequence, support tasks, marked falling rubble during exposed objectives. |
| Frozen Pass | New far/near scenery, native floor variants, refuge door, snow bench, mountain worker, crystal ibex rival/boss, warm braziers and icy upper route. |
| Castle | Library arch, living-book sentries and visible watch cones; safer outer lane, guard avoidance, alarm reinforcement and a quieting mechanism. |

There are 40 ordinary enemy identities, including 20 new sixteen-pose native atlases. Eight old and eight new types are interleaved in each region's roster. Selection prioritizes unseen types within a chapter and reserves types inside a newly created group. New attack kits combine readable warning, active and recovery phases with varied ranged, ring, leap, lane and dash behaviors; the new boss preserves three health-gated phases.

## Compositing and animation

Each region has a new transparent transition layer at camera factor 0.84, between existing near scenery and the walkable world. Native aspect is preserved. Curbs, rooted edges, masonry and snow banks connect the floor to architecture instead of exposing an abrupt floor/background join.

Entrance facades and panels use calibrated individual native source rectangles: generated components have different widths and must not be sliced as equal cells. Door strips project around a fixed hinge. The harbor launch uses its own cabin aperture, water contact and a separate native gangplank. Rescue cages have separate back/body and alpha-cut barred front, with one NPC between them; the door opens before the NPC walks from the interior support plane onto the street.

Six separate end scenes use six new backgrounds and six eight-pose actor-group atlases. Fixed source cameras retain group scale, small continuous pans and timed gestures accompany the localized typewriter text, and A/Enter/tap advances while Start/Escape skips. These scenes occupy a framed arcade panel. The final castle scene still leads into the existing home ending. Calm mode reduces ambient motion.

World packs load three images concurrently, retry decode failures, discard canceled results and retain only the current extra region plus shared props. Review Studio streams the selected pack too, including all forty enemy identities, six regions and six end scenes.

## Design references

These extend the sources documented in [2.5](RESEARCH-2.5.md):

- [Tribute Games on Shredder's Revenge](https://www.gamedeveloper.com/design/deep-dive-how-tmnt-s-shredder-s-revenge-was-built-from-nostalgia-and-new-ideas): use scenery and enemy activity to make encounters feel situated.
- [Valve's AI Systems of Left 4 Dead](https://cdn.cloudflare.steamstatic.com/apps/valve/2009/ai_systems_of_l4d_mike_booth.pdf): alternate pressure and recovery instead of keeping intensity flat.
- [Dotemu's Streets of Rage 4 balancing notes](https://www.dotemu.com/streets-of-rage-4-new-balancing-patch-now-available/): preserve readable combat and manageable reinforcement timing.

The chapter objectives, environmental rules and narrative are this game's implementation choices, rather than claims that those games use these exact systems.

## Verification limits

See `qa-results.json` for scoped fresh reports and `runtime-integrity.json` for shipped byte hashes. Campaign diagnostics inject damage only after legal entry; they cover all 576 stage/beat/difficulty/player combinations and 36 three-phase bosses, and are not a human full-campaign playthrough. Objective checks exercise contextual pickup, throw, delivery, rune ordering, guard-blocked rescue, escort proximity, defense participation and story transitions. Browser tests cover Chrome and WebKit emulation, all three languages and mobile portrait/landscape. A physical iPhone and physical gamepad have not been certified. Source and composed visibility checks complement, rather than replace, production visual inspection.
