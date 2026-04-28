# I'm Feeling Happy — Smart Food Ordering

An AI-powered "random order" button that eliminates menu decision fatigue. Embedded as a widget into a restaurant's ordering flow, it predicts the best dishes for your party size using a Snowflake ML model and fills the cart instantly.

---

## How It Works

1. The widget is embedded via URL params (`store_id`, `number_of_people`).
2. Clicking **"I'm Feeling Happy"** calls the FastAPI backend, which queries a Snowflake ML function (`FUNC_RECOMMEND_ITEMS_dia`) to rank dishes by predicted popularity.
3. The recommended items — with quantities scaled to party size — are returned and rendered in a cart preview.
4. A **Gift** flow lets managers offer a complimentary low-cost item based on the store's forecast value.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS |
| State | Zustand |
| Backend | Python, FastAPI, Uvicorn |
| Database | Snowflake (via `snowflake-connector-python`) |
| Data | pandas |

---

## Project Structure

```
.
├── api/                        # FastAPI backend
│   ├── random_button_api.py    # All API endpoints
│   ├── api_doc.md              # Full API documentation
│   ├── requirements.txt        # Python dependencies
│   └── .env.example            # Backend env vars template
├── src/app/
│   ├── page.tsx                # Main widget (home)
│   ├── manager/page.tsx        # Manager gift view
│   ├── sign-up/page.tsx        # Sign-up flow
│   ├── components/             # UI components
│   ├── stores/                 # Zustand stores + API calls
│   └── utils/                  # Helpers
├── public/
│   └── gift.gif
└── .env-example                # Frontend env vars template
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- Python 3.10+
- Access to a Snowflake account with the required schema

---

### Frontend Setup

1. Copy the env template and fill in your values:

```bash
cp .env-example .env.local
```

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_API_KEY=your_api_key
NEXT_PUBLIC_REDIRECT_URL=your_redirect_url
```

2. Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The widget accepts URL params:
```
http://localhost:3000?store_id=<store_id>&number_of_people=<count>
```

---

### Backend Setup

1. Create and activate a virtual environment:

```bash
cd api
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install fastapi uvicorn snowflake-connector-python pandas python-dotenv
```

3. Copy the env template and add your Snowflake credentials:

```bash
cp .env.example .env
```

```env
connection_params={"user":"...","password":"...","account":"...","warehouse":"...","database":"...","schema":"..."}
```

4. Start the server:

```bash
uvicorn random_button_api:app --reload
```

API runs at [http://localhost:8000](http://localhost:8000). Interactive docs at [http://localhost:8000/docs](http://localhost:8000/docs).

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/get_order_items/order_id={id}/{api_key}` | Fetch items for an existing order |
| `POST` | `/store_reference={ref}/guest_count={n}/{api_key}` | Predict order for a party |
| `POST` | `/gift/store_reference={ref}/{api_key}` | Get gift item recommendation |
| `POST` | `/insert_data` | Log a completed order to Snowflake training table |

See [`api/api_doc.md`](api/api_doc.md) for full request/response schemas.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
