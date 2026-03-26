## Invoice App

## Project Overview -
The Invoicing App is a lightweight web-based applicationdesigned for small businesses and startups to create, manage, and print invoices with ease. The app simplifies the invoicing workflow by combining company setup, item catalog management, invoice creation, and reporting dashboardsin one simple solution.


## Core Features -
1. Signup & Login–Secure onboarding with company profile and user account creation.
2. Item Master–Central catalog to manage products and services with pricing and discounts.
3. Invoice Management–Create, edit, and track invoices with auto-calculated totals.
4. Dashboard–KPI cards, bar chart, and pie chart for quick insights.
5. Print & Export–Generate professional, print-ready invoices with company logo and currency symbol.


## Modules Overview -
[`Authentication`]
1. Signup - Register company and first user with profile details.
2. Login - Secure login with email and password.

[`Dashboard`]
1. KPI cards for quick insights
2. Visual analytics using:
  * Bar charts
  * Pie charts
3. Print & Export
4. Generate professional invoices
5. Print-ready and PDF-friendly format
6. Includes company logo and currency settings

[`Invoice Management`]
1. Invoice (List View) - View, search, and manage all invoices created. Mini Dashboard on top.
2. Invoice (Update) - Create or modify invoice with customer info and items.
3. Invoice (Print) - Generate PDF/print-friendly invoice layout.

[`Item Master`]
1. Item Master (List View) -Manage product and service catalog with pricing.
2. Item Master (Update) - Create or update item details with rate, discount, and picture.


## Tech Stack -
* Frontend: React.js (Vite)
* UI Library: Material UI (MUI) - free version
* State Management: Redux Toolkit (RTK) with Redux Persist
* API Handling: Axios (Api integrations)
* Charts: recharts (Bar & Pie charts)


## Project Setup -
# [`Install Dependencies`]
```bash
npm install
```


## [`Run Application`]
```bash
npm run dev:qa    ----    (QA Environment)
npm run dev:prod  ----    (Production Environment)
```


## Environment Configuration -
Create the following environment files in the root directory:
```bash
.env
.env.qa
.env.prod
```


## Environment Variables -
```bash
VITE_USE_MOCK_ENV=""
VITE_API_BASE_URL=""
VITE_API_CONTROLLERNAME=""
```


## Project Structure -

```bash
src/
│── assets/
│── components/
│── pages/
│── redux/
│── routes/
│── services/
│── utils
│── App.jsx
│── main.jsx
│── store.jsx
```


# --------- Thanks ---------