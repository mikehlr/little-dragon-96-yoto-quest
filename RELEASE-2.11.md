# Weather sound and Dragon Pocket 2.11

## Environmental audio

A separate stereo environment bus adds evolving wind and leaf rustle in the neighborhood/forest, sea wash and rain in the harbor, dusty ruin gusts, low castle air and fire crackle, and icy wind in the frozen pass. Profiles follow the same chapter weather progression as the graphics. Distant harbor thunder follows a visible lightning strike after 650 ms. Fire crackles have irregular spacing and use different noise segments.

Shared twelve-second stereo noise is filtered into five persistent beds; their loop tail crossfades into the loop-start region. All synthesis runs locally through the existing Web Audio rig; no sound-file downloads. Region changes crossfade beds instead of constructing repeated sources. Short transient voices disconnect when finished and are cancelled on pause/mute/hidden state.

The default ambience setting is 40%, independent of the music control and scaled by the action-effects volume/mute. At default volumes measured early/late scene beds sit roughly 13–28 dB below the score/action reference. Lower music levels also lower the environment ceiling while music is enabled. Impacts and special attacks duck only the environment bus to 24% for 240 ms, followed by a smooth return. Music and action gains retain their existing behavior.

The ambience setting is accessible through the existing controller/touch settings and translated into Greek, English and Ukrainian. Home, menus, pause, hidden tabs and review pages do not play the environment bed. Unactivated/suspended/unsupported AudioContext states are handled without scheduling bursts. Calm/reduced lightning modes do not schedule thunder.

## Portrait handheld

Touch portrait mode has a dedicated Dragon Pocket shell: dark molded body, screen bezel, power light, speaker grille, recessed analog stick and four raised action buttons. Canvas display height is 73.125vw, exactly 130% of its former 56.25vw height. The image deliberately stretches vertically as requested. Internal game coordinates and resolution remain unchanged.

The screen and controls have separate physical space on 320, 375, 390 and 430 px phone layouts. Left-handed layout mirrors both control groups. Landscape restores the original 16:9 presentation immediately, without a geometry transition. Pointer cancellation/reset on rotation and analog steering with simultaneous jump remain functional. Decorative hardware cannot receive input or text selection.

## Checks and limits

Scoped evidence includes production offline renders for six early/late environments and score/action mixes, measured RMS headroom and peaks, real Chrome Web Audio activation/thunder delay/duck/mute/pause, controller-style volume changes in all languages, multi-touch steering/jump/facing, portrait/landscape geometry and control bounds, and audio suspend/visibility handling. Numeric audio measurements do not substitute for subjective listening or physical phone testing.

Windows Playwright WebKit has no AudioContext in this environment. Its checks cover graceful audio fallback and touch layouts/settings; real-time audio is exercised in Chrome. Physical iPhone sound and ergonomics remain device checks.
