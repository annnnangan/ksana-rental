<p align="center"><img src="https://github.com/user-attachments/assets/c260ee6b-3bdb-4707-965e-c63af1d25eef" height="auto" width="150"/></p>
<p align="center">Website: https://ksana-yoga-rental.site/</p>

![Image](https://github.com/user-attachments/assets/0e1e14fd-581a-4803-842c-f1991eeba972)

## Table of Contents
- [Project Overview](#project-overview)
- [Project Background](#project-background)
- [Tech Stack](#tech-stack)
- [Features](#features)
    - [Rental User](#rental-user)
    -  [Studio Owner](#studio-owner)
    -  [Admin](#admin)
- [Getting Started](#getting-started)
  
## Project Overview
Ksana Rental is a full-stack web application built entirely by **me** using Next.js with TypeScript. From design to deployment, this solo project showcases my skills in web development and my ability to manage both the frontend and backend.

## Project Background
As someone who practices spinning hammock, I often need to rent spaces for practice. Every time, I have to message the studio via Instagram DM to ask if the space is available, then wait for a reply. It’s not always clear what studios are available for rent, and sometimes double bookings happen.

From the studio owner’s side, managing bookings manually takes a lot of time — replying to every inquiry and sending out door codes by hand can be quite troublesome.

This website aims to streamline the entire process: users can easily check which studios are available and book them directly. The door code will be visible on the platform 2 hours before the booking starts, so owners don’t have to send it manually. This reduces miscommunication and helps both renters and studio owners save time.

## Tech Stack
- **Framework:** Next.js with Typescript
- **AI Chatbot**: Copilotkit
- **Style:** Tailwind, Shadcn UI
- **Data Fetching & Caching:** React Query
- **State Management:** Zustand
- **Form & Validation**: React Hook Form with Zod
- **Database:** Postgres, Knex
- **Authentication:** Next Auth
- **Payment**: Stripe
- **Email Service**: Resend
- **Image Storage**: AWS S3
- **Deployment:** AWS (EC2, Route53), Docker

## Features
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
</details>

<details><summary>☑️ Set regular business hour and specific date business hour to define the studio availability</summary>

https://github.com/user-attachments/assets/3ea74e03-295c-4941-bb64-f9d514ad1942
    
</details>


</details>

### Admin

<details><summary>☑️ Approve studio creation by studio owner</summary>
</details>

<details><summary>☑️ Manage weekly payout to studios</summary>
</details>


<details><summary>☑️ Manage homepage recommended studio list</summary>


https://github.com/user-attachments/assets/aa4f6b49-c1af-4ffe-a8cd-2e5de7bef107


</details>

## Getting Started
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
