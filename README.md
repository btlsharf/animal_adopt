# Animal-Adopt

> An animal adoption web app built with the MEN stack (MongoDB, Express, Node, EJS). Users can sign up, list animals for adoption, view animal and owner profiles, and favorite animals.

---

## Screenshot / Logo

///////////////////////

---

## Project name

**Animal-Adopt**

### Short description

Animal‑Adopt is a simple, polished CRUD web application that allows users to create accounts, list animals for adoption, view animal details and owner profiles, and save favorites. The app uses EJS for server-side rendering and session-based authentication. Authorization prevents guests from creating/updating/deleting content they don't own.

---

## Links

* **Deployed app**: *(Add your deployed URL here)*
* **Planning board (Trello)**: *(Add Trello link here)*
* **GitHub repo**: *(Add GitHub repo link here)*

---

## requirements mapping (MVP checklist)

* EJS templates for views: ✅
* Session-based auth: ✅
* File structure follows course conventions: ✅
* At least two entities (User + Animal) with relationships: ✅
* Full CRUD for animals (create/read/update/delete): ✅
* Authorization: only owners may edit/delete their animals; only signed-in users can create/favorite animals: ✅
* Deployed online: ✅ (add deployment link)



## Relationships / ERD (textual)

* **User 1 — * N Animal**: a User can own many Animals; each Animal belongs to one User.
* **User M — * M Animal (favorites)**: a User can favorite many Animals; an Animal can be favorited by many Users. Implemented by `favorites` array on User (or by a separate `Favorite` join collection).

(Attach an image ERD in Trello card / repo later.)

---

## User stories (MVP)

* As a **guest**, I want to view a list of animals so that I can browse adoption options.
* As a **guest**, I want to view an animal’s details and the owner's public profile so I can learn more.
* As a **visitor**, I want to sign up so I can list animals for adoption.
* As a **signed-in user**, I want to create an animal listing so I can offer an animal for adoption.
* As an **owner**, I want to edit or delete my animal listings so I can update info or remove animals once adopted.
* As a **signed-in user**, I want to favorite animals so I can save ones I’m interested in.
* As an **owner**, I want to view contact info for users interested in my animal (or have an inquiry form) so I can be contacted.

### Stretch user stories

* As a **user**, I want to upload images directly from my device and crop them.
* As a **user**, I want to search and filter animals by species, age, distance, and vaccination status.
* As a **user**, I want email notifications when someone favorites or requests to adopt my animal.
* As a **user**, I want to add adoption status updates and a short adoption story.

---

## Wireframes (text descriptions — add visual PNGs to Trello)

1. **Landing / Animals index**: header with nav (Home, Browse, My Profile, Log In / Sign Up). Grid of animal cards (image, name, species, short desc, 'View' button). Filters sidebar or top.
2. **Animal show page**: large photo gallery, details (age, vaccinated, spayed/neutered, description), owner card with contact info or message button, favorite button.
3. **New / Edit animal**: form with inputs for name, species, breed, age/DOB, booleans, pictures upload or URL inputs, status.
4. **User profile**: owner's public profile (username, bio, contactNumber), list of animals they own, favorites.
5. **Auth pages**: sign up, sign in forms.

---

## Routes / Endpoints (RESTful)

### Auth

* `GET /signup` — signup form
* `POST /signup` — create user
* `GET /login` — login form
* `POST /login` — create session
* `POST /logout` — destroy session

### User

* `GET /users` — (optional admin) list users
* `GET /users/:id` — view user profile and their animals
* `GET /profile` — view signed-in user's profile (private)
* `GET /profile/edit` `PUT /profile` — edit profile

### Animal

* `GET /animals` — index (with query params for filtering)
* `GET /animals/new` — new animal form (auth required)
* `POST /animals` — create animal (auth required)
* `GET /animals/:id` — show animal
* `GET /animals/:id/edit` `PUT /animals/:id` — edit animal (auth + ownership required)
* `DELETE /animals/:id` — delete animal (auth + ownership required)

### Favorites / Interactions

* `POST /animals/:id/favorite` — add to signed-in user's favorites
* `POST /animals/:id/unfavorite` — remove from favorites
* `GET /favorites` — list signed-in user's favorites

### Optional

* `POST /animals/:id/inquiry` — message owner (stores inquiry / sends email)

---

## Authorization rules

* Guests (not signed in) can only `GET` index & show pages.
* Only signed-in users can `POST /animals`, `POST /favorites`.
* Only the `owner` of an animal can access edit/delete routes (`GET /:id/edit`, `PUT`, `DELETE`).
* Only the owner can see contact details beyond a public username (or use an inquiry form).

---

## Validation & Security

* Validate required fields server-side and client-side.
* Escape untrusted data in EJS templates to prevent XSS.
* Use `express-session` with `connect-mongo` and secure cookie settings in production.
* Rate-limit (optional) or CAPTCHA on sign-up to prevent abuse.
* Use HTTPS in production.

---

## File / Project structure (suggested)

---

## Seed data

* Provide a `seed.js` to create:

  * 2 demo users (hashed passwords)
  * 6 demo animals (varied species & statuses)

---

## Testing checklist

* [ ] Sign up and sign in as a new user.
* [ ] Create a new animal listing (with and without pictures).
* [ ] Edit an animal (owner only).
* [ ] Delete an animal (owner only).
* [ ] Favorite/unfavorite an animal.
* [ ] Ensure guest cannot access create/edit/delete pages.
* [ ] Ensure images have alt text.
* [ ] Forms prefill on edit pages.
* [ ] Responsive layout on mobile and desktop.

---

## Accessibility & UI notes

* Use semantic HTML and alt attributes for images.
* Ensure color contrast meets WCAG AA.
* Make interactive elements keyboard-accessible.

---

## Next steps / Stretch goals

* Image uploads + cropping with Cloudinary.
* Full-text search & filters (species, age range, distance).
* Soft delete & restore for animals.
* Messaging system between users (in-app messages).
* Email notifications for inquiries (SendGrid).
* Admin dashboard for site moderation.

---

## Attribution

List libraries, tutorials, icons, or images used that require attribution here.

---

## Notes to instructor

This README includes planning artifacts required for the MEN Stack CRUD project: MVP user stories, ERD, wireframe descriptions, route list, and deployment instructions. Visual ERD and wireframes are attached on the project Trello board.

---
