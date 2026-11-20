# Held-object start / stop transitions 2.15

Both heroes use new native carry bridge sheets with planted idle, weight transfer, passing and outgoing contact drawings. Each sheet has four four-pose rows: two lead-leg choices for a club and two for a load. The first pose in each row supplies the coherent planted idle. Existing eight-frame distance-driven walking stays in use after the start bridge.

On movement, the bridge takes 160 ms and then hands off to the selected walking contact. On release, the visual gait completes its current half-step to the next contact (at most 112 ms), then reverses the bridge into a planted stance over 160 ms. World movement still starts/stops immediately. Reversing a partly completed bridge continues from its current progress; resuming during foot completion continues the current gait. Heading flips immediately. Attack, jump, hit, death, pickup or a changed held item cancels stale bridge state instead of delaying input.

The controller advances only with player simulation. Rendering and pause do not advance its clock. Each hero owns separate state tied to the actual held item and identity. Draw-only review proxies retain the current visual gait without modifying gameplay action/state. Every frame uses its atlas-wide fixed camera and alpha at the engine's normal opacity; there is no full-body crossfade, opacity pulse or per-frame fitting. Existing invulnerability flashes remain separate combat feedback.

Clubs are authored once into the new bridge sheets. Other objects follow measured per-pose palm positions, and the actual source fingers are restored in front of the prop using the same camera. Regional crates, barrels, glass jars, powder barrels, chests and urns retain their native renderers.

Review Studio adds start/stop sequences for both heroes with club and load. Seeking rebuilds the same production controller through idle, movement, stop, rapid reversal and opposite heading, independent of campaign startup.

## Validation

Chrome and WebKit diagnostics cover 28 combinations per browser (two heroes, seven held objects, two facings), all start/stop phases, quick reversal, pure rendering and immediate interruption. Each browser captures 28 composed states and records four real-keyboard right/stop/left/stop sequences. A deliberately abrupt trace without bridges is rejected by the temporal gate.

The independent Review Studio check exercises four choices and all 32 rig samples, proving one painted club owner, fixed cameras and load finger restoration; preview recordings disable invulnerability flashing for visual inspection. Normal-speed captures/temporal strips are inspected for foot contact, body size and held-object continuity. Existing world/tactical/aerial combat regression and static asset/JavaScript checks pass. Automated tests and browser emulation are scoped diagnostics, not a full human campaign playthrough or physical mobile/gamepad certification.

Balance is unchanged from the accepted 2.14 baseline. Campaign/boss progression coverage for that baseline is documented in its release/QA history. New art and the final prompts are recorded in carry-transition-provenance.json; original PNG masters and test videos are excluded from the runtime ZIP.
