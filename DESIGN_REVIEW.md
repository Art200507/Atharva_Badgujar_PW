# Experience-first gallery review

## Requested structure

Experience comes immediately after the unchanged hero. Each of the five collection rows is now its own full-screen scroll floor: research/professional experience, teaching/general experience, leadership, research projects, and personal projects. About and Contact follow. There are no standalone floors for The Middle Man, MindMirror, or SchemaMorph, and no multi-row Experience screen.

## References reviewed

- [Three.js physical materials, r170](https://github.com/mrdoob/three.js/blob/r170/docs/api/en/materials/MeshPhysicalMaterial.html): anisotropy, clearcoat, environment maps, and per-pixel cost. Applied directional metal highlights, restrained clearcoat, and the existing PMREM environment to exhibit materials.
- [Three.js bloom example, r170](https://github.com/mrdoob/three.js/blob/r170/examples/webgl_postprocessing_unreal_bloom.html): reviewed its composer/render/bloom/output pipeline. Kept direct rendering and localized shader/emissive edge light for this revision rather than adding unmeasured full-screen passes.
- [Lenis](https://github.com/darkroomengineering/lenis/blob/main/README.md): reviewed native scroll synchronization, a shared RAF, nested-scroll handling, and reduced motion. Retained one native scroll source and the existing damped camera; did not layer another smoother on top.
- [GSAP](https://github.com/greensock/GSAP/blob/master/README.md): reviewed scroll sequencing and responsive animation approaches. Kept this compact fixed-scene journey on its existing single animation loop.
- [Three.js SVGRenderer](https://github.com/mrdoob/three.js/blob/r170/examples/jsm/renderers/SVGRenderer.js): used locally for CPU geometry studies. These do not show the GPU's anisotropic material or final browser pixels.

## Five review passes

1. **Structure:** Centralized the eight stops, moved Experience to the top, split its categories into distinct floors, and updated every navigation entry and legacy hash. Confirmed exactly one collection per floor and all 28 cards retained.
2. **Sculpture and materials:** Added distinct teaching, leadership, and quantum objects. Refined the first experience object from plain bars into bevelled pillars within woven arches. Added anisotropic brushed metal, instanced shaft walls, an exhibit light frame, and dissolving floor plates. Preserved the original hero image byte-for-byte.
3. **Motion:** Checked a monotonic camera descent, reversible plate dissolution, continuous object rotation, drag/reduced-motion pauses, exhibit crossfades, horizontal easing and reversal, and keyboard/pointer navigation. Kept all updates on one clock.
4. **Composition and responsiveness:** Reviewed CPU renders of actual scene geometry and desktop/mobile static composition studies. Projected actual mesh vertices through the scene camera and found off-screen objects; reduced their scale and corrected placement. Made collection surfaces lower and wider, reduced duplicated artwork, separated the title from the main exhibit, and allowed vertical scroll chaining on short screens.
5. **Regression:** Rechecked descriptions, quantum metrics, the four local demos, all eight navigation stops, unique SVG IDs, corrected roles, original hero checksum, JavaScript syntax, CSS parsing, asset paths, and Git whitespace. Scene construction validates 237 meshes, finite geometry, 112 instanced wall bays, and eight reversible floor plates.

## Verification boundary

DOM and scene tests passed. The required managed browser tool (`cua_repl.js`) was not exposed. No browser was installed or preview server started. CPU vector renders and ReportLab composition proofs informed the review but are not screenshots and do not verify WebGL shaders, live browser layout, frame rate, or touch behavior on a physical device. No claim of visual perfection or live-browser verification is made.


## Reactive hero and scroll follow-up

The user identified two actual defects: the hero was a single image being warped, and large scroll jumps could pass through floor transitions too quickly. This follow-up removes the entire image-warp shader and uses seven independently articulated, rigid Three.js ribbon meshes. The original image remains a fallback and material/silhouette reference; the active object is real geometry, not an exact reproduction of the image. The background plate was edited to remove the original object so it does not appear behind the live mesh.

Reviewed the official [Three.js extruded-shapes example](https://github.com/mrdoob/three.js/blob/r170/examples/webgl_geometry_extrude_shapes.html) and [Object3D transforms](https://github.com/mrdoob/three.js/blob/r170/docs/api/en/core/Object3D.html). Existing Three.js geometry and per-object transforms provide the required capability without an additional animation library.

The camera driver now caps progress speed and acceleration independently of native scroll deltas. Tests exercise an instant scroll request from Surface to Core at 20, 60, and 120 fps: all eight stops and all seven transition intervals receive visible frames, with no overshoot. Reverse-input handling drops queued travel in the old direction. Dialogs pause the journey, and depth navigation shares the same driver. This deliberately takes longer to present a large jump than moving the scrollbar directly to its destination.

The four hero titles slide horizontally on a three-second schedule with a seamless cloned first item. Tests cover timing, wraparound, reduced motion, off-screen pauses, and the static accessible role list.

Scene tests confirm seven distinct strip transforms, unchanged vertex data and strip scales during motion, pointer responses, a centered core, reduced-motion freezing, and scroll opening. CPU geometry studies informed the diagonal strip arrangement. Projected mesh bounds informed responsive sizing. These checks do not verify final GPU shading or live browser behavior; the managed browser tool is still unavailable.


## Direct section navigation and usability review

- Replaced the long index descent with grouped direct links for all eight sections. Each has a plain-language name, description, native fragment URL, and current-section indicator. Depth-gauge shortcuts also settle immediately; scroll and Next Chamber remain cinematic.
- Added destination heading focus, a polite section announcement, labeled dialog, index expanded state, hash aliases, and Back/Forward handling. Modifier-clicks retain native link behavior.
- Enlarged small controls and mobile card metadata, made the mobile index scrollable with a sticky close control, and retained reduced-motion behavior.
- Connected the owner-supplied email in Contact and the résumé. Regenerated the two-page résumé draft from the current experience and project data, correcting stale roles and dates; education remains pending.
- Verification: all eight destinations, section focus, active markers, hash/popstate navigation, modifier-clicks, skip/gauge links, all 11 résumé roles, and mailto destinations pass DOM simulations. Existing carousel, cinematic-motion, scene-geometry, and adaptive-performance suites pass. Both PDF pages were rendered and visually inspected.
- Limitation: managed browser tools remain unavailable. These checks do not establish live browser layout, native history behavior, GPU appearance, or measured frame rate.


## Final UI bug review and Vercel preparation

- Restored a visible INDEX label on mobile and adjusted narrow header spacing.
- Fixed depth-gauge label visibility for keyboard focus.
- Fixed carousel arrow-key navigation leaving focus on an off-screen card: focus now follows the visible canonical card and wraps in either direction. Enter or Space on the collection opens its visible entry. Pointer-driven movement retains its easing.
- Prevented a delayed native dialog close event from unlocking a newly opened dialog. Dialog close controls stay available while scrolling; long titles wrap.
- Added scroll space for About and Contact on short viewports, and reserved scrollbar space to reduce dialog-open layout shifts.
- Added Vercel static deployment configuration. UI regression tests cover keyboard wrapping, dialog event ordering, local asset paths, and output directory configuration. Browser/GPU verification is still unavailable in this environment.
