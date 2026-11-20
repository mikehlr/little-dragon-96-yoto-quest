# Arcade destruction 2.12

## Material impact and cleanup

Destructible supplies now release material-specific fragments with ballistic arcs, rotation, a short bounce and settling. Wood pieces sample the native container painting; gold/silver trim, translucent glass, ceramic/stone and ice use small shaded fragments. A surviving object gives a restrained hit reaction. Fragments remain briefly, blink during their last 1.25 seconds and disappear at 4.8 seconds. Calm mode fades them instead. The live fragment count is capped at 140; fragments never block movement or pickup.

Legacy generic debris/opened-container residue created by a break is replaced by the new material system. Opened enemy-entry covers retain their entry animation, then blink/fade and clean up after emergence. Loot retains its normal availability. Repeated break calls cannot duplicate loot or fragments.

Supply pockets in the neighborhood, harbor and castle gain four sealed glass vessels and one marked fireworks barrel. Glass uses the existing native potion painting with a small seal; the barrel uses the native barrel with a curved fireworks mark. Both use the established registered hand poses for both heroes, including aerial throws. Fireworks barrels give a local fire burst, shock ring, smoke, fragments and light; their blasts help against nearby enemies and do not hurt the players. Airborne barrel bursts retain their impact height. Glass/ice and ceramic breaks have distinct synthesized accents through the existing effects mix.

## Bomb-throwing enemy

Enemy 40, Crackle Goblin, joins the neighborhood, harbor, ruins and castle rosters. This is a new combat role derived from the existing wax-goblin native animation atlas, with a bandolier, spare bombs and a registered held bomb. The fixed body camera/scale stays unchanged. A dedicated windup/release sequence uses the source's closed-hand and extended-palm poses.

The goblin locks an aim point and lobs a bomb in a visible arc. A floor ellipse matches its actual blast footprint. After landing the fuse lasts 2.2/1.8/1.45 seconds on easy/normal/hard. Detonation damages each nearby grounded hero once, through existing difficulty scaling; a sufficiently high jump avoids it. A normal attack can bat a grounded bomb back, turning it into a safe friendly blast. No extra button is needed. Pending hostile bombs are defused when the final enemies are gone. Easy/normal allow one live hostile bomb; hard allows two. Existing enemy attack budgets remain.

The bomb warning stays visible above the city night grade. Local blasts never flash the whole screen or cover the HUD. Calm/reduced effects restrain explosion intensity while retaining danger cues. A little ambient fill preserves enemy readability in unlit city gaps.

## Clear street lighting

The neighborhood now has twenty grounded streetlamps, taller than the previous posts. Placement avoids fixed encounter machinery. Nearby movable supplies/furniture are placed outside the road-facing light footprint without moving encounter anchors, and conflicting decorative ground details are removed. Fixture glow uses the actual bulb registration and camera plane. The final night route is checked with multiple camera positions.

## Preview and checks

Production Review Studio adds five actual physics previews: wood/metal, glass, ceramic, fireworks and a lobbed bomb. Its enemy catalog includes all 41 combat identities.

Scoped QA covers material physics/loot/blink/cleanup in all six regions; twenty lamp clearances and night registration; native carried poses including new props (94 captures); new bomber AI/throw/damage/jump/return and campaign factory; Chrome/WebKit preview and mobile rendering; all 576 campaign beat/difficulty/player-count combinations; existing distinct AI/held aerial attack regressions and static parsing/manifests.

These diagnostics include injected damage for campaign traversal. They are not a full human playthrough or physical phone/gamepad certification. Composed source hand poses, destruction and night lighting were visually inspected.
