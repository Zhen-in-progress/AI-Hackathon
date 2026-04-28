from fastapi import FastAPI, Query
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
import snowflake.connector
from dotenv import load_dotenv
import os
import pandas as pd

load_dotenv()


# Set your Snowflake connection parameters
def connect_database():
    global cursor, connection
    connection_params = json.loads(os.getenv("connection_params"))
    connection = snowflake.connector.connect(**connection_params)
    cursor = connection.cursor()


def disconnect_database():
    cursor.close()
    connection.close()


app = FastAPI()
# Configure CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # List of allowed origins, use "*" to allow all origins
    allow_credentials=True,  # Allow cookies or credentials
    allow_methods=["*"],  # List of allowed HTTP methods, use "*" for all
    allow_headers=["*"],  # List of allowed headers, use "*" for all
)


def each_seq_order(store_reference, guest_count, seq):
    queries = f"""
    SELECT FUNC_RECOMMEND_ITEMS_dia(
        {str(guest_count)},       
        '{store_reference}',   
        {str(seq)}           
    ) AS products;
    """
    cursor.execute(queries)
    # Fetch and print the results
    df = cursor.fetch_pandas_all()
    df['PRODUCTS'] = df['PRODUCTS'].apply(json.loads)
    sorted_probability = dict(sorted(df['PRODUCTS'][0]['probability'].items(), key=lambda item: item[1], reverse=True))
    recommended_item = list(sorted_probability.keys())[:3]
    print(df['PRODUCTS'])
    return recommended_item


def get_product_map(product_name_set, store_reference):
    # Convert the set to a comma-separated string for the SQL query
    product_names_str = ",".join(f"'{pid}'" for pid in product_name_set)
    # SQL query to fetch the mapping
    query = f"""
    SELECT DISTINCT order_items.product_id, order_items.product_name
    FROM order_items
    LEFT JOIN (
        SELECT * 
        FROM orders 
        WHERE store_id = '{store_reference}'
    ) filtered_orders
    ON order_items.order_id = filtered_orders.order_id
    WHERE order_items.product_name IN ({product_names_str});

    """
    # Execute the query and fetch results
    cursor.execute(query)

    # Build a dictionary from the query result
    product_map = {row[1]: row[0] for row in cursor.fetchall()}

    return product_map


# A GET request that accepts a query parameter
@app.get("/get_order_items/order_id={order_id}/{api_key}")
async def get_order_items(order_id, api_key):
    connect_database()
    queries = f"""
    select 
        product_name,
        product_id,
        CAST(quantity AS INT) as quantity
    from order_items
    where order_id = '{order_id}';
    """
    cursor.execute(queries)
    # Fetch and print the results
    df = cursor.fetch_pandas_all()
    res = df.to_dict(orient='records')
    res = [{key.lower(): value for key, value in record.items()} for record in res]
    disconnect_database()
    return res


# A POST request that accepts JSON payload and returns it
@app.post("/store_reference={store_reference}/guest_count={guest_count}/{api_key}")
async def predict_orders(store_reference, guest_count, api_key):
    try:
        if not api_key:
            raise HTTPException(status_code=422, detail="Missing or invalid api_key")
        if not store_reference or not guest_count:
            raise HTTPException(status_code=404, detail="Required parameters are missing")

        connect_database()
        guest_count = int(guest_count)
        products = {}
        products_name_set = set()
        for seq in range(1, guest_count + 1):
            items = each_seq_order(store_reference, guest_count, seq)
            if items[0] not in products:
                products[items[0]] = {"quantity": 0, "variant": items[1:3]}
            products[items[0]]["quantity"] += 1
            products_name_set.update(items)
            print(items, "items")
        print(products_name_set, "name_set")
        product_map = get_product_map(products_name_set, store_reference)
        print(product_map)
        res = [
            {
                "product_name": key,
                "product_id": product_map[key],
                "quantity": value["quantity"],
                "variant": [
                            {"product_name": value["variant"][0], "product_id": product_map[value["variant"][0]]},
                            {"product_name": value["variant"][1], "product_id": product_map[value["variant"][1]]}
                            ]
            } for key, value in products.items()
        ]
        disconnect_database()
        return res

    except ValueError as ve:
        raise HTTPException(status_code=404, detail=f"Invalid guest count: {str(ve)}")
    except snowflake.connector.Error as db_error:
        raise HTTPException(status_code=404, detail=f"Database error: {str(db_error)}")
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"An unexpected error occurred: {str(e)}")
    finally:
        try:
            disconnect_database()
        except Exception as disconnect_error:
            raise HTTPException(
                status_code=404, detail=f"Error during disconnect: {str(disconnect_error)}"
            )


