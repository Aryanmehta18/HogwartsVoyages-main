import { useEffect, useState } from "react";

const MyComponent = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // console.log("HEERE");
        const response = await fetch("api/data");
        const jsonData = await response.json();
        // console.log(response);
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  console.log(setData);
  //   console.log("herwe"); // temporary to see fetched data

  //   return <div>

  //   </div>;
};

export default MyComponent;
