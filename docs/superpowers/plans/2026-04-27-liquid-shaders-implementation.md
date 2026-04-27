# Liquid Glassmorphism Shaders Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a high-performance vanilla WebGL liquid shader background for Bento cards.

**Architecture:** A standalone `LiquidShader` component that manages a WebGL context, compiles GLSL noise-based shaders, and reacts to mouse position and time.

**Tech Stack:** React, WebGL (Vanilla), GLSL, Framer Motion (for mouse tracking integration).

---

### Task 1: LiquidShader Component (Core)

**Files:**
- Create: `components/LiquidShader.tsx`

- [ ] **Step 1: Implement the WebGL shader component**

```tsx
'use client';

import React, { useEffect, useRef, useMemo } from 'react';

const VERTEX_SHADER = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform vec2 u_resolution;
  uniform vec3 u_color;

  // Simple 2D Simplex Noise implementation
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p = uv * 2.0 - 1.0;
    p.x *= u_resolution.x / u_resolution.y;

    float noise = snoise(p * 1.5 + u_time * 0.2);
    noise += snoise(p * 3.0 - u_time * 0.1) * 0.5;
    
    // Mouse interaction
    float dist = distance(uv, u_mouse);
    float mouseInfluence = smoothstep(0.4, 0.0, dist);
    noise += mouseInfluence * 0.5;

    vec3 baseColor = vec3(0.02, 0.02, 0.027); // Deep zinc
    vec3 accentColor = u_color;
    
    float intensity = smoothstep(-0.5, 1.5, noise);
    vec3 finalColor = mix(baseColor, accentColor, intensity * 0.15);
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

interface LiquidShaderProps {
  color?: string; // Hex color
  mouseX: number;
  mouseY: number;
}

export function LiquidShader({ color = '#60a5fa', mouseX, mouseY }: LiquidShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Convert hex to RGB normalized (0-1)
  const rgbColor = useMemo(() => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    return [r, g, b];
  }, [color]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    // Shader compilation helpers
    const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const program = gl.createProgram()!;
    gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER));
    gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER));
    gl.linkProgram(program);
    gl.useProgram(program);

    // Buffer setup
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, 'u_time');
    const mouseLoc = gl.getUniformLocation(program, 'u_mouse');
    const resLoc = gl.getUniformLocation(program, 'u_resolution');
    const colorLoc = gl.getUniformLocation(program, 'u_color');

    let animationFrameId: number;
    const startTime = Date.now();

    const render = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width / 2; // Low-res for performance
        canvas.height = height / 2;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }

      gl.uniform1f(timeLoc, (Date.now() - startTime) / 1000);
      gl.uniform2f(mouseLoc, mouseX, 1 - mouseY); // Invert Y for GLSL
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.uniform3f(colorLoc, rgbColor[0], rgbColor[1], rgbColor[2]);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [rgbColor, mouseX, mouseY]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none opacity-50 mix-blend-screen"
      style={{ filter: 'blur(40px)' }}
    />
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/LiquidShader.tsx
git commit -m "feat: add optimized vanilla WebGL LiquidShader component"
```

---

### Task 2: Integration in BentoCard

**Files:**
- Modify: `components/BentoCard.tsx`

- [ ] **Step 1: Update BentoCard to include the shader background**

```tsx
// Around line 13
import { LiquidShader } from './LiquidShader';

// In BentoCard, pass normalized mouse position to the shader
// Use the project's accent color (can be derived from tags or added to project type)
const accentColor = project.holographic ? '#a78bfa' : '#60a5fa';

// Inside the return, as the first child of the motion.a
<LiquidShader 
  color={accentColor} 
  mouseX={mouseX.get() + 0.5} 
  mouseY={mouseY.get() + 0.5} 
/>
```

- [ ] **Step 2: Commit**

```bash
git add components/BentoCard.tsx
git commit -m "feat: integrate LiquidShader into BentoCard"
```

---

### Task 3: Integration in Other Widgets

**Files:**
- Modify: `components/ControlCenterWidget.tsx`
- Modify: `components/SpotifyWidget.tsx`
- Modify: `components/PresenceWidget.tsx`

- [x] **Step 1: Add LiquidShader to all interactive widgets**

- [x] **Step 2: Commit**

```bash
git add components/ControlCenterWidget.tsx components/SpotifyWidget.tsx components/PresenceWidget.tsx
git commit -m "feat: add liquid shaders to all major bento widgets"
```
