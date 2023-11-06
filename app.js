const express = require("express");
const app = express();

const path = require("path");
const fnsdate = require("date-fns");

const dbPath = path.join(__dirname, "todoApplication.db");

const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

let db = null;

const initializeServerAndDb = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server localhost:3000 starting .....");
    });
  } catch (e) {
    process.exit(1);
    console.log(`error: ${e} found`);
  }
};

initializeServerAndDb();

app.use(express.json());
// API 1
app.get("/todos/", async (request, response) => {
  const {
    search_q = "",
    priority = "",
    status = "",
    category = "",
    dueDate = "",
  } = request.query;
  const todoCheckArray = [];
  const priorityCheckArray = ["HIGH", "MEDIUM", "LOW", ""];
  const statusCheckArray = [];
  const categoryCheckArray = ["WORK", "LEARNING", "HOME", ""];
  const dueDateCheckArray = [];

  const priorityCheck = priorityCheckArray.includes(priority);
  const categoryCheck = categoryCheckArray.includes(category);
  if (priorityCheck && categoryCheck) {
    const getWithFilterQuery = `
  SELECT *
  FROM todo
  WHERE 
    todo LIKE ? AND 
    priority LIKE ? AND
    status LIKE ? AND
    category LIKE ? ;
`;

    const getWithFilter = await db.all(getWithFilterQuery, [
      `%${search_q}%`,
      `%${priority}%`,
      `%${status}%`,
      `%${category}%`,
    ]);
    response.send(getWithFilter);
  } else {
    if (!priorityCheck) {
      console.log("involid priority");
    }
    if (!categoryCheck) {
      console.log("involid category");
    }
  }
});
