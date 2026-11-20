# Regional atmosphere 2.10

Five remaining regions now evolve with route progress or active chapter time. Smooth monotonic progression avoids sudden weather jumps; pause and shops freeze it, and retry resumes at the appropriate route position. The city day/night cycle remains.

- Harbor: gathering rain, cooler storm light, three rain depths, floor splash rings and restrained wet reflections. A distant branching lightning strike gives a single soft pulse approximately every seventeen seconds after the storm builds. It sits behind near architecture, with no global white flash.
- Forest: denser drifting mist, brighter floating motes and cooler background light deeper in the chapter.
- Ruins: warm dusty light, wind gusts, suspended grit and low ochre sand veils.
- Castle: violet smoke behind architecture, warming torch light and rising embers registered to existing torch fixtures.
- Frost: gathering snowfall across three depths, changing wind and a restrained distant aurora behind the near trees and stonework.

## Readability and preferences

Background grading happens before fighter sprites. Foreground precipitation, fog and dust exclude visible fighter silhouettes, including weapons and airborne height. Each actor is subtracted separately so overlapping fighters remain protected. Continuous forest fog uses a feathered oval restoration mask around bodies, avoiding rectangular clear patches. HUD, health bars and attack telegraphs retain their contrast. Weather changes no collision, damage, AI or spawn rules.

Calm freezes new wind, precipitation and ember motion and disables lightning. Reduced effects lower precipitation counts and disable lightning. Fog off removes mist/smoke veils. Lighting off removes lightning, aurora, motes and embers. Fixture light and ember registration respect parallax off. All HD/pixel/CRT and native resolution options remain. Mist colors are cached procedural textures; no new raster downloads or per-frame CPU pixel readback.

The production Review Studio offers beginning, middle and late atmosphere previews for all five regions alongside city time-of-day previews.

## Validation and limits

Reports cover early/mid/late production captures of all five regions; overlapping fighter exclusion pixels; route, pause/retry and calm/lightning checks; all 576 campaign beat/difficulty/player-count combinations; enemy combat signatures and held aerial attacks; Chrome/WebKit touch layouts at nine resolution/filter combinations per region and new weather previews. A normal-time harbor weather sequence was captured and final compositions inspected.

Campaign traversal uses legal-entry injected damage and is not a complete human playthrough. Emulated WebKit does not certify physical iPhone performance.