@app.post("/gift/store_reference={store_reference}/{api_key}")
async def gift(store_reference,api_key):
    connect_database()
    queries = f"""
    SELECT 
        order_items.product_id,
        order_items.product_name,
        order_items.unit_price,
        orders.store_name,
        orders.store_id,
        (
            SELECT forecast * 12 
            FROM dia_db.public.My_forecasts_2024_12_20
            LIMIT 1
        ) AS customer_value
    FROM order_items
    LEFT JOIN orders
        ON order_items.order_id = orders.order_id
    WHERE order_items.belongs_to = '' 
        AND orders.store_id = '{store_reference}'
        AND order_items.unit_price < (
            SELECT forecast * 0.12 
            FROM dia_db.public.My_forecasts_2024_12_20
            LIMIT 1
        )
        AND order_items.unit_price > 0
    LIMIT 1;

    """
    cursor.execute(queries)
    # Fetch and print the results
    df = cursor.fetch_pandas_all()
    res = df[["PRODUCT_NAME", "PRODUCT_ID","CUSTOMER_VALUE"]].to_dict(orient="records")
    disconnect_database()
    return res


def insert_into_snowflake(data):
    try:
        # Establish a connection
        connect_database()
        # Prepare the INSERT statement
        query = """
        INSERT INTO ORDERS_TRAINING_TABLE (
            STORE_ID,
            TABLE_GUEST_COUNT,
            ORDER_ID,
            PRODUCT_NAME,
            SEQUENCE_NO,
            DAY_NAME,
            PRODUCT_TAG
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (
            data["STORE_ID"],
            data["TABLE_GUEST_COUNT"],
            data["ORDER_ID"],
            data["PRODUCT_NAME"],
            data["SEQUENCE_NO"],
            data["DAY_NAME"],
            data["PRODUCT_TAG"],
        ))

        # Commit transaction
        connection.commit()
        return {"status": "success", "message": "Data inserted successfully"}

    except snowflake.connector.Error as e:
        return {"status": "error", "message": str(e)}

    finally:
        # Close cursor and connection
        disconnect_database()


@app.post("/insert_data")
async def insert_data(
        store_id: str = Query(..., max_length=16777216),
        table_guest_count: int = Query(..., ge=0),
        order_id: str = Query(..., max_length=16777216),
        product_name: str = Query(..., max_length=16777216),
        sequence_no: int = Query(..., ge=0),
        day_name: str = Query(..., max_length=16777216),
        product_tag: str = Query(..., max_length=16777216)
):
    # Collect data into a dictionary
    data = {
        "STORE_ID": store_id,
        "TABLE_GUEST_COUNT": table_guest_count,
        "ORDER_ID": order_id,
        "PRODUCT_NAME": product_name,
        "SEQUENCE_NO": sequence_no,
        "DAY_NAME": day_name,
        "PRODUCT_TAG": product_tag,
    }

    # Insert data into Snowflake
    result = insert_into_snowflake(data)

    # Handle any errors
    if result["status"] == "error":
        raise HTTPException(status_code=500, detail=result["message"])

    # Return the result
    return result
