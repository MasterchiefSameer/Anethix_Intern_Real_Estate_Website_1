# Google Auth: Restricting the Role Selection Modal

Welcome! This guide explains how we fixed the Google login flow so it only asks for a role (**Tenant** or **Manager**) during account creation (**Sign Up**) and bypasses it during normal logging in (**Sign In**).

---

## 1. The Problem

Originally, when a user clicked the "Continue with Google" button, the modal asking them to "Choose Account Type" popped up every single time—regardless of whether they were signing up for the first time or simply logging in.

### The Goal:
* **Sign Up Page**: Show the role selection modal so new users can choose their account type.
* **Sign In Page**: Skip the modal and log the user in immediately.

---

## 2. The Solution (Step-by-Step)

To solve this, we passed a custom flag parameter from the pages down to the Google button.

### Step A: Adding a Prop to the Button (`OAuth.jsx`)
We updated the `OAuth` component to accept a configuration prop named `isSignUp`. By default, we set it to `false`:

```javascript
const OAuth = ({ isSignUp = false }) => {
```

### Step B: Checking the Flag on Click
We created a new helper function named `handleButtonClick` that runs when the user clicks the button. It checks the value of `isSignUp`:

```javascript
const handleButtonClick = () => {
  if (isSignUp) {
    // If we are on the Sign Up page, open the role selection modal
    setShowModal(true);
  } else {
    // If we are on the Sign In page, bypass the modal and log in immediately
    handleGoogleClick(null);
  }
};
```

We then mapped this function to the button's `onClick` trigger:
```html
<button onClick={handleButtonClick} type='button'>
  continue with google
</button>
```

---

## 3. Page Integration

Now that the button is ready to receive the `isSignUp` flag, we updated the pages:

### 1. In `SignUp.jsx` (Registration Page)
We pass `isSignUp={true}` because this page is explicitly for creating new accounts:
```html
{/* Google SSO Option */}
<OAuth isSignUp={true} />
```

### 2. In `SignIn.jsx` (Login Page)
We keep the tag simple. Since we don't pass the prop, it automatically defaults to `false`:
```html
{/* Google SSO Option */}
<OAuth />
```
