export const fetchData = async (endpoint, setData) => {
    try {
      const response = await fetch(`http://localhost:8080/api/${endpoint}`);
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
    }
  };
