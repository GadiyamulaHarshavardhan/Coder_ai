import psycopg2
from psycopg2 import sql
from datetime import datetime

# Database connection details
DB_CONFIG = {
    "dbname": "postgres",  # Your database name
    "user": "postgres",   # Your PostgreSQL username
    "password": "2486",  # Your PostgreSQL password
    "host": "127.0.0.1",  # Your database host
    "port": "5432",       # Your database port
}

# Connect to the database
def get_db_connection():
    conn = psycopg2.connect(**DB_CONFIG)
    return conn

# Create the chat history table
def create_chat_table():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS chat_history (
            id SERIAL PRIMARY KEY,
            user_message TEXT NOT NULL,
            ai_response TEXT NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    conn.commit()
    cur.close()
    conn.close()

# Insert a new chat into the database
def insert_chat(user_message, ai_response):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO chat_history (user_message, ai_response)
        VALUES (%s, %s);
    """, (user_message, ai_response))
    conn.commit()
    cur.close()
    conn.close()

# Fetch all chat history from the database
def fetch_chat_history():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM chat_history ORDER BY timestamp DESC;")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows

# Initialize the database (create table if it doesn't exist)
def initialize_db():
    create_chat_table()