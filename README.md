# Tester Quick Guide

This guide outlines the setup, test credentials, and core flows of the core banking app.

## Prerequisites

- **Node.js**: 18 or higher
- **Yarn**: Latest version
- **Port**: 3000 (must be free)
- **Browser**: Any modern browser (Chrome, Firefox, Edge)

## Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Create a `.env.local` file in the project root with the following:

   ```bash
   NEXT_PUBLIC_APP_BASEURL=http://localhost:3000
   NEXT_PUBLIC_APP_TIMEOUT=10000
   NEXT_PUBLIC_APP_BENEFICIARY_ACCOUNT=9674860857
   NEXT_PUBLIC_APP_BENEFICIARY_NAME=Chukwudi Nweze
   ```

3. Install dependencies and start the development server:

   ```bash
   yarn install
   yarn dev
   ```

4. Open `http://localhost:3000` in your browser.

## Test Login Credentials

- **Phone Number**: `08060281867`
- **Password**: `Password@123`

Upon successful login, a token is stored in `sessionStorage["switchAppToken"]`.

## Core Flows to Verify

### 1. Login

- **URL**: `http://localhost:3000`
- **Action**: Enter the test credentials.
- **Expected**:
  - Redirects to the app.
  - Navbar displays the user’s name.
  - Token is set in `sessionStorage`.
- **Negative Test**:
  - Invalid credentials display an error toast and remain on the login page.

### 2. Accounts List (`/accounts`)

- **Expected**: Displays a list of mock accounts with balances and status badges.
- **Filters**: Test the dropdown with options: `savings`, `current`, `loan`, `active`, `inactive`, `suspended`, `ngn`, `usd`, `positive`, `negative`.
- **Sorting**: Test sorting by: `balance`, `lasttransactiondate`, `accountname`, `accounttype`, `status`.
- **Action**: Click an account card to navigate to its transaction history.

### 3. Transaction History (`/accounts/{accountId}/transaction-history`)

- **Filters**: Test filtering by:
  - Type: `Credit`, `Debit`
  - Category: `Salary`, `Withdrawal`, `Transfer`
  - Date range
  - Search box
- **Sorting**: Test sorting by: `date`, `amount`, `type`, `category`, `reference`, `beneficiaryAccount`, `id`, `description`.
- **Export**: Click the export button.
  - **Expected**: Downloads `transactions.csv` with headers matching the table and rows reflecting applied filters/sort.

### 4. Transfer

- **URL**: On `/accounts`, click “Transfer” to open the modal.
- **Form**:
  - **Source Account**: Select any account from the list.
  - **Amount**: Enter e.g., `1000` (must be > 0 and ≤ account balance).
  - **Beneficiary Account Number**: Use `9674860857` for successful lookup; any other 10-digit number fails.
  - **Description**: Optional.
- **Action**: Submit the form, then confirm in the next modal.
- **Expected**:
  - Success modal appears.
  - Source account balance decreases.
  - A new `Debit` “Transfer” transaction appears in the account’s transaction history.
- **Negative Tests**:
  - Invalid beneficiary: Shows “Beneficiary account not found” error.
  - Insufficient funds: Shows “Insufficient funds” error.
  - Amount ≤ 0: Shows “Invalid amount” error.

### 5. Logout

- **Action**: Click “Sign Out” in the navbar.
- **Expected**:
  - `sessionStorage` is cleared.
  - Redirects to `/auth/login`.

## Notes

- **Authentication**: Protected API calls require the token. If missing or expired, the app redirects to `/auth/login`.
- **Data**: All data is mocked in-memory. Restarting the dev server resets all data.
- **CSV Export**: Ensure exported CSV matches the on-screen filters and sort order.
- **Environment**: Ensure `.env.local` is correctly configured to avoid runtime errors.
