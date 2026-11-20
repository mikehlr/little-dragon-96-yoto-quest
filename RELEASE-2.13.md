# Arcade enemy reactions 2.13

## Hit weight and physical movement

All 41 enemy identities now respond through a shared world-space reaction controller. A punch gives a compact stagger; kicks, clubs, energy shots, thrown props and explosions give progressively stronger horizontal knockback and lift. Heavy foes, guarded fronts and bosses resist displacement. Kicks that open a shield preserve their stronger counter reaction.

Native actor size, body camera, hand registration and walking frames are unchanged. The body moves using its actual x/z coordinates; the original ground shadow stays attached to the floor. Strong hits add a brief hit stop and restrained shake. Landing adds a small dust/thud accent. Ordinary attacks are interrupted during hit stun, followed by a short recovery/cooldown. Already launched projectiles remain independent. Bosses retain their attacks, phase locks and phase transitions, with a smaller recoil.

Reactions capture arena bounds at impact so a later camera/gate change cannot drag a corpse to a new section. Grounded motion respects solid prop edges; aerial motion can pass above them. A wall stops horizontal velocity without causing repeated bounce/damage. Lift and active velocity are bounded.

## Defeat and cleanup

Defeated enemies use a launch/fall/settle sequence, then blink before disappearing. Native fallen poses remain fully visible instead of using the legacy rapid fade; fallback boss/ordinary sprites use their existing body art and a directional fall rotation. Calm mode fades during the final interval instead of blinking.

A bounded pool keeps a defeated actor in the same depth-sorted world pass when the next encounter replaces the enemy roster. These actors are already at zero HP and do not block encounter progression, receive damage again, attack, or drop rewards again. The renderer restores the real roster immediately after drawing. Pause freezes the defeat clock; stage/retry resets clear the pool, and a different streamed art pack suppresses stale bodies. The final boss reward allows a short visible blink interval before an early pickup can advance to the outro.

No HP/damage values, score or loot grants are added by the controller. Actual damage still passes through the existing combat rules once. Guard counters and all three boss phases remain.

## Production preview and checks

Review Studio adds six actual physics previews: punch, kick, club, explosion, ordinary KO and boss KO. Seeking reconstructs the same reaction physics and advances impact effects; switching categories clears preview corpses.

Scoped evidence covers 246 live reaction cases (41 enemy types by six sources), all 41 defeat blink/cleanup timelines, boundary/shield/pause/orphan-pool lifecycle, all 36 region/difficulty/player-count boss fights including phase/victory progression, all 576 chapter beat combinations, existing combat signatures and aerial attacks, actual ordinary/boss renderer blink states in all six regions, Chrome/WebKit desktop/portrait rendering, and a real keyboard club-pickup/attack/launch/KO sequence.

An additional readiness guard avoids drawing an unloaded harbor gangplank during streamed scene changes, discovered during campaign verification.

Diagnostics use invulnerable heroes and injected legal damage where stated. They are not a full human campaign playthrough or a physical phone/gamepad certification. Native flight, landed poses and boss fall captures were visually inspected.
