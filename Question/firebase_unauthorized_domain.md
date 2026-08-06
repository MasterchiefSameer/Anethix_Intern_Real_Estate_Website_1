# Firebase OAuth: Error (auth/unauthorized-domain)

When setting up Google Sign-In or other OAuth providers via Firebase in a web application, you may encounter the following error in your browser console:

```text
FirebaseError: Firebase: Error (auth/unauthorized-domain).
```

This guide explains why this error occurs and provides step-by-step instructions on how to resolve it.

---

## Why This Error Occurs

For security reasons, Firebase Authentication restricts login requests to a whitelisted set of domains. When a user clicks **Continue with Google**, the client-side Firebase SDK initiates an OAuth redirect popup or redirect flow.

Before completing the sign-in, Firebase validates the request's origin against its list of authorized domains:
* If the request originates from an **authorized domain** (e.g., `localhost` or your Firebase App domain), the login succeeds.
* If the request originates from a domain **not listed** in the Firebase console (such as your newly deployed staging or production URL like `anethix-intern-real-estate-website-1.onrender.com`), Firebase blocks the request and throws the `auth/unauthorized-domain` exception.

---

## How to Resolve the Error

To allow your deployed application to log in users using Google, you must whitelist your custom deployment domain inside the Firebase console.

### Step 1: Locate Your Production Domain
Identify the exact domain where your app is hosted.
* **Example**: `anethix-intern-real-estate-website-1.onrender.com`
* *Note: Do not copy the protocol (`https://`) or paths (`/sign-in`). Copy only the domain name.*

### Step 2: Navigate to Firebase Settings
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your project card.
3. Click on **Authentication** under the *Build* section in the left sidebar menu.
4. Click on the **Settings** tab located at the top of the Authentication screen.

### Step 3: Add the Authorized Domain
1. In the Settings side menu, click on **Authorized domains**.
2. Click the **Add domain** button.
3. Enter your domain: `anethix-intern-real-estate-website-1.onrender.com`
4. Click **Add** to save changes.

### Step 4: Verify the Resolution
1. Wait 10 to 30 seconds for Firebase’s configuration to propagate globally.
2. Clear your browser cache or refresh the page on your deployed site.
3. Attempt to sign in via Google. The authorization popup will load and authenticate successfully.
