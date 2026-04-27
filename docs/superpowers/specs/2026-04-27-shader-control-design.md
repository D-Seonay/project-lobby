# Design Spec: Global Shader Control

Implementation of a global toggle to enable or disable Liquid Shaders, accessible via the Command Palette.

## Purpose
To provide users with a way to control advanced visual effects, useful for battery saving, performance on low-end devices, or personal preference, without cluttering the main UI.

## Architecture

### SettingsProvider (Context API)
- A global React Context to manage:
  - `shadersEnabled`: Boolean state (default: `true`).
  - `toggleShaders()`: Function to switch the state.
- **Persistence**: Save the state in `localStorage` (key: `seonay_settings`).

### Integration with LiquidShader
- Modify `LiquidShader.tsx` to read from `SettingsProvider`.
- If `shadersEnabled` is `false`, the component should return `null` and avoid initializing the WebGL context to save resources.

## UI/UX: Command Palette Integration
- **Action**: Add an entry to `CommandPalette.tsx`.
- **Label**: `Toggle Liquid Effects` (or `SYSTEM: FX_ENGINE`).
- **Feedback**: Immediate visual removal/re-addition of the shader backgrounds.

## Success Criteria
- Shaders stop rendering immediately when disabled.
- The state persists after a page reload.
- No WebGL initialization occurs when shaders are disabled.
