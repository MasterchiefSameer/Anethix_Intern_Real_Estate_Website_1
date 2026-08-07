# HTML Fundamentals: What is an iframe?

In web development, you may use elements like `<iframe>` to embed media or map widgets. This guide clarifies what an `<iframe>` is, how it differs from a CSS class, and how we apply styles to it.

---

## 1. What is an iframe?

An `<iframe>` (short for **Inline Frame**) is a native **HTML element (tag)**, not a CSS class. 

It is used to embed another HTML document (like a webpage, YouTube video, or Google Map) directly inside your current webpage.

### Real-world Analogy:
Think of an `<iframe>` as a **window** cut into your wall (your webpage) that allows you to look directly at another house (Google Maps). The content inside the window comes from Google's servers, but the window frame itself is styled on your site.

---

## 2. Element vs. Class

It is important to distinguish between HTML tags and CSS classes:

| Concept | Description | Example |
| :--- | :--- | :--- |
| **HTML Element (Tag)** | Defines the structure, type of content, and behavior of a component. | `<iframe>`, `<div>`, `<button>`, `<h1>` |
| **CSS Class** | A reusable styling rule applied *to* HTML elements to change their appearance. | `.rounded-xl`, `.bg-white`, `.user-dropdown-container` |

In our code:
* `<iframe>` is the **element** that loads the external map.
* `className` (compiling to `class` in HTML) holds the **Tailwind CSS classes** that style that element.

---

## 3. How We Style the iframe

By applying CSS classes to the `<iframe>` element, we can control its dimensions, border, rounded corners, and even filter its color palette (e.g. inverting it for dark mode):

```html
<iframe 
  src="https://google.com/maps/..."
  className="w-full h-full rounded-xl border-0 invert"
/>
```

* **`w-full h-full`**: Sizing classes that force the iframe element to fill its parent box container.
* **`rounded-xl`**: Rounds the corners of the iframe.
* **`border-0`**: Removes the default browser border style.
* **`invert`**: A filter class applied to the iframe element to invert its pixel colors.
