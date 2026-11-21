# Held actions, arcade cues and continuous sound 2.16

## Held-object motion

Both heroes now use authored anticipation, contact and recovery poses for grounded club strikes, takeoff, tucked flight, landing, airborne club strikes and grounded/airborne throws. Two 4x6 sheets and one 4x4 sheet add 64 native drawings. Each action family uses a fixed source camera; no per-frame fitting, body opacity blend or head zoom is used. The existing 2.15 held-walk bridges remain in place.

Ground club contact still deals damage during the original 160–250 ms window. Air club contact/use count, jump force, input timing and landing lock are unchanged. Loaded throw extension is drawn before the original 105 ms release. The actual projectile is registered to the displayed palm, including world elevation. Throwing a club uses a single separate prop in the hand, then carries the same grip/orientation into mirrored flight around its true center. Broken clubs use empty-handed recovery instead of drawing a phantom weapon.

Carried crates, jars, powder barrels, bonus barrels, chests and urns use their existing native renderers behind the actual source fingers. Landing returns through dedicated loaded settle drawings. Draw-only previews rebuild the same production action/physics timeline; new Review Studio choices expose both heroes with club or load.

A cut club tip in the first generated source crossed into a neighboring frame. The asset was repaired with ImageGen; a support gate rejects the original crop/contamination and accepts the repaired runtime file. Final prompts, repairs and saved paths are recorded in carry-action-provenance.json. PNG masters/rejected versions are not shipped.

## Arcade announcements

Area-clear / GO, fight introductions, combo counts, boss opportunities, reinforcement warnings and pickup/reward notices now use graphic beveled lettering, outlined metallic text, dark cut-corner panels and restrained moving chevrons/stripes. Text stays native and is laid out for Greek, English and Ukrainian. Calm mode keeps these treatments static. The coin counter is placed below the combo line so the two displays no longer overlap. The underlying combat view remains unobstructed.

## Sound continuity

Impacts no longer duck the continuous ambience bus (the previous duck reduced it to 24%). Music is summed separately from the dedicated effects compressor so transients cannot reduce the score through shared compression. The mix retains output headroom. A 25 ms Web Audio scheduler with a 300 ms music horizon continues independently of render hit stop. The audio factory applies saved music/effects volumes immediately, including activation through original DOM listeners that retain their old unlock callback.

Audio validation deliberately stress-drives the legacy/current graphs with repeated effects at four times the default effects gain. The current graph preserves linear music superposition within floating-point tolerance and stays below clipping in that stress fixture. Live Chrome checks preserve the same music transport, gain and ambience target through impacts and a temporarily stopped RAF loop; music/effects mute settings are checked with an active signal probe. These scoped checks do not claim an auditory comparison on physical phone hardware. Windows Playwright WebKit lacks Web Audio; its silent fallback/rendering is exercised separately.

## Damage

Easy remains at 0.60x incoming damage. Normal is now 2.10x (from 1.45x), Hard 3.25x (from 2.10x). A base-12 unblocked hit therefore removes 7 / 25 / 39 HP, once through the normal damage pipeline. Perfect blocks, dodge and invulnerability remain effective. Other HP, enemy count, recovery and timing rules retain the accepted balance, avoiding extra enemy HP inflation.

## Checks and limits

Chrome/WebKit cover 120 hero/object/facing/action combinations per browser, 20 exact hit/use/release cases per browser, composed action captures and localized clear banners. Separate production HUD checks capture six cue types in all three languages and verify static Calm versus active motion. The independent Review Studio covers ground/air contact and landing samples, normal-speed unblinking recordings and separate co-op state. Existing six-region layout, tactical enemy signatures, aerial-held combat and static asset/JavaScript regressions pass. Audio and asset safety have their own positive/negative gates.

The normal-time clips and source/composed captures were visually inspected for foot contact, object grip, head/camera consistency and frame cropping. These are scoped automated diagnostics and short preview sequences, not a complete human difficulty playthrough or physical controller/mobile certification. Baseline 2.15 retains the previously validated campaign progression and walking transitions.
