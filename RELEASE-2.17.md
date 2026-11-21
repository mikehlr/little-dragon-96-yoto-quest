# 2.17 · Cards, keepsakes and regional bonus rounds

Coins now belong to a persistent shared wallet. Spend them at the existing regional shops for supplies or buy 24 illustrated souvenirs (four per region, costing 6/10/14/18 coins). Each souvenir is purchased once and appears in My Collection. The menu catalogue also sells souvenirs from regions already visited; supplies require an actual shop encounter. Visiting a region in Story or Practice unlocks its catalogue.

Each region contains three marked Yoto caches holding 18 distinct illustrated story cards across the campaign. Walk over a dropped card to collect it without dropping a held weapon. Each card gives 600 score and 25 energy. Every three collected cards grant the living team 20 health, 35 energy and two coins. Completing a regional card set unlocks that region's music in the collection player. The charge continues between stages and resets on a new run.

The wallet, visited regions and owned cards/souvenirs survive browser reloads and new runs in local browser storage. They are shared by both players on that browser/device, not synchronized between devices. Clearing site data removes this profile. Review Studio does not write collection progress.

Stages two through six each have a short bonus round at the middle rest stop: harbor water blaster; forest rolling logs/fireflies; ruins falling stones/crystals; frost wind/lanterns; castle clockwork scooter couriers. Existing movement, attack, jump and guard controls apply. Bonus mistakes reduce bonus points rather than health/lives, rewards are capped at 14 coins, and Pause can skip a bonus. Original held gear returns after the water round. Entrants use visible edges/warnings; remaining vehicles finish their exit before the round closes.

New galleries, story details, shop displays and controls support Greek, English and Ukrainian, keyboard, standard gamepad and mobile touch. Generated artwork is documented in collection-provenance.json; explicit atlas rectangles and SVG clipping prevent adjacent cards or partial scooter wheels leaking into a frame.

## Preserved RTM

The exact shipped 2.16 runtime was copied and hash-verified before development at C:/Codex/adventure-skill/RTM/little-dragon-96-yoto-quest-2.16. Git tag rtm-2.16 points to dee994f94e7a8509c36084792a20a72420aa2630. The original 2.16 release ZIP remains separate. The RTM folder is not a dependency of this release.

## Validation scope

See qa-results.json for the actual reports. Tests cover persistent purchases/cards, responsive gallery layouts, keyboard and virtual gamepad navigation, a pixel-based known-bad sprite-clipping canary, five bonus types across difficulties and player counts, resumed stage flow, existing combat/campaign regressions, and the collection music scheduler. Normal-time captures use the production renderer. Automated fixtures are not a human campaign/difficulty playtest, and emulated mobile browsers are not certification of physical iPhone/controller hardware.
