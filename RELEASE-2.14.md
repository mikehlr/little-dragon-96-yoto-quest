# Planted carry idle and difficulty balance 2.14

Idle now samples the existing planted native carry poses (club frame 8, load frame 6) for both heroes. The eight-frame carrying gait is used only while walking. Standing club grips are registered independently to each hero's actual fist; the source fingers cover the single prop handle. Held idle no longer receives the generic vertical body bob, so planted soles remain on the ground. Fixed body cameras and head proportions remain; no newly painted sprites are claimed.

## Difficulty formula

All damage passes through the existing incoming multiplier exactly once, before the existing guard reduction. Perfect guard, dodge, invulnerability, three lives, respawn and control timing stay available in all modes.

| Rule | Easy | Normal | Hard |
| --- | ---: | ---: | ---: |
| Incoming damage | 0.60x | 1.45x | 2.10x |
| Ordinary enemy HP | 0.70x | 1.22x | 1.55x |
| Boss HP | 0.78x | 1.15x | 1.40x |
| Enemy speed | 0.90x | 1.03x | 1.12x |
| Attack rest duration | 1.25x | 0.90x | 0.72x |
| Telegraph duration | 1.25x | 0.95x | 0.82x |
| Ordinary director wave size | 2 | 2 | 3 |
| Ordinary simultaneous attack budget (solo) | 1 | 2 | 3 |
| Solo helper slots | omitted | included | included |
| HP recovered after ordinary fight | 16 | 3 | 0 |
| Stage starting HP floor | 100 | 65 | 50 |
| Apple recovery | 44 | 30 | 20 |

HP formulas keep existing identity/co-op modifiers; attack rest and telegraph multipliers apply to authored timings. The group size is a maximum; small formations remain smaller. Co-op keeps its extra attacker allowance and existing HP modifier. Enemies use existing authored doors, cover, work or transport entrances; added solo helpers do not teleport into the arena. Boss support waves keep their existing difficulty-dependent counts and cadence. Shop and other fixed-value pickups remain useful.

A base-12 unblocked hit removes 7 / 17 / 25 HP. From 100 HP, that is 15 / 6 / 4 such hits before a life is lost, disregarding healing. One such hit followed by an ordinary clear gives a net HP change of +9 / -14 / -25, before the maximum-HP cap. The change combines attrition, attack cadence and encounter pressure rather than relying on enemy HP alone. Easy's complete rule profile is unchanged.

## Validation

Chrome and WebKit production diagnostics exercise actual damage, guard and invulnerability, all 41 ordinary enemy HP profiles, boss HP, 396 ordinary encounters per browser (six regions, three difficulties, solo/co-op), queued entrance ownership, wave limits, translated difficulty choices, keyboard movement/release, and 28 standing/walking held-object render states per browser. A separate 94-capture check covers both heroes' existing pickup, idle, walk, jump, guard, hit, land and attack/throw poses, including six regional containers. Composed planted club/load captures were visually inspected.

Regression checks cover all 36 boss combinations with three phases and KO/victory timing, 576 chapter beats and six endings, native world layout, enemy signature tactics and held-object aerial attacks. Static checks parse every shipped JavaScript file and resolve both asset manifests. These are scoped automated diagnostics (progression checks inject legal damage); they do not replace a human difficulty playtest or certify a physical phone/gamepad.
