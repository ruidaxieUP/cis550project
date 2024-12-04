### Server and Redis Integration Guide

---

## **Server Setup**

### **Starting the Server**
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:8080`.

---

## **Redis Integration**

### **Setting Up Redis**
1. **Install Redis**:
   - For **MacOS**:
     ```bash
     brew install redis
     ```
   - For **Ubuntu**:
     ```bash
     sudo apt update
     sudo apt install redis-server
     ```
   - For **Windows**:
     Download and install Redis from [here](https://github.com/microsoftarchive/redis/releases).

2. **Start Redis**:
   ```bash
   redis-server
   ```

3. **Verify Redis is Running**:
   ```bash
   redis-cli ping
   ```
   Expected response:
   ```
   PONG
   ```

---

## **Redis Integration in the Server**

1. **Caching Workflow**:
   - The server uses Redis to cache responses for faster subsequent requests.
   - It checks for existing cached data before querying the database.

2. **Cache Key Examples**:
   - `person_<person_id>`: Stores details of a person.
   - `movies_page_<page>_filter_<filter>`: Stores paginated movie data.

---

## **Managing Redis Data**

### **Check Existing Data**
1. List all keys in Redis:
   ```bash
   redis-cli KEYS "*"
   ```

2. Get data for a specific key:
   ```bash
   redis-cli GET <key>
   ```

### **Delete Existing Data**
1. Delete a specific key:
   ```bash
   redis-cli DEL <key>
   ```

2. Delete all keys in Redis:
   ```bash
   redis-cli FLUSHALL
   ```

