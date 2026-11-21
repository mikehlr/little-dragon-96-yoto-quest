# Little Dragon ’96 · Yoto Quest 2.19

[Play the current game](https://mikehlr.github.io/little-dragon-96-yoto-quest/?v=2.19)

A six-region arcade brawler for one or two players, with Story and Practice modes, unique hero selection, three difficulty settings and Greek (default), English and Ukrainian. Keyboard, standard controllers and mobile touch controls are supported. Portrait touch mode uses the handheld console presentation.

2.19 adds distinct collection/unlock chimes, continuous music through shops, clearer shop buttons and a slightly lower portrait screen. Automatic arcade announcements continue with item art, names and set/music unlocks, without pausing play or taking control focus. The existing collection includes a persistent coin wallet, 24 buyable illustrated souvenirs, 18 Yoto story cards and a controller-friendly collection gallery. Every three collected Yoto cards grant team health/energy and coins; completing a regional set unlocks its soundtrack. Stages two through six each introduce a distinct short bonus round with the existing controls. Purchases and collection progress are stored locally in the browser.

See [release behavior and validation limits](RELEASE-2.19.md), [new artwork and exact prompts](collection-provenance.json), [animation previews](motion-review.html), and [QA results](qa-results.json). The accepted six-region campaign, authored held-object animations, weather, music and combat remain. The exact 2.16 release is preserved separately as RTM and Git tag rtm-2.16.

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
