# Google OAuth: Handling Returning Users vs. New Sign-Ups

Welcome! This guide explains how the backend server handles users logging in with Google:
1. **Returning Users**: Why they keep their roles and are never asked to choose again.
2. **New Sign-Ups**: How they choose their roles and get registered in the database.

---

## 1. The Database Flow (How the backend works)

Inside our backend code in [auth.controller.js](file:///f:/Web_D/Projects/Real_Estate_Website/backend/controllers/auth.controller.js) (lines 45 to 86), the Google OAuth process runs a lookup check.

### 🏠 The Guest List Analogy:
Think of your website as a private clubhouse.
* When someone knocks on the door with their Google ID:
  1. The host (Backend) checks the database guest list for their **Email**.
  2. **If they are on the guest list (Returning User)**: The host welcomes them inside immediately. Their membership role (Tenant or Manager) is already written on their file, so the host doesn't ask them what role they want.
  3. **If they are NOT on the guest list (New User)**: The host creates a new profile card for them. The host asks what role they want to sign up as (Tenant or Manager), writes it on their new card, and saves it in the database.

---

## 2. Code Breakdown

Here is the exact controller function in `auth.controller.js`:

```javascript
export const google = async (req, res, next) => {
    const { name, email, photo } = req.body;
    try {
        // 1. Search the database for a user with this email
        const user = await User.findOne({ email });

        // 2. If the user already exists (RETURNING USER)
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = user._doc;
            
            // Send back the existing user profile (which keeps their saved role!)
            return res
                .cookie('access_token', token, { httpOnly: true })
                .status(200)
                .json(rest);
        } 
        
        // 3. If the user does NOT exist (NEW REGISTRATION)
        else {
            const generatedPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            
            // Create a brand new user document
            const newUser = new User({
                username: name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),
                email,
                password: hashedPassword,
                avatar: photo,
                role: req.body.role || 'Tenant', // Assigns chosen role, or defaults to Tenant
            });
            
            await newUser.save();
            
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = newUser._doc;
            return res
                .cookie('access_token', token, { httpOnly: true })
                .status(200)
                .json(rest);
        }
    } catch (error) {
        next(error);
    }
};
```

### Why a Returning User is never modified:
Because the backend uses an `if (user)` conditional block:
* If the user is found, the server executes the code inside `if (user)` and immediately returns the response to the client.
* The `else` block (which handles creating new profiles and registering roles) is **never executed** for returning users.

---

## 3. UI Changes Summary (Sign In vs. Sign Up)

To align this backend logic with the frontend interface:

1. **On the Sign Up page (`SignUp.jsx`)**:
   - We call `<OAuth isSignUp={true} />`.
   - The button shows the modal so the user can declare their role (`Tenant` or `Manager`) before registering.
2. **On the Sign In page (`SignIn.jsx`)**:
   - We call `<OAuth />` (which defaults `isSignUp` to `false`).
   - The button logs them in immediately because the backend already has their role saved.
