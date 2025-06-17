# Tiled Background Component Documentation

This document provides instructions on how to use the `TiledBackground` React component to create an interactive, tiled background effect for any section of your website.

## Tested Example

This component has been tested on a background image named `Group 457.png` located at `src/assets/Group 457.png`. The image was set as the background of the main container or the `body`, and the `TiledBackground` component was layered on top. The effect works seamlessly, allowing the image to show through the subtle, animated tile grid overlay.

## Getting Started

To use the component, you first need to have a React project set up. The component itself is self-contained and consists of two files:

- `src/components/TiledBackground.tsx`: The React component logic.
- `src/components/TiledBackground.css`: The styling for the component.

Make sure both files are included in your project.

## Basic Usage

The `TiledBackground` component is designed to wrap the content you want to apply the effect to. Import the component and place your content inside it as children.

Here's a basic example:

```jsx
import TiledBackground from './components/TiledBackground';
import './App.css'; // Your page styles

function MyApp() {
  return (
    <div className="my-section">
      <TiledBackground>
        {/* This is the content that will be displayed on top of the tiled effect */}
        <h1>Hello, World!</h1>
        <p>This section has an interactive tiled background.</p>
      </TiledBackground>
    </div>
  );
}

export default MyApp;
```

### Important Notes:

- The `TiledBackground` component's wrapper (`.tiled-background-wrapper`) has `position: relative`. It's best to place it inside a container that defines the dimensions (width and height) you want the effect to cover.
- The direct children of the `TiledBackground` component will be displayed above the tile effect.
- **Applying to Images/Divs of Any Height**: To apply the effect over an image or any `div`, ensure that the parent container of `TiledBackground` (or `TiledBackground` itself if it's the top-level element) has defined `width` and `height`. The component dynamically calculates the number of tiles needed to fill its own dimensions. If you want it to cover a background image, ensure that the background image is applied to a parent element or the `body` and that the `TiledBackground` component covers that area (e.g., `width: 100%; height: 100%`).

## How it Works

The `TiledBackground` component dynamically creates a grid of individual `div` elements, each representing a "tile." These tiles are positioned over your content, acting as a subtle overlay. The effect is achieved through a combination of React's component lifecycle and CSS animations.

### Dynamic Tile Generation

Upon mounting and on window resize, the component calculates the available width and height of its container (`.tiled-background-wrapper`). Based on the `--tile-width` and `--tile-height` CSS variables, it determines how many columns and rows of tiles are needed to completely fill the space. It then generates the appropriate number of `div` elements, ensuring the grid always covers the designated area, regardless of its dimensions.

### Pulsing Animation

Each tile has a chance to be assigned a "pulsing" animation. This creates a subtle, random flickering effect across the grid.

- **Random Activation**: When tiles are generated, a random number is used to determine if a tile should pulse. This percentage can be adjusted.
- **Staggered Animation**: Each pulsing tile receives a random `animationDelay`, ensuring that the pulses are not synchronized and create a more organic, dynamic visual.

## Customization

You can customize the appearance of the tiles and their animation by adjusting CSS variables defined in `src/components/TiledBackground.css` and a variable in `src/components/TiledBackground.tsx`.

The primary CSS variables are located at the top of `src/components/TiledBackground.css` in the `:root` selector:

```css
:root {
  --tile-width: 100.46px;
  --tile-height: 27.53px;
  --tile-border-color: rgba(255, 255, 255, 0.05);
  --tile-bg-color: rgba(255, 255, 255, 0.02);
  --spotlight-color: rgba(255, 255, 255, 0.15);
}
```

### CSS Variable Explanations:

- `--tile-width`: The width of each individual tile in pixels. (Default: 100.46px, mimicking Excel column width).
- `--tile-height`: The height of each individual tile in pixels. (Default: 27.53px, mimicking Excel row height).
- `--tile-border-color`: The color of the subtle border around each tile. A low `alpha` (last number) value makes it nearly transparent.
- `--tile-bg-color`: The background color of a tile when it "pulses." A low `alpha` value creates a subtle glow.
- `--spotlight-color`: (Currently commented out) The color of the radial gradient spotlight that follows the mouse cursor.

You can either change these values directly in the CSS file, or you can override them in a different stylesheet for more specific control. For example, to change the tile size for a specific section:

```css
.my-special-section .tiled-background-wrapper {
    --tile-width: 50px;
    --tile-height: 50px;
}
```

### Adjusting Pulsing Percentage

The percentage of tiles that pulse is controlled in `src/components/TiledBackground.tsx`.

Locate the `createTiles` function, specifically this line:

```jsx
// ... existing code ...
          const isPulsing = Math.random() < 0.17; // Adjusted to 17% chance for pulsing
// ... existing code ...
```

To change the percentage, modify the `0.17` value to any number between `0.0` (0% pulsing) and `1.0` (100% pulsing). For instance:
- `0.1` for 10% of tiles to pulse.
- `0.5` for 50% of tiles to pulse.
- `0.9` for 90% of tiles to pulse.

### Re-enabling Cursor Effect (Spotlight)

The cursor effect, which creates a radial spotlight that follows your mouse, is currently commented out. To re-enable it:

1. **In `src/components/TiledBackground.tsx`**: Uncomment the `handleMouseMove` function and the `onMouseMove={handleMouseMove}` prop on the main `div`:

    ```jsx
    // ... existing code ...
      const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (wrapperRef.current) {
          const rect = wrapperRef.current.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          wrapperRef.current.style.setProperty('--mouse-x', `${x}px`);
          wrapperRef.current.style.setProperty('--mouse-y', `${y}px`);
        }
      };
    // ... existing code ...
    <div
      className="tiled-background-wrapper"
      ref={wrapperRef}
      onMouseMove={handleMouseMove} {/* Uncomment this line */}
    >
    // ... existing code ...
    ```

2. **In `src/components/TiledBackground.css`**: Uncomment the CSS rules for `.tiled-background-wrapper::before` and `.tiled-background-wrapper:hover::before`:

    ```css
    /* .tiled-background-wrapper::before { */ /* Uncomment this line */
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(
            circle at var(--mouse-x) var(--mouse-y),
            var(--spotlight-color),
            transparent 300px
        );
        opacity: 0;
        transition: opacity 0.2s;
        z-index: 1;
    /* } */ /* Uncomment this line */

    /* .tiled-background-wrapper:hover::before { */ /* Uncomment this line */
        opacity: 1;
    /* } */ /* Uncomment this line */
    ``` 