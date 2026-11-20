# Beat-em-up impact references

Sources consulted:

- [SEGA Streets of Rage official manual](https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/71164/manuals/08%20SOR1_PC_MG_EFIGS_US_v6.pdf?t=1733765070), English pp. 2–3: short move vocabulary, breaking scenery to discover weapons, supplies and recovery rewards. This supports keeping destructive objects directly useful in combat rather than turning them into errands.
- [Streets of Rage 4 community pickup summary](https://streetsofrage.fandom.com/wiki/Pickups_in_Streets_of_Rage_4): delayed throwable grenades and area damage. This is a community mechanics reference, not an official engine specification.
- [Community player discussion of grenade returns](https://gamefaqs.gamespot.com/boards/246602-streets-of-rage-4/78657871): throwable bombs can create a counterplay opportunity. Our normal-attack return deliberately uses the existing simple controls rather than adding a separate catch input.

Implementation decisions are our design choices, not claims of frame-accurate parity: short material bursts, a bounded lingering phase then blink/cleanup, fixed target telegraphs, generous easy fuse time, one hostile bomb on easy/normal, safe reflected blasts and no damage after victory. The user explicitly requested blinking residue and clearer streetlamp space. Decorative intensity is kept separate from collision/damage and loot lifetimes.

Art provenance: the new goblin role reuses the accepted wax-goblin atlas via a manifest alias; no new native enemy painting is claimed. Its accessories, bomb body and local effects are canvas-rendered. Vessel/barrel art and wood fragment texture samples come from existing shipped native assets.
