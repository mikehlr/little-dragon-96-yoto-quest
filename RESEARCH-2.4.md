# Arcade Action 2.4

This revision adds an authored eight-pose air-kick clip for each hero. Jump and then press the existing attack button: it uses jump gravity and movement, with a separate active strike window and a per-enemy hit set. One kick is allowed per jump. Landing clears the aerial action. The source camera stays fixed; airborne poses are never individually resized to equal body height.

Character selection excludes P1's hero from P2, both in the visible roster and in the action handler. Starting co-op also repairs stale duplicate selections. The actual player identity remains independent of its controller seat.

The menu treatment uses a four-state ImageGen command-plaque atlas, runtime labels and SVG control symbols. Buttons retain focus, accessible names and controller navigation; there are no native form controls in the game menus. Settings use large command tiles rather than thin website rows. The inspector remains a separate developer tool.

## iPhone surface and icon

- [Apple: Configuring Web Applications](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html) documents the Apple touch icon and standalone metadata.
- [WebKit: Features in Safari 26.0](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/) describes modern Home Screen web-app behavior.
- [W3C Pointer Events](https://www.w3.org/TR/pointerevents/) defines how `touch-action` controls native gestures. `manipulation` still permits pinch zoom; the active game surface therefore uses `none`, with explicit prevention of Safari game gestures and touch movement.

A new opaque icon master is delivered as 180px Apple touch icon, 192px and 512px manifest icons, and 32px favicon. No service worker was added, so the new release does not introduce a stale offline asset cache. The manifest supports standalone launch and either orientation. The language-specific manifests preserve the initial selected locale when a separate installed web-app storage context is used.

Facing is a discrete -1/+1 state, separate from analog movement magnitude. Stick reversal sets it immediately, and the renderer also rejects intermediate fractional facing scales. Analog movement itself remains proportional.

## Languages

Greek is the default; English and Ukrainian are available through a graphic language selector and settings. The choice persists. Canonical narrative state stays Greek, while a complete authored translation bank localizes DOM text, accessibility labels, canvas HUD/attack captions and NPC dialogue. Cutscene text is translated before its typewriter reveal; NPC speech is translated before line wrapping. Switching language does not reset campaign progress.

The language audit checks all menu states, all five story panels, all world/boss move captions, NPC lines, chapter reveals and pickup notices. It rejects remaining Greek text in English/Ukrainian presentation, excluding the language picker's intentional native language names. Proper product/game titles and controller button symbols remain unchanged.

Testing uses Chrome, emulated multitouch and Playwright WebKit 26.5 with iPhone layouts. This is engine/emulation QA, not a physical iPhone Home Screen installation. Native pinch was exercised in Chrome; Safari-specific cancelable gesture prevention and repeated real taps were exercised in WebKit.

Exact ImageGen prompts, source dimensions and delivery hashes are in `arcade24-provenance.json`. `qa-results.json` binds current checks to the packaged runtime.
