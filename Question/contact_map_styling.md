# Map Styling & HTML iframes: A Beginner's Guide

Welcome! If you are new to web development, this guide is designed for you. It explains how our property map works, what an `<iframe>` is, and how we change its look dynamically using CSS filters.

---

## 1. What is an `<iframe>`? (The Window Analogy)

An `<iframe>` (short for **Inline Frame**) is a native **HTML element (tag)**. It is **not** a CSS class.

### 🏠 The Analogy:
Think of your webpage as a **wall** in your room. 
* An `<iframe>` is like a **window** cut into that wall, allowing you to look directly at another house (like Google Maps).
* The map content belongs to Google's servers, but the window frame's size, position, and color filter belong to your webpage.

---

## 2. HTML Tag vs. CSS Class (The Blueprint Analogy)

It is easy to confuse tags and classes when you start. Here is a simple way to remember:

* **HTML Tag (The Object)**: Defines *what* something is.
  * *Example*: `<iframe>` is a window, `<button>` is a button, `<h1>` is a header.
* **CSS Class (The Style)**: Defines *how* that object looks (color, border, shape).
  * *Example*: `rounded-xl` (rounds corners), `border-0` (removes borders), `invert` (flips colors).

### 🛠️ In our code:
We style the `<iframe>` tag using the `className` attribute:
```html
<iframe 
  src="https://google.com/maps/..."
  className="w-full rounded-xl border-0" 
/>
```

---

## 3. How We Style the Map for Dark Mode

By default, Google Maps has a bright white background. To make it fit a dark theme, we apply CSS filters dynamically using the theme state (`theme`):

```html
<iframe 
  src="..."
  className={`transition duration-300 ${
    theme === 'dark' ? 'invert contrast-125 grayscale opacity-85' : 'opacity-90'
  }`}
/>
```

Here is a simple breakdown of the dark mode filters we use:

1. **`invert`**: Flips all colors (white map backgrounds turn black, blue oceans turn orange/warm grey).
2. **`contrast-125`**: Increases contrast by 25% to make roads, labels, and boundaries easy to read.
3. **`grayscale`**: Removes all color saturation. This turns the inverted orange/red hues into a clean, professional charcoal slate theme.
4. **`opacity-85`**: Softens the brightness so the map matches the surrounding layout.

---

## 4. 🚀 Try It Yourself (DIY Example)

Here is a complete, minimal HTML page you can save as `test.html` on your desktop and open in your browser to see this color inversion in action!

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    /* Styling our map window container */
    .map-container {
      width: 400px;
      height: 300px;
      margin: 20px auto;
    }

    /* This class styles the map for Light Mode */
    .light-map {
      width: 100%;
      height: 100%;
      border: 0;
    }

    /* This class styles the map for Dark Mode */
    .dark-map {
      width: 100%;
      height: 100%;
      border: 0;
      filter: invert(100%) contrast(125%) grayscale(100%);
      opacity: 0.85;
      transition: filter 0.5s ease; /* smooth switch animation */
    }
  </style>
</head>
<body style="background-color: #222; text-align: center; color: white; font-family: sans-serif;">

  <h2>DIY Map Theme Test</h2>
  <p>Open this file in your browser to see a dark-mode styled map!</p>

  <div class="map-container">
    <!-- Change class to "light-map" to see standard map style -->
    <iframe 
      class="dark-map"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3581.428678502324!2d91.77660601502758!3d26.1500366834614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375a59336d3c26ab%3A0xc3fde9b8e88849ad!2sGS%20Rd%2C%20Guwahati%2C%20Assam!5e0!3m2!1sen!2sin!4v1650000000000!5m2!1sen!2sin"
      loading="lazy">
    </iframe>
  </div>

</body>
</html>
```
