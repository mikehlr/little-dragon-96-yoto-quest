# Living worlds 2.9

## Boss reinforcement flow

Each final boss has up to three regional support waves, unlocked by its three existing combat phases. A short initial warning, 8/10/12-second hard/normal/easy minimum gap and no overlap between living waves keep the arena readable. Counts are one/two/three on easy/normal/hard, plus one for co-op, capped at three. Supports enter through the physical left/right arena edges with staggered arrival. Boss and ordinary attackers share the existing easy/normal pressure limits; boss starts also check the combined budget. If the boss falls early, unreleased offscreen supports are cancelled; already visible fighters retreat on foot. Low-health players can receive a recovery gem after clearing a wave. No mandatory waiting for all waves to appear before winning.

## First-region time and light

Monotonic time follows route progress or elapsed active chapter time, whichever is further. Route progress guarantees full night by the final fight; standing in the region reaches night in roughly seven active minutes. Smooth transitions cover warm dawn, neutral noon, golden afternoon, sunset and deep blue night. Pause and shops freeze progression. Retry begins at a time appropriate to the resumed section.

Twelve added native streetlamps are anchored to the curb using the existing full-pole asset. Their bulb coordinates, warm pools and soft cones move in the same world plane. Background fixtures retain their own parallax registration. A native-resolution compositing mask restores scene color locally, including passing actors. Unlit areas remain dark; fighters retain a restrained readability fill. Attack telegraphs and emissive hazards are drawn above the night grade, with HUD outside the grade. Sun shafts fade before night. No per-frame CPU pixel readback is used by the effect.

## Forest atmosphere

Cached soft procedural noise forms three mist bands behind the near-tree plane and two low path bands in front. Independent speeds and parallax prevent a single flat scrolling sheet. The boss arena uses reduced foreground fog opacity. Fog off removes the new layers; calm mode freezes their wind animation. Existing grain, HD/pixel/CRT and resolution options remain.

## Verification and limits

The accompanying scoped QA records actual production AI/phase/entry diagnostics for 36 final fights, all 576 chapter/difficulty/player-count beats, measured day-state floor luminance, route-to-night progression, moving fog captures, and Chrome/WebKit mobile layout/render checks. Injected legal damage and invulnerable diagnostic heroes are not a complete human playthrough. Emulated WebKit does not certify physical iPhone performance. Night and forest composed captures were visually inspected. The Review Studio includes actual production day/night and fog previews.
