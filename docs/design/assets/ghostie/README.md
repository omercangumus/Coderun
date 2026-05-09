# Ghostie Mascot Assets

This directory contains the official Ghostie mascot images and animations for the Coderun project.

## Naming Convention
All assets have been normalized. We use the following safe filenames without spaces or Turkish characters:

- `ghostie_idle`: Used for idle, thinking, hint, helping states.
- `ghostie_sad_wrong`: Used for incorrect answers, reinforcement, or sad states.
- `ghostie_angry`: Used for angry states.
- `ghostie_success_coder`: Used for correct answers or success.
- `ghostie_very_happy`: Used for celebrating, level up, or lesson completion.

Extensions are either `.png` for static images or `.mp4` for animations.

## Usage Rule
**Animation Preferred:** Always prefer to display the `.mp4` animation if available and auto-play is supported. Fallback to `.png` otherwise.

## Paths

### Mobile
- **Images:** `mobile/coderun_mobile/assets/images/ghostie/`
- **Animations:** `mobile/coderun_mobile/assets/animations/ghostie/`
- **Implementation:** Use the `GhostieReaction` widget from `lib/presentation/widgets/ghostie_reaction.dart`.

### Web
- **Images:** `web/coderun-web/public/images/ghostie/`
- **Animations:** `web/coderun-web/public/animations/ghostie/`
- **Implementation:** Use the `GhostieReaction` component from `src/components/ghostie/GhostieReaction.tsx`.

### State Mapping
| State | Asset Name |
| :--- | :--- |
| `idle`, `thinking`, `hint` | `ghostie_idle` |
| `wrong`, `reinforcement` | `ghostie_sad_wrong` |
| `angry` | `ghostie_angry` |
| `correct`, `success` | `ghostie_success_coder` |
| `celebrating`, `very_happy` | `ghostie_very_happy` |
