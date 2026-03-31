# Budgetly: Intelligent Financial Console

A modern, full-stack financial management application designed to eliminate "financial blindness." Unlike traditional reactive budgeting tools, **Budgetly** uses linear regression AI to forecast end-of-month balances based on real-time spending velocity. Budgetly is built for students and young professionals who need to know their "Daily Burn Rate." It features a sleek, dark-mode console aesthetic, smooth GSAP animations, and a robust PostgreSQL backend to ensure financial data is handled with mathematical precision.

---

## Key Features

### 1. AI Forecasting Engine
The "Brain" of the app. Using the **Linear Regression** formula $y = mx + b$, the app calculates your spending velocity ($m$). It detects whether your spending is accelerating or decelerating and projects your final balance for Day 30 of the month.

### 2. Envelope Budgeting & Visual Limits
Interactive UI components, including SVG gauge charts and progress bars, provide instant feedback on how much of your "envelope" is left for specific categories.

### 3. High-Performance Data Flow
* **Single Source of Truth:** Data is managed at the parent level and distributed via `useOutletContext` to prevent desync.
* **Parallel Fetching:** Optimized with `Promise.all` to load user profiles and transaction ledgers simultaneously, reducing perceived latency.

### 4. Zero-Trust Security
* **Stateful Auth:** Protected routes using JWT "digital wristbands."
* **Data Isolation:** Strict middleware ensures a user can only query data associated with their unique `UserID`.

---

## Architecture
1.  **The Client (React):** Handles UI components and local state (`useState`, `useEffect`).
2.  **The API (REST):** Facilitates JSON communication between the frontend and server.
3.  **The Server (Node/Express):** Manages routing, business logic, and authentication middleware.
4.  **The Database (PostgreSQL):** Stores relational data for Users and Expenses with strict schema enforcement.

---
> *"Budgetly doesn't just track where your money went; it acts as a financial GPS to tell you where your money is going."*
