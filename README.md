# Little Dragon ’96 · Yoto Quest 2.16

[Play the current game](https://mikehlr.github.io/little-dragon-96-yoto-quest/?v=2.16)

A six-region arcade brawler for one or two players, with Story and Practice modes, unique hero selection, three difficulty settings and Greek (default), English and Ukrainian. Keyboard, standard controllers and mobile touch controls are supported. Portrait touch mode uses the handheld console presentation.

2.16 adds authored held-object attack/jump/throw/landing transitions for both heroes, graphic arcade announcements, continuous music/ambience through impacts and stronger incoming damage on Normal/Hard. The accepted parallax, evolving weather/lighting, regional soundscape, enemy variety, shops, destructible props and six chapter endings remain.

See [release behavior and scoped validation](RELEASE-2.16.md), [native animation previews](motion-review.html), [new artwork / prompts](carry-action-provenance.json), and [QA results](qa-results.json). Earlier artwork prompt records remain in the provenance JSON files included with the game.

## Controls

Four controller face buttons: attack (hold for charged special), jump, guard/dodge and use/pick up/throw. Shoulder buttons run. All game menus support controller navigation. On touch, use the analog stick and the four action controls; dragging beyond the stick ring runs.

Keyboard P1: arrows, J attack, Space jump, K guard, U use. P2: WASD, F attack, T jump, G guard, E use. Shift runs. Settings include sound levels, HD/pixel/CRT presentation and Calm mode.

## Local use

No package installation or build is needed. Keep the runtime files and assets together, then serve this folder over HTTP, for example:

```text
python -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000/. The runtime integrity manifest lists every shipped dependency. Generated PNG masters, diagnostic scripts, recordings and rejected artwork are excluded from the release ZIP.

Browser emulation and automated checks do not certify a physical phone/controller or replace a human difficulty playtest. See the release notes and QA scopes for what was actually tested.
