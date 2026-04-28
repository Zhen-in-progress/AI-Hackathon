# API Documentation

## Overview
This API is built using **FastAPI** to provide a range of endpoints for interacting with a Snowflake database. It includes functionalities for fetching order items, predicting orders, gifting items, and inserting data into Snowflake tables.

---

## Authentication
- **API Key**: Required for most endpoints as part of the URL path.

---

## Endpoints

### 1. **Fetch Order Items by Order ID**
**GET** `/get_order_items/order_id={order_id}/{api_key}`

#### Description:
Fetches details about order items for a specific `order_id`.

#### Parameters:
- **order_id** (string): The ID of the order.
- **api_key** (string): The API key for authentication.

#### Example Request:
```bash
GET /get_order_items/order_id=12345/your_api_key
```

#### Example Response:
```json
[
    {
        "product_name": "Product A",
        "product_id": "P123",
        "quantity": 2
    },
    {
        "product_name": "Product B",
        "product_id": "P456",
        "quantity": 1
    }
]
```

---

### 2. **Predict Orders**
**POST** `/store_reference={store_reference}/guest_count={guest_count}/{api_key}`

#### Description:
Predicts orders based on the store reference and guest count.

#### Parameters:
- **store_reference** (string): The store identifier.
- **guest_count** (integer): The number of guests.
- **api_key** (string): The API key for authentication.

#### Example Request:
```bash
POST /store_reference=store123/guest_count=3/your_api_key
```

#### Example Response:
```json
[
    {
        "product_name": "Product A",
        "product_id": "P123",
        "quantity": 3,
        "variant": [
            {"product_name": "Variant 1", "product_id": "P124"},
            {"product_name": "Variant 2", "product_id": "P125"}
        ]
    }
]
```

---

### 3. **Gift Item Recommendation**
**POST** `/gift/store_reference={store_reference}/{api_key}`

#### Description:
Fetches a gift recommendation based on the store reference and forecast value.

#### Parameters:
- **store_reference** (string): The store identifier.
- **api_key** (string): The API key for authentication.

#### Example Request:
```bash
POST /gift/store_reference=store123/your_api_key
```

#### Example Response:
```json
[
  {
    "PRODUCT_NAME": "Fruit Toast-1 Slc",
    "PRODUCT_ID": "f6019d76-0c6e-41b8-a97e-4a278d3d03ed",
    "CUSTOMER_VALUE": 350.400009156
  }
]
```

---

### 4. **Insert Data into Snowflake**
**POST** `/insert_data`

#### Description:
Inserts a record into the `ORDERS_TRAINING_TABLE` in Snowflake.

#### Query Parameters:
- **store_id** (string): The store identifier.
- **table_guest_count** (integer): The number of guests at the table.
- **order_id** (string): The order ID.
- **product_name** (string): The product name.
- **sequence_no** (integer): The sequence number.
- **day_name** (string): The day of the order.
- **product_tag** (string): A tag associated with the product.

#### Example Request:
```bash
POST /insert_data?store_id=store123&table_guest_count=4&order_id=12345&product_name=ProductA&sequence_no=1&day_name=Monday&product_tag=Special
```

#### Example Response:
```json
{
    "status": "success",
    "message": "Data inserted successfully"
}
```

---

## Helper Functions

### Database Connection Management
- **connect_database()**: Opens a connection to the Snowflake database.
- **disconnect_database()**: Closes the Snowflake connection.

### Query Utilities
- **each_seq_order(store_reference, guest_count, seq)**: Generates a product recommendation for a specific guest count and sequence.
- **get_product_map(product_name_set, store_reference)**: Maps product names to IDs.
- **insert_into_snowflake(data)**: Inserts data into Snowflake's `ORDERS_TRAINING_TABLE`.

---

## Error Handling
### Common Errors:
- **422 Unprocessable Entity**: Missing or invalid parameters.
- **404 Not Found**: Resource not found or invalid input.
- **500 Internal Server Error**: Unexpected server issues or database errors.

#### Example Error Response:
```json
{
    "detail": "An unexpected error occurred: Database connection failed"
}
```

---

## CORS Settings
The API is configured to allow CORS with the following settings:
- **allow_origins**: `[*]` (Allows all origins).
- **allow_credentials**: `True`.
- **allow_methods**: `[*]` (Allows all HTTP methods).
- **allow_headers**: `[*]` (Allows all headers).

---

## Environment Variables
Ensure the following environment variables are set:
- **connection_params**: A JSON string with Snowflake connection details (e.g., username, password, account, etc.).

---

## Dependencies
- **FastAPI**
- **Snowflake Connector for Python**
- **pandas**
- **python-dotenv**
- **CORS Middleware**

---

## Notes
- Ensure proper authentication and validation for API key usage.
- Secure environment variables to prevent unauthorized access.
- Optimize database queries for performance where necessary.

