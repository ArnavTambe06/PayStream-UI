# PayStream UI 🎨

> React dashboard for the PayStream payment orchestration system

[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite)](https://vitejs.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-cyan?logo=tailwindcss)](https://tailwindcss.com)
[![Deployed](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)]()

## Live Demo

🔗 https://paystream-ui.vercel.app (update after deploy)

## Backend API

🔗 https://github.com/ArnavTambe06/paystream-api

## Features

- JWT authentication (login + register)
- Wallet dashboard with real-time balance
- Deposit, withdraw, P2P transfer
- Transaction history with pagination
- Admin panel (users, audit logs, system stats)
- Dark theme, monospace font, responsive layout

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- Zustand (state management)
- Axios (API calls)
- React Router v6

## Setup

1. Clone the repo
   \`\`\`bash
   git clone https://github.com/ArnavTambe06/paystream-ui.git
   cd paystream-ui
   \`\`\`

2. Install dependencies
   \`\`\`bash
   npm install
   \`\`\`

3. Configure environment
   \`\`\`bash
   cp .env.example .env.local

   # Set VITE_API_BASE_URL to your backend URL

   \`\`\`

4. Run dev server
   \`\`\`bash
   npm run dev
   \`\`\`

## Project Structure

\`\`\`
src/
├── api/ ← Axios instance + interceptors
├── store/ ← Zustand auth store
├── pages/ ← Login, Register, Dashboard, Transactions, Transfer, Admin
├── components/ ← Layout, StatCard, TransactionTable, ProtectedRoute
└── App.jsx ← Routes
\`\`\`
