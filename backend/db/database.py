import psycopg2
from psycopg2 import sql
from datetime import datetime
import hashlib  # For password hashing

# Database connection details
DB_CONFIG = {
    "dbname": "postgres",
    "user": "postgres",
    "password": "2486",
    "host": "127.0.0.1",
    "port": "5432",
}

# Connect to the database
def get_db_connection():
    conn = psycopg2.connect(**DB_CONFIG)
    return conn

# Password hashing function
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# Create all tables
def create_tables():
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Create chat history table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS chat_history (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            user_message TEXT NOT NULL,
            ai_response TEXT NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    
    # Create users table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password_hash VARCHAR(64) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login TIMESTAMP
        );
    """)
    
    # Create sessions table for tracking active logins
    cur.execute("""
        CREATE TABLE IF NOT EXISTS sessions (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            session_token VARCHAR(64) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            expires_at TIMESTAMP NOT NULL
        );
    """)
    
    conn.commit()
    cur.close()
    conn.close()

# User registration function
def register_user(username, email, password):
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        password_hash = hash_password(password)
        cur.execute("""
            INSERT INTO users (username, email, password_hash)
            VALUES (%s, %s, %s)
            RETURNING id;
        """, (username, email, password_hash))
        
        user_id = cur.fetchone()[0]
        conn.commit()
        return user_id
    except psycopg2.IntegrityError as e:
        conn.rollback()
        if 'username' in str(e):
            raise ValueError("Username already exists")
        elif 'email' in str(e):
            raise ValueError("Email already exists")
        else:
            raise ValueError("Registration failed")
    finally:
        cur.close()
        conn.close()

# User login function
def login_user(email_or_username, password):
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Check if input is email or username
        if '@' in email_or_username:
            cur.execute("""
                SELECT id, password_hash FROM users 
                WHERE email = %s;
            """, (email_or_username,))
        else:
            cur.execute("""
                SELECT id, password_hash FROM users 
                WHERE username = %s;
            """, (email_or_username,))
        
        user = cur.fetchone()
        
        if not user:
            raise ValueError("User not found")
            
        user_id, stored_hash = user
        input_hash = hash_password(password)
        
        if input_hash != stored_hash:
            raise ValueError("Incorrect password")
            
        # Update last login time
        cur.execute("""
            UPDATE users 
            SET last_login = CURRENT_TIMESTAMP
            WHERE id = %s;
        """, (user_id,))
        
        conn.commit()
        return user_id
    finally:
        cur.close()
        conn.close()

# Get user by ID
def get_user_by_id(user_id):
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute("""
        SELECT id, username, email, created_at, last_login 
        FROM users 
        WHERE id = %s;
    """, (user_id,))
    
    user = cur.fetchone()
    cur.close()
    conn.close()
    
    if not user:
        return None
        
    return {
        'id': user[0],
        'username': user[1],
        'email': user[2],
        'created_at': user[3],
        'last_login': user[4]
    }

# Insert a new chat (updated with user_id)
def insert_chat(user_id, user_message, ai_response):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO chat_history (user_id, user_message, ai_response)
        VALUES (%s, %s, %s);
    """, (user_id, user_message, ai_response))
    conn.commit()
    cur.close()
    conn.close()

# Fetch chat history for a specific user
def fetch_user_chat_history(user_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT * FROM chat_history 
        WHERE user_id = %s
        ORDER BY timestamp DESC;
    """, (user_id,))
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows

# Initialize the database
def initialize_db():
    create_tables()

# Example usage
if __name__ == "__main__":
    initialize_db()
    