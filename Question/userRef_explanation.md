# Understanding `userRef` in the Real Estate Application

In this project, `userRef` is a crucial identifier that links **Property Listings** back to the **Users (Landlords or Agents)** who created them. It serves as a relational foreign key in the application's MERN-stack architecture.

---

## 🔑 1. Database Modeling Context
In the database schema defined at [listing.model.js](file:///f:/Web_D/Projects/Real_Estate_Website/backend/models/listing.model.js#L53-L56), the `userRef` property is saved as a required `String` value:

```javascript
userRef: {
  type: String,
  required: true,
}
```
This field stores the unique MongoDB ObjectID (`_id`) of the user who owns the listing.

---

## 🛠️ 2. Frontend Usage Across JSX Components

Here is how `userRef` is processed dynamically in different client components:

### 📄 A. Creating Property Listings: [CreateListing.jsx](file:///f:/Web_D/Projects/Real_Estate_Website/client/src/pages/Customer/CreateListing.jsx#L168)
When submitting the creation form, the client attaches the logged-in user's database ID (`currentUser._id`) as the `userRef` key:

```javascript
body: JSON.stringify({
  ...formData,
  userRef: currentUser._id, // Assigns listing ownership to the logged-in user
}),
```

---

### 📄 B. Viewing Detailed Listings: [Listing.jsx](file:///f:/Web_D/Projects/Real_Estate_Website/client/src/pages/Customer/Listing.jsx)
When displaying a listing details page, the app checks if the viewing user is the one who created it.
If the current user is **not** the landlord (i.e. `currentUser._id !== listing.userRef`), the UI displays a "Contact Landlord" trigger button:

```javascript
{currentUser && listing.userRef !== currentUser._id && !contact && (
  <button onClick={() => setContact(true)}>
    Contact landlord
  </button>
)}
```

---

### 📄 C. Contacting Landlords: [PropertyContact.jsx](file:///f:/Web_D/Projects/Real_Estate_Website/client/src/pages/Customer/PropertyContact.jsx#L14)
When the visitor clicks "Contact landlord", the contact drawer requests the landlord's contact information (email/username) from the backend user API, using `listing.userRef` as the path parameter:

```javascript
useEffect(() => {
  const fetchLandlord = async () => {
    try {
      const res = await fetch(`/api/user/${listing.userRef}`); // Querying user metadata by their ID
      const data = await res.json();
      setLandlord(data);
    } catch (error) {
      console.log(error);
    }
  };
  fetchLandlord();
}, [listing.userRef]);
```

Once the landlord data loads, the component renders a `mailto:` link allowing direct emails to the landlord:
```javascript
to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
```
