# Arcade motion and environment research

Primary sources consulted for this update:

- [Itay Keren: Scroll Back — camera design](https://icewyrmgames.github.io/research/scroll-back-the-theory-and-practice-of-cameras-in-side-scrollers/). The designer describes one-sided camera windows and edge snapping. Applied here as forward-only travel, a fixed encounter camera and movement across the full screen, with both co-op seats retained.
- [Ayano Koshiro: Streets of Rage 2 developer interview](https://shmuplations.com/streetsofrage2/). The art director describes enemy concepts starting with movement, attack flow influenced by Street Fighter II, and varied stages with visual stories. Applied here as explicit windup/strike/recovery frames, distinct enemy gait cycles and place-specific ground dressing and bonus breakables.
- [Ancient production design documents, reproduced at Game Anim](https://www.gameanim.com/2020/04/21/streets-of-rage-2-art-and-design-docs/). Used to study move staging and startup/story flow, not as imported game artwork.

The requested cinematic style is an influence. All new raster assets are generated for this game; no commercial arcade sprite sheets or music are included. Ten to twelve selected authored adjacent poses per cinematic replace four coarse poses. Two compressed first-scene poses were rejected, and nonuniform source rows are registered without changing anatomical scale. Playback uses the authored cells directly, without whole-body opacity crossfades. Eight walking frames per upgraded foe are driven by actual distance; pose height never resizes the head. Fifteen new floor variations and sixteen ground-detail silhouettes break long stretches into local visual landmarks.

`motion-review.html` uses the production renderer for independent seeking and normal-speed review. `motion-provenance.json` records native source dimensions, prompts and fixed source-camera registration. Runtime physics, original boss phases, difficulty selection, controller seats and narrative order are retained.
