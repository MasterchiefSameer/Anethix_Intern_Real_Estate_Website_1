# Dynamic Map Styling, HTML iframes, & Color Inversion

In [Contact.jsx](file:///f:/Web_D/Projects/Real_Estate_Website/client/src/components/Contact.jsx), the interactive location map adapts dynamically when switching between **Light** and **Dark** themes.

This document details:
1. What an `<iframe>` element is (and how it differs from a CSS class).
2. How the map is embedded in our page.
3. How CSS filters are applied to achieve a custom dark-styled map without requiring paid API tokens.

---

## 1. What is an iframe? (Element vs. Class)

An `<iframe>` (Inline Frame) is a native **HTML element (tag)**, not a CSS class.

* **HTML Element (`<iframe>`)**: Defines the structure and behavior of a nested window. It is used to embed another document (like a Google Map) directly inside your webpage.
* **CSS Class**: A reusable styling rule (like `.rounded-xl` or `.invert`) applied *to* an element to control its visual appearance.

In our code, `<iframe>` is the HTML tag that fetches and runs Google Maps, while `className` contains the Tailwind CSS classes that style it.

---

## 2. The Core Map Embed (`<iframe>`)

The map is loaded using a zero-dependency Google Maps embed:

```html
<iframe 
  title="office map"
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3581.428678502324!2d91.77660601502758!3d26.1500366834614..."
  className={`w-full h-full rounded-xl border-0 transition duration-300 ${
    theme === 'dark' ? 'opacity-85 invert contrast-125 filter grayscale' : 'opacity-90'
  }`}
  allowFullScreen="" 
  loading="lazy"
/>
```

---

## 3. Dynamic Theme Modification

By consuming the custom `useTheme()` hook, the component tracks whether the user is viewing the site in `light` or `dark` mode:

```javascript
const { theme } = useTheme();
```

Depending on the value of `theme`, the class list of the `<iframe>` element updates dynamically:

### A. Dark Mode Classes (`theme === 'dark'`)
When the dark theme is active, the iframe receives the following Tailwind filter classes:

| Tailwind Filter | CSS Property | What it Accomplishes |
| :--- | :--- | :--- |
| `invert` | `filter: invert(100%);` | Inverts all colors on the map (white backgrounds turn black, blue waterways turn orange/warm grey, text colors invert). |
| `contrast-125` | `filter: contrast(125%);` | Increases contrast by 25% to make streets, borders, and text labels readable against the dark background. |
| `filter grayscale` | `filter: grayscale(100%);` | Removes color saturation. This neutralizes the inverted orange/red hues, resulting in a charcoal/slate color theme. |
| `opacity-85` | `opacity: 0.85;` | Dims the map slightly so it matches the surrounding page elements. |

### B. Light Mode Classes (`theme === 'light'`)
When the light theme is active, all inversion filters are removed, and a standard `opacity-90` class is applied. This displays the default map colors.

---

## 4. Smooth Transitions
The iframe includes the classes `transition duration-300`. This ensures that when the user toggles the theme button in the header, the map smoothly transitions between light and dark themes over `300ms` rather than flickering instantly.
