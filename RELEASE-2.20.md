# 2.20 · Mobile announcements stay outside play and controls

Mobile collection notices now use a compact 64px dock showing the actual item illustration, name and collection/unlock result. Portrait uses the existing band above the handheld display, leaving pause to its right. The decorative handheld brand temporarily hides while the notice occupies that band. Landscape reserves a stable 72px top rail above the canvas, preserving the canvas aspect ratio and immediate rotation behavior; the game does not resize when a notice appears or disappears.

In mobile shops and collection menus, the notice occupies the collection header, whose content temporarily hides and returns after dismissal. Purchase, navigation and inventory buttons stay visible and usable. Menu framing accounts for top/bottom safe insets.

Placement checks actual rectangles against the entire game canvas, stick area, action buttons and pause control, or against menu buttons. If the current view has no safe position, the announcement hides and retains its remaining time until a safe view returns. Its sound plays once, on its first safe visible frame. Pause, layout changes and resuming a deferred notice do not replay the sound. Text is translated before layout measurement.

The desktop presentation, acquisition order, reward logic, sound effects and music routing remain the accepted 2.19 behavior. RTM 2.16 is untouched. Current tests measure real rendered intersections across phone sizes, orientations, both handed control layouts, three languages and safe-inset fixtures, and include a known-bad legacy placement canary. These are browser-emulated device checks, not physical iPhone certification. See qa-results.json.
