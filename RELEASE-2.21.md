# 2.21 · Restore the accepted mobile landscape viewport

Removes the 2.20 landscape canvas override and its reserved 72px rail. The game again uses the exact pre-2.20 centered, aspect-fit fullscreen dimensions, with the original pause-button placement. Showing or dismissing an announcement never changes canvas geometry.

Landscape announcements now use a short 34px badge in the central HUD area, temporarily replacing the central location/score labels. They remain between the player HUD blocks and above gameplay, outside the stick, action buttons and pause control. Portrait keeps the compact notice above the handheld display; mobile shop notices retain their header position. Existing collection, sound and music behavior remains.

Validation compares rendered landscape canvas width, height and vertical centering against the original aspect-fit formula, both before and during announcements, rather than merely asserting that notices do not overlap a shrunken canvas. It also checks the central HUD bounds and actual control rectangles in both handed layouts, three languages and six phone/orientation sizes in Chrome and WebKit emulation. These checks do not certify physical iPhone hardware. RTM 2.16 is untouched.
