
# Project Movie People DB (MPDB)

This project is a React client application built with Vite. Movies are the work of people, and people collaborate to create masterpieces. The website presents movie-related data with the emphasis on the actors, the actresses, the directors, and their relationships. Below are the steps to get the client up and running.

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)


## Getting Started

## **Client Setup**

1. **Navigate to the client directory:**

   ```bash
   cd your-repo-name/client
   ```

2. **Install dependencies:**

   Make sure all required packages are installed by running:

   ```bash
   npm install
   ```

3. **Start the client:**

   Use the following command to start the development server:

   ```bash
   npm run dev
   ```

4. **Access the application:**

   Open your browser and navigate to:

   ```
   http://localhost:5173
   ```

   This URL may differ if you have configured Vite to run on a different port.


---

## **Server Setup**

### **Starting the Server**
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   node server.js
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
   redis-cli KEYS *
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



## Troubleshooting

If you encounter any issues while running the client, try deleting `node_modules` and `package-lock.json`, then reinstalling dependencies with:

```bash
rm -rf node_modules package-lock.json
npm install
```

Happy coding!
