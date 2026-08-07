# Theme Matching & Tailwind Dark Mode: A Beginner's Guide

Welcome! If you are new to Tailwind CSS, this guide will help you understand how our Enquiry card switches color themes smoothly between Light and Dark modes.

---

## 1. How Does Class-Based Dark Mode Work?

In modern web development, websites track the user's theme choice (Light or Dark) and save it in the browser's storage (`localStorage`). 

* **Light Mode**: The page behaves normally.
* **Dark Mode**: A special class named `.dark` is added to the very top element of your site (the `<html>` or `<body>` tag).

Tailwind CSS looks at the root of your page. If it finds the `.dark` class, it activates all styles that start with the `dark:` prefix.

---

## 2. The Enquiry Card Class Breakdown

Here is the exact class line we use on our Enquiry card wrapper inside [PropertyContact.jsx](file:///f:/Web_D/Projects/Real_Estate_Website/client/src/pages/Customer/PropertyContact.jsx):

```html
<div className="bg-white dark:bg-[#24211e] text-slate-800 dark:text-gray-200 border border-slate-200 dark:border-[#302d29] shadow-md transition-colors duration-250">
```

Here is how the browser translates this code depending on the theme:

| Property | Light Mode (No `.dark` class at top) | Dark Mode (With `.dark` class at top) |
| :--- | :--- | :--- |
| **Card Background** | `bg-white` (Pure White) | `dark:bg-[#24211e]` (Charcoal Black) |
| **Text Color** | `text-slate-800` (Dark Charcoal) | `dark:text-gray-200` (Soft Off-White) |
| **Border Color** | `border-slate-200` (Light Grey line) | `dark:border-[#302d29]` (Dark Charcoal line) |

### Key Concept:
All classes starting with `dark:` acts as **conditional overrides**. They lie dormant in light mode, and wake up only when the `.dark` class is present on the page root.

---

## 3. 🚀 Try It Yourself (DIY Example)

Here is a single HTML file you can save as `theme_test.html` on your computer. Double-click it to open it in your browser, and click the **"Toggle Theme"** button to see how the card styles change instantly!

```html
<!DOCTYPE html>
<html id="root-html">
<head>
  <meta charset="UTF-8">
  <title>Tailwind Dark Mode Test</title>
  <!-- Load Tailwind CSS via CDN for our test -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    // Tell Tailwind to track dark mode classes on the <html> element
    tailwind.config = {
      darkMode: 'class',
    }

    // Function to add/remove the 'dark' class from the <html> root tag
    function toggleTheme() {
      const htmlElement = document.getElementById('root-html');
      htmlElement.classList.toggle('dark');
    }
  </script>
</head>
<body class="bg-slate-50 text-slate-800 dark:bg-[#12100e] dark:text-gray-200 min-h-screen p-8 transition-colors duration-300">

  <div class="max-w-md mx-auto flex flex-col gap-6 text-center">
    <h2 class="text-2xl font-bold">Tailwind v4 Theme Switcher Test</h2>
    
    <button 
      onclick="toggleTheme()" 
      class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition mx-auto cursor-pointer">
      Toggle Theme
    </button>

    <!-- The Enquiry Card Container -->
    <div class="bg-white dark:bg-[#24211e] text-slate-800 dark:text-gray-200 border border-slate-200 dark:border-[#302d29] shadow-lg rounded-2xl p-6 text-left transition-all duration-300">
      <h3 class="text-lg font-bold text-slate-900 dark:text-white">Enquire Now</h3>
      <p class="text-xs text-slate-500 dark:text-gray-400 mt-1">Get details and a callback from our advisor.</p>
      
      <div class="mt-4 flex flex-col gap-3">
        <div>
          <label class="text-[10px] font-bold text-slate-500 dark:text-gray-400 block mb-1 uppercase">Full Name</label>
          <input 
            type="text" 
            placeholder="Your name" 
            class="w-full bg-slate-50 border border-slate-300 dark:bg-[#1e1c19] dark:border-[#3e3a35] text-slate-800 dark:text-white rounded-lg px-3 py-2 text-xs outline-none"
          />
        </div>
      </div>
    </div>
  </div>

</body>
</html>
```
