const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "HogwartVoyages",
  password: "Am181719",
  port: "3001",
});

const http = require("http");
const { useId } = require("react");

const server = http.createServer(async (req, res) => {
  // setting required headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json");
  res.writeHead(200);

  // req 1. -> to sign in with entered email -----------------------------------------------------------------------------------
  if (req.method === "POST" && req.url === "/api/data") {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", async () => {
      const credentials = JSON.parse(data);
      const { email, password, username } = credentials;
      // create a query to check if the username exists and password matches.
      try {
        const result = await pool.query({
          text: "SELECT * FROM users WHERE email = $1",
          values: [email],
        });
        if (result.rows.length === 0) {
          // Username not found
          res.end(JSON.stringify({ error: "user error" }));
        } else {
          // Username found now check if password matches
          const correctPass = result.rows[0].password;
          if (correctPass === password) {
            res.end(JSON.stringify({ verified: result.rows[0].username }));
          } else {
            res.end(JSON.stringify({ error: "password error" }));
          }
        }
      } catch (err) {
        console.error("Error executing query:", err);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: "connection error" }));
      }
    });

    // req 2. -> to signup a new user --------------------------------------------------------------------------------------------
  } else if (req.method === "POST" && req.url === "/api/signup") {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", async () => {
      const credentials = JSON.parse(data);
      const { email, password, username } = credentials;
      try {
        const result = await pool.query({
          text: "SELECT * FROM users WHERE email = $1",
          values: [email],
        });
        if (result.rows.length === 0) {
          // Username not found and new user can be created
          pool
            .query({
              text: "INSERT INTO users (email, password, username) VALUES ($1, $2, $3)",
              values: [email, password, username],
            })
            .then(() => {
              res.end(JSON.stringify({ verified: username }));
            });
        } else if (result.rows[0].password !== "#4284902") {
          // Username found error
          res.end(JSON.stringify({ error: "username already exists" }));
        } else {
          // special condition to handle google sign-in
          res.end(JSON.stringify({ verified: username }));
        }
      } catch (err) {
        console.error("Error executing query:", err);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: "connection error" }));
      }
    });

    // req 3 -> to fetch hotels as per user query --------------------------------------------------------------------------------
  } else if (req.method === "POST" && req.url.startsWith("/api/searchhotels")) {
    const keyWord = new URL(
      req.url,
      `https://${req.headers.host}`
    ).searchParams.get("q");
    try {
      const res_name = await pool.query({
        text: "SELECT * FROM hotels WHERE name = $1",
        values: [keyWord],
      });
      const res_area = await pool.query({
        text: "SELECT * FROM hotels WHERE keyword = $1",
        values: [keyWord],
      });
      if (res_area.rows.length !== 0) {
        res.end(JSON.stringify(res_area.rows));
      } else if (res_name.rows.length !== 0) {
        res.end(JSON.stringify(res_name.rows));
      } else {
        res.end(JSON.stringify({ error: "no hotels" }));
      }
    } catch (err) {
      console.error("Error searching query", err);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "search error" }));
    }

    // req 4 -> to fetch flights as per user query --------------------------------------------------------------------------------
  } else if (
    req.method === "POST" &&
    req.url.startsWith("/api/searchflights")
  ) {
    const dep_city = new URL(
      req.url,
      `https://${req.headers.host}`
    ).searchParams.get("d");
    const arr_city = new URL(
      req.url,
      `https://${req.headers.host}`
    ).searchParams.get("a");
    const date = new URL(
      req.url,
      `https://${req.headers.host}`
    ).searchParams.get("date");
    const parsedDate = new Date(date).toISOString().slice(0, 10);
    try {
      const result = await pool.query({
        text: "SELECT * FROM flights WHERE departure_city = $1 AND arrival_city = $2 AND departure_date = $3",
        values: [dep_city, arr_city, parsedDate],
      });
      res.end(JSON.stringify(result.rows));
    } catch (err) {
      console.error("Error searching query", err);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "search error" }));
    }

    // req 5 -> search for a specific hotel --------------------------------------------------------------------------------------
  } else if (req.method === "POST" && req.url.startsWith("/api/gethotel")) {
    const hotel_id = new URL(
      req.url,
      `https://${req.headers.host}`
    ).searchParams.get("q");
    try {
      const result = await pool.query({
        text: "SELECT * FROM hotels WHERE id = $1",
        values: [hotel_id],
      });
      res.end(
        JSON.stringify({
          id:result.rows[0].id,
          name: result.rows[0].name,
          address: result.rows[0].address,
          price: result.rows[0].price,
          amenities: result.rows[0].amenities,
          rooms: result.rows[0].rooms,
          reviews: result.rows[0].reviews,
          numrev: result.rows[0].num_reviews,
          pic: result.rows[0].pic,
        })
      );
    } catch (err) {
      console.error("Error searching query", err);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "search error" }));
    }

    // req 6 -> to get a hotel rating -------------------------------------------------------------------------------------------
  } else if (req.method === "POST" && req.url.startsWith("/api/getrv")) {
    const hotel_id = new URL(
      req.url,
      `https://${req.headers.host}`
    ).searchParams.get("q");

    try {
      const result = await pool.query({
        text: "SELECT * FROM hotels WHERE id = $1",
        values: [hotel_id],
      });
      res.end(JSON.stringify({ reviews: result.rows[0].reviews }));
    } catch (err) {
      console.error("Error getting reviews");
      res.end(JSON.stringify({ error: "review not found" }));
    }
  }

  // req 7 -> to update a hotel rating ------------------------------------------------------------------------------------------
  else if (req.method === "POST" && req.url.startsWith("/api/postrv")) {
    const hotel_id = new URL(
      req.url,
      `https://${req.headers.host}`
    ).searchParams.get("q");
    const user_inputed_rating = new URL(
      req.url,
      `https://${req.headers.host}`
    ).searchParams.get("r");

    try {
      const result = await pool.query({
        text: "SELECT * FROM hotels WHERE id = $1",
        values: [hotel_id],
      });
      const num_reviews = parseInt(result.rows[0].num_reviews);
      const cur_rating = parseFloat(result.rows[0].reviews);
      const new_rating = parseFloat(user_inputed_rating);

      // Calculate the new average rating
      const update =
        (cur_rating * num_reviews + new_rating) / (num_reviews + 1);
      console.log("Updated rating:", update);

      // Round off the new average rating to a whole number
      const roundedUpdate = Math.round(update);

      // Update the hotel record with the new rating and number of reviews
      await pool.query({
        text: "UPDATE hotels SET reviews = $1, num_reviews = $2 WHERE id = $3",
        values: [roundedUpdate, num_reviews + 1, hotel_id],
      });

      res.end(JSON.stringify({ updated: "done" }));
    } catch (err) {
      console.error("Error updating reviews:", err);
      res.end(JSON.stringify({ updated: "not done" }));
    }

    // req 8 -> ADMIN req to update rooms in a hotel -------------------------------------------------------------------------------
  } else if (req.method === "POST" && req.url.startsWith("/api/adminup")) {
    // INFO: this is used just to update when the rooms become empty as in when guests checks out
    // situations where someone books a room are automated and rooms are updated automatically.
    const hotel_id = new URL(
      req.url,
      `https://${req.headers.host}`
    ).searchParams.get("q");
    const admin_id = new URL(
      req.url,
      `https://${req.headers.host}`
    ).searchParams.get("id");
    const update = new URL(
      req.url,
      `https://${req.headers.host}`
    ).searchParams.get("new");
    try {
      const result = await pool.query({
        text: "SELECT * FROM hotels WHERE id = $1",
        values: [hotel_id],
      });
      if (result.rows[0].admin_id !== admin_id) {
        // Validate the admin ID
        res.end(JSON.stringify({ error: "Invalid Admin ID" }));
      } else {
        await pool.query({
          text: "UPDATE hotels SET rooms = $1 WHERE id = $2",
          values: [update, hotel_id],
        });
        res.end(JSON.stringify({ updated: "done" }));
      }
    } catch (err) {
      console.error("Error updating rooms");
      res.end(JSON.stringify({ updated: "not done" }));
    }

    // req 9 -> To handle check-ins and update available rooms ---------------------------------------------------------------------
  } else if (req.method === "POST" && req.url.startsWith("/api/userup")) {
    // INFO: this is similar to req 8 except this recieves newly booked rooms amount and deducts it
    // from the available rooms.
    const hotel_id = new URL(
      req.url,
      `https://${req.headers.host}`
    ).searchParams.get("q");
    const update = new URL(
      req.url,
      `https://${req.headers.host}`
    ).searchParams.get("new");
    const username = new URL(
      req.url,
      `https://${req.headers.host}`
    ).searchParams.get("uid");
    const cindate = new URL(
      req.url,
      `https://${req.headers.host}`
    ).searchParams.get("in");
    const coutdate = new URL(
      req.url,
      `https://${req.headers.host}`
    ).searchParams.get("out");
    const parsedCinDate = new Date(cindate).toISOString().slice(0, 10);
    const parsedCoutDate = new Date(coutdate).toISOString().slice(0, 10);
    try {
      const result = await pool.query({
        text: "SELECT * FROM hotels WHERE id = $1",
        values: [hotel_id],
      });
      if (parseInt(result.rows[0].rooms) - parseInt(update) >= 0) {
        await pool.query({
          text: "UPDATE hotels SET rooms = $1 WHERE id = $2",
          values: [parseInt(result.rows[0].rooms) - parseInt(update), hotel_id],
        });
        const price = parseInt(update) * parseInt(result.rows[0].price);
        await pool.query({
          text: "UPDATE users SET hotelid = $1, payment = $2, cindate = $4, coutdate = $5 WHERE username = $3",
          values: [hotel_id, price, username, parsedCinDate, parsedCoutDate],
        });
        res.end(JSON.stringify({ updated: "done" }));
      } else {
        res.end(JSON.stringify({ updated: "Not Enough Rooms" }));
      }
    } catch (err) {
      console.error("a");
      res.end(JSON.stringify({ updated: "not done" }));
    }

    // add new api request above this line ---------------------------------------------------------------------------------------

  }
  else if (
    req.method === "POST" &&
    req.url.startsWith("/api/flightsuserup")
  ) {
    const airline = new URL(
      req.url,
      `https://${req.headers.host}`
    ).searchParams.get("q");
    const update = new URL(
      req.url,
      `https://${req.headers.host}`
    ).searchParams.get("new");
    const username = new URL(
      req.url,
      `https://${req.headers.host}`
    ).searchParams.get("uid");
    const date = new URL(
      req.url,
      `https://${req.headers.host}`
    ).searchParams.get("date");
    const parsedDate = new Date(date).toISOString().slice(0, 10);
   

    try {
      const result = await pool.query({
        text: "SELECT * FROM flights WHERE airline = $1",
        values: [airline],
      });
      const newseats = result.rows[0].available_seats - parseInt(update);
      if (newseats >= 0) {
        await pool.query({
          text: "UPDATE flights SET available_seats = $1 WHERE airline = $2",
          values: [newseats, airline],
        });

        const price = parseInt(update) * parseInt(result.rows[0].price);
        await pool.query({
          text: "UPDATE users SET hotelid = $1, payment = $2, cindate = $4, coutdate = $5 WHERE username = $3",
          values: [
            result.rows[0].airline,
            parseInt(price) * parseInt(update),
            username,
            result.rows[0].return_date,
          parsedDate,
          ],
        });
        res.end(JSON.stringify({ updated: "done" }));
      } else {
        res.end(JSON.stringify({ updated: "Not Enough seats" }));
      }
    } catch (err) {
      res.end(JSON.stringify({ updated: "not done" }));
    }

    // req 11 -> fetch user bookings
  }


  else if (req.method === "POST" && req.url.startsWith("/api/mybookings")) {
    const username = new URL(
      req.url,
      `https://${req.headers.host}`
    ).searchParams.get("q");
    try {
      const result = await pool.query({
        text: "SELECT * FROM users WHERE username = $1",
        values: [username],
      });
      res.end(JSON.stringify(result.rows[0]));
    } catch (err) {
      console.error("a");
      res.end(JSON.stringify({ updated: "not done" }));
    }

    // add new api request above this line ---------------------------------------------------------------------------------------
  }
  else if (
    req.method === "POST" &&
    req.url.startsWith("/api/suggestions_hotel")
  ) {
    const keyWord = new URL(
      req.url,
      `https://${req.headers.host}`
    ).searchParams.get("q");
    try {
      const query = `
        SELECT name
        FROM hotels
        WHERE name ILIKE $1
        LIMIT 10;`;

    const result = await pool.query(query, [`%${keyWord}%`]);
    const suggestions = result.rows.map((row) => row.name);
    res.end(JSON.stringify(suggestions));
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
    // req 13 -> fetch suggestions for flight (From)
  } else if (
    req.method === "POST" &&
    req.url.startsWith("/api/suggestions_flightfrom")
  ) {
    const keyWord = new URL(
      req.url,
      `https://${req.headers.host}`
    ).searchParams.get("q");
    try {
      const query = `
        SELECT departure_city
        FROM flights
        WHERE departure_city ILIKE $1
        LIMIT 10;`;

      const result = await pool.query(query, [`%${keyWord}%`]);
      const suggestions = result.rows.map((row) => row.departure_city);
      res.end(JSON.stringify(suggestions));
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
    // req 13 -> fetch suggestions for flight (To)
  } else if (
    req.method === "POST" &&
    req.url.startsWith("/api/suggestions_flightto")
  ) {
    const keyWord = new URL(
      req.url,
      `https://${req.headers.host}`
    ).searchParams.get("q");
    try {
      const query = `
        SELECT arrival_city
        FROM flights
        WHERE arrival_city ILIKE $1
        LIMIT 10;`;

      const result = await pool.query(query, [`%${keyWord}%`]);
      const suggestions = result.rows.map((row) => row.arrival_city);
      res.end(JSON.stringify(suggestions));
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }

  } else {
    res.statusCode = 404;
    res.end("Not found line 46");
  }
});

// port configuration
const port = 3002;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});