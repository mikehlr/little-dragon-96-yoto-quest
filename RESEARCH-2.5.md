# Little Dragon 96 — encounter direction and spatial composition, 2.5

## Primary research and design conclusions

Tribute narrative designer Yannick Belzil describes small, quick waves and enemies occupied in the scenery as ways to vary encounters. This directly informed the working-character vignettes and staggered arrivals here. [Developer deep dive](https://www.gamedeveloper.com/design/deep-dive-how-tmnt-s-shredder-s-revenge-was-built-from-nostalgia-and-new-ideas).

Valve’s Michael Booth separates pacing from difficulty: the director changes the timing of population peaks and recovery, rather than simply changing their amplitude. This implementation uses that principle for gaps between small cohorts; selected difficulty still controls enemy health, damage and attack timings. It is an authored brawler system, not a reproduction of Valve’s director. [Valve presentation, especially pages 78–91](https://cdn.cloudflare.steamstatic.com/apps/valve/2009/ai_systems_of_l4d_mike_booth.pdf).

Dotemu’s official balance notes include clearer enemy attack preparation, reinforcement fixes and environmental tuning. These support checking arrival safety and actual combat readability rather than treating additional enemy count as variety. [Official Streets of Rage 4 balance notes](https://www.dotemu.com/streets-of-rage-4-new-balancing-patch-now-available/).

The GDC pacing workshop discusses combat fatigue, varied choreography and recorded playtesting. That informed shorter nonmodal cues and production-time review. [GDC workshop](https://media.gdcvault.com/gdcchina14/presentations/833762_JoelBurgess_MattScott_LeePerry_3_Pacing_EN.pdf).

The particular timings, recovery pickup, concurrency budget and scene matrix below are our design decisions, not claims made by those sources.

## Five actual arrival methods in every world

| World | Building | Interrupted work | Overhead descent | Concealed arrival | Moving transport |
|---|---|---|---|---|---|
| Athens | Workshop shutter | Mushroom sweeps, notices heroes, drops broom | Street scaffold and rope | Blue tool chest | Open delivery van |
| Harbor | Warehouse shutter | Pirate abandons mopping | Quayside gantry and rope | Shipping barrel | Covered dock wagon |
| Forest | Stone gate | Dragon stops watering mushrooms | Rooted tree arch and vine | Hollow stump | Self-moving leaf wagon |
| Ruins | Ancient gate | Golem stops polishing stone | Stone arch and rope | Lidded urn | Rune-powered stone wagon |
| Castle | Castle gate | Witch closes and drops spellbook | Draped arch and rope | Library chest | Magical library carriage |

Building entries recur at district boundaries. Other methods alternate across fourteen ordinary encounters; section 7 keeps its rival and section 15 its three-phase boss. These are separate runtime state machines, not caption variants on the same edge spawn. The work actor exists before the battle and transfers into the enemy list with one render owner. Its tool transfers from held artwork to one separate falling prop. A cover lid opens before its occupant steps forward. Transport arrives, exposes a passenger through its registered cargo opening, lets them step down, then departs.

## Flow and fairness

Ordinary formations release at most two enemies per cohort. Queued cohorts remain counted for victory but cannot render, attack or take damage before release. A cleared cohort gives a short gap; low health extends it, and respawning prevents the next cohort from arriving during the drop. A nearly defeated last enemy can overlap the next cohort after a longer fight, avoiding a slow cleanup tail. A single recovery pickup is available when a cohort clears with critically low team health. Attack concurrency is limited separately from total population; active tells and boss moves are never cancelled. Difficulty health and damage remain unchanged.

## Furniture and perspective

Replaced the old squashed bench and planter presentations with an eight-item transparent furniture atlas. Each image uses its native cell aspect ratio and calibrated support anchor. Athens uses weathered blue-iron benches and olive pots; the harbor uses timber seating and herb boxes; the forest uses rooted log seats; ruins use supported marble benches; the castle uses oak seating and stone planters. Curated rest pockets group a seat with a suitable lamp or vegetation. Market supplies sit beside stalls. Solid decorations leave the main fighting lane clear. Items share the actor depth sort, so a character can pass behind or in front of a seat without a rectangular background overlay. The existing floor detail, lamp light, spring water and forest glows remain active.

## Reproducible review

Open motion-review.html without starting a campaign. New categories show all 25 world/method combinations and five spatial layouts using the production renderer. Runtime source cameras stay fixed per character atlas. Full-resolution masters and exact ImageGen prompts, including corrective transparency/layout edits, are recorded in director-provenance.json; only used WebP assets ship in the runtime package.

Automated campaign traversal applies diagnostic damage after legal arrivals. It proves progression and all boss phases, not subjective full-campaign balance or a human playthrough. Mobile checks use Chrome/WebKit emulation, not a physical iPhone. See qa-results.json for current reports and runtime hashes.
