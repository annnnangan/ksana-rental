<div align="center">
  <br />
    <a href="https://ksana-yoga-rental.site" target="_blank">
      <img src="https://github.com/user-attachments/assets/f02837e6-6b67-4303-80fb-c2fdc72a52ce" alt="Project Banner">
    </a>
  <br />
  <div>
    <img alt="Nextjs Badge" src="https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white">
    <img alt="Tailwind" src="https://img.shields.io/badge/postgresql-4169e1?style=for-the-badge&logo=postgresql&logoColor=white" />
    <img alt="Tailwind" src="https://img.shields.io/badge/-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  </div>
  <h3 align="center">🧘🏻‍♀️Ksana Rental🧘🏻‍♀</h3>

  <div align="center">
     Ksana Rental (https://ksana-yoga-rental.site/) is a full-stack platform for real-time yoga studio bookings, empowering owners to list spaces with flexible hours and per-timeslot pricing, and enabling users to book instantly without back-and-forth.
    </div>
</div>

## 📋 Table of Contents

- 🤖 [Project Background](#-project-background)
- ⚙️ [Tech Stack](#%EF%B8%8F-tech-stack)
- 📝 [Payment Notes](#-payment-notes)
- ✨ [Features](#-features)
  - [Rental User](#rental-user)
  - [Studio Owner](#studio-owner)
  - [Admin](#admin)
- 🗂️ [Folder Structure](#%EF%B8%8F-folder-structure)
- 🚩 [Getting Started](#-getting-started)

## 🤖 Project Background

As someone who practices spinning hammock, I often need to rent spaces for practice. Every time, I have to message the studio via Instagram DM to ask if the space is available, then wait for a reply. It’s not always clear what studios are available for rent, and sometimes double bookings happen.

From the studio owner’s side, managing bookings manually takes a lot of time — replying to every inquiry and sending out door codes by hand can be quite troublesome.

This website aims to streamline the entire process: users can easily check which studios are available and book them directly. The door code will be visible on the platform 2 hours before the booking starts, so owners don’t have to send it manually. This reduces miscommunication and helps both renters and studio owners save time.

## ⚙️ Tech Stack

- **Framework:** Next.js with Typescript
- **AI Chatbot**: Copilotkit
- **Style:** Tailwind, Shadcn UI
- **Data Fetching & Caching:** React Query
- **State Management:** Zustand
- **Form & Validation**: React Hook Form with Zod
- **Database:** Postgres, Knex
- **Authentication:** Next Auth
- **Payment**: Stripe
- **Email**: React Email with Resend
- **Image Storage**: AWS S3
- **Deployment:** AWS (EC2, Route53), Docker, GitHub Actions CI/CD

## 📝 Payment Notes

Stripe is in test mode so you could use the test card [here](https://docs.stripe.com/testing#cards) to complete the booking.

## ✨ Features

### Rental User

<details><summary>☑️ Search for yoga studios with criteria using the AI chatbot built with CopilotKit</summary>
  
https://github.com/user-attachments/assets/b965e798-e552-4754-891c-6ea90d4394eb

</details>

<details><summary>☑️ Search different yoga studios based on district, available date and time and equipment</summary>

https://github.com/user-attachments/assets/a119ce52-18ec-498c-a47c-a974496301f5

</details>

<details><summary>☑️ Check yoga studio's availability </summary>
  
https://github.com/user-attachments/assets/d59c1955-7bb1-49d8-afb6-b75b49b37626

</details>

<details><summary>☑️ Pay and book different yoga studio </summary>

https://github.com/user-attachments/assets/e93f48d2-46e8-4746-bcc0-a7ca52a15a03

</details>

<details><summary>☑️ Manage booking (view studio's door password 2 hours before the booking, cancel booking 24 hours before, leave review after booking) </summary>

https://github.com/user-attachments/assets/6a4776de-9f06-4c3c-8041-9da776e5af36

</details>

### Studio Owner

<details><summary>☑️ Seamlessly switching between rental user and studio owner and different studios</summary>

https://github.com/user-attachments/assets/076705e2-8f94-4bdf-9fae-9068d4548e9d

</details>

<details><summary>☑️ Easy to onboard yoga studio</summary>
    
https://github.com/user-attachments/assets/4e509633-dffe-4b7a-90b2-1855431d43d2

</details>

<details><summary>☑️ Set regular business hour and specific date business hour to define the studio availability</summary>
<br>

- In the example below, the studio has made Mondays unavailable for booking and has removed all timeslots originally set on Mondays.

https://github.com/user-attachments/assets/3343a270-ab77-4194-b11f-6af6529d1e86

<br>

- In the example below, although the studio is generally unavailable for booking on Mondays, it has specifically opened timeslots for May 5th. When users view the booking calendar, they will see that only May 5th (a Monday) has available timeslots.

https://github.com/user-attachments/assets/23b8689b-fb33-47f5-970d-22d358079488

</details>

</details>

### Admin

<details><summary>☑️ Approve studio creation by studio owner</summary>

https://github.com/user-attachments/assets/b4fc129d-32f4-42f4-99c2-94b1ec4e8c9f

</details>

<details><summary>☑️ Manage weekly payout to studios</summary>

https://github.com/user-attachments/assets/f890fca6-c825-4f55-be94-010bca99d309

</details>

<details><summary>☑️ Manage homepage recommended studio list</summary>

https://github.com/user-attachments/assets/aa4f6b49-c1af-4ffe-a8cd-2e5de7bef107

</details>

## 🗂️ Folder Structure

```
├── Dockerfile            #Docker file for building an image
├── docker-compose.yml    #Docker compose file
├── actions               #Next.js server actions
│   ├── admin.ts
│   ├── auth.ts
│   ├── booking.ts
│   └── studio.ts
├── app
├── (user)
│   ├── (non-booking)
│   │   ├── about
│   │   └── terms-and-conditions
│   │   ├── faq
│   │   ├── explore-studios       #Routes: Studio list page
│   │   ├── studio                #Routes: Studio details page
│   │   ├── bookmarks             #Routes: User bookmarks page
│   │   ├── manage-bookings       #Routes: User manage bookings
│   │   ├── page.tsx              #Routes: Homepage
│   └── booking                   #Routes: Booking related pages
│   ├── admin                     #Routes: Admin panel
│   ├── api                       #API
│   ├── auth                      #Routes: Auth
│   ├── studio-owner              #Routes: Studio owner panel
│   ├── (group)
│   │   ├── dashboard
│   │   ├── helps
│   │   └── studios
│   └── studio
│       └── [id]
│           ├── manage           #Routes: Studio panel
│           └── onboarding       #Routes: Studio onBoarding stpes
│   ├── favicon.ico
│   ├── fonts
│   ├── globals.css
│   ├── layout.tsx                #Global layout
│   ├── not-found.tsx             #Global not found layout
│   ├── QueryClientProvider.tsx
├── components
│   ├── animata                #Components from animata
│   ├── custom-components      #Own created components
│   └── shadcn                 #Components from shadcn
├── emails
│   ├── layout                 #Email layout
│   └── mail.ts                #Email configuration
├── hooks                      #React Hooks
│   ├── react-query
│   ├── use-mobile.tsx
│   └── use-session-user.tsx
├── lib
│   ├── constants
│   ├── handlers
│   ├── http-errors.ts     #Error format
│   ├── http-response.d.ts #Response format
│   ├── next-auth-config   #Next auth configuration
│   ├── utils              #Repeatly used functions
│   └── validations        #Zod validation schema
├── knexfile.js
├── middleware.ts          #Next.js Middleware
├── migrations             #Database migration
├── seeds                  #Database seed data
├── public                 #Local images
├── services               #PostgresSQL logic
├── stores                 #Zustand stores
├── tailwind.config.ts
```

## 🚩 Getting Started

To get a local copy up and running follow these simple example steps.

1. Apply to get API Key for the below services

- Stripe
- AWS S3
- Next Auth
- Resend
- Google Gemini
- Google OAuth
- Google Map

2. Create a `.env.local` file

   ```dosini
   POSTGRES_DB=
   POSTGRES_USER=
   POSTGRES_PASSWORD=
   POSTGRES_HOST=localhost
   NEXT_PUBLIC_STRIPE_PUBLIC_KEY=
   STRIPE_SECRET_KEY=
   AWS_BUCKET_NAME=
   AWS_BUCKET_REGION=
   AWS_ACCESS_KEY=
   AWS_SECRET_KEY=
   NEXT_PUBLIC_MAPS_API_KEY=
   NEXT_PUBLIC_MAP_ID=
   NEXTAUTH_SECRET=
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   RESEND_API_KEY=
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   GOOGLE_API_KEY=
   ```

3. Install yarn packages
   ```sh
   yarn install
   ```
4. Go to migration > 20241105144644_create-user.js and generate new hashed password for sample user data
   ```sh
   import bcrypt from "bcryptjs";
   const password = "12345678"
   const saltRounds = 10
   const result = await bcrypt.hash(password, saltRounds);
   ```
5. Run knex migrate and knex seed to preapre sample database and data
   ```sh
   yarn knex migrate:latest
   yarn knex seed:run
   ```
6. Start the server
   ```sh
   yarn start
   ```
