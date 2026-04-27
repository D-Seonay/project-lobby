# Design Spec: Liquid Glassmorphism Shaders

Implementation of dynamic, organic liquid backgrounds for Bento cards using optimized vanilla WebGL shaders.

## Purpose
To elevate the visual fidelity of the lobby by adding a sophisticated, interactive fluid simulation behind each card, reinforcing the "premium" and "architectural" feel.

## Architecture

### LiquidShader Component
- **Component**: `components/LiquidShader.tsx`
- **Engine**: Vanilla WebGL (no external libraries like Three.js to keep the bundle small).
- **Shader Type**: Fragment Shader (GLSL).
- **Inputs (Uniforms)**:
  - `u_time`: Elapsed time for continuous animation.
  - `u_mouse`: Normalized mouse position relative to the card.
  - `u_color`: Base color derived from the project's accent color.
  - `u_resolution`: Dimensions of the card.

### Performance Strategy
- **Low-res rendering**: Render the shader at a lower resolution and scale it up with CSS (blur handles the artifacts).
- **Viewport detection**: Only run the shader animation when the card is visible in the viewport.
- **Efficient noise**: Use optimized 2D Simplex noise to keep calculation costs low.

## Visual Design
- **Effect**: "Lava lamp" style organic blobs.
- **Color Palette**: Projects' accent colors mixed with deep zinc (`#050507`).
- **Interaction**: The liquid reacts to mouse movement, creating ripples or disturbances in the local flow.
- **Layering**: Positioned absolutely at `z-index: 0` behind the card content, with the card's `backdrop-blur` providing the glass effect.

## Integration
- **BentoCard.tsx**: Wrap or insert `LiquidShader` as the first child of the card container.
- **Dynamic Colors**: Pass `project.color` or a derived accent color to the shader.

## Success Criteria
- 60 FPS performance on modern devices.
- Smooth transitions when the mouse enters/leaves a card.
- High visual consistency with the existing radical dark mode aesthetic.
