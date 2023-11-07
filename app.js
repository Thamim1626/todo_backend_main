const express = require("express");
const app = express();

const path = require("path");
const { isValid, format } = require("date-fns");

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
    due_date = "",
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
      response.send("involid priority");
      response.status(400);
    }
    if (!categoryCheck) {
      response.send("involid category");
      response.status(400);
    }
  }
});

//API 2 get data with path parameters
app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getWithPathParamQuery = `
  select * 
  FROM todo
  Where id = ${todoId}
  `;
  const getWithPathParam = await db.get(getWithPathParamQuery);
  response.send(getWithPathParam);
});

// API 3 get method  path agenda
// work with date and time import the NPM module of date-fns

app.get("/agenda/", async (request, response) => {
  const { date } = request.query;
  const givenDate = new Date(date);
  var isDate = isValid(new Date(date));
  console.log(isDate);
  console.log(givenDate);
  console.log(givenDate.getFullYear());
  console.log(givenDate.getMonth() + 1);
  console.log(givenDate.getDate());
  //   if (isDate) {
  //     const filterWithDateQuery = `
  //       select *
  //       from todo
  //       where priority = '${"HIGH"}'
  //       `;
  //     const filterWithDate = await db.all(filterWithDateQuery);
  //     response.send(typeof format(new Date(date), "yyyy,MM,dd"));
  // }
});
