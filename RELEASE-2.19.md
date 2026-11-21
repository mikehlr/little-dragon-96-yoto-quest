# 2.19 · Collection chimes, readable shop and portrait placement

New collection announcements play a short ascending three-note arcade chime. Completing a souvenir set or unlocking a region soundtrack plays a longer arpeggio/chord fanfare. Sound is triggered once when the queued announcement becomes visible; pause/resume, repainting or language changes do not replay it. New acquisitions no longer stack the old generic pickup/reward sound on top. Repeated cards retain their ordinary pickup feedback.

Both cues use the existing effects bus and effects-only limiter, respecting sound settings without modifying music gain, changing scenes or restarting the score. Music now also continues when entering the physical shop or menu souvenir store and when returning to play.

Shop supply buttons use compact beveled arcade panels with separately laid out icon, wrapping name and price. Portrait and short landscape layouts have distinct internal grids; the shop and catalogue share viewport-safe framing. Existing prices, purchases, controls and collectible artwork remain unchanged.

The portrait handheld screen moves down by clamp(16px, 3dvh, 28px). Bezel, brand, pause control and control-deck placement follow the same shared geometry variable. Screen size and immediate orientation changes remain unchanged.

Current validation covers rendered shop text/control bounds in three languages and four viewport sizes, touch portrait geometry, recorded offline audio mixes for both chimes, and live announcement/music transport continuity and sound mute. See qa-results.json for exact scopes. Mobile tests emulate browsers and do not certify physical iPhone/controller hardware. The accepted 2.18 announcement behavior and 2.17 campaign remain the baseline; RTM 2.16 is untouched. No new raster artwork was generated.
