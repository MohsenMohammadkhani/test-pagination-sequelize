require("dotenv").config();
const express = require("express");
const { Op } = require("sequelize");
const Model = require("./model");
const app = express();
const port = 4000;

app.get("/data", async (req, res) => {
  const page = parseInt(req.query.page);
  const number = parseInt(req.query.number);
  const offset = (page - 1) * number;

  const optionsForFindAndCountAll = {
    limit: number,
    offset: offset,
  };

  if (req.query.email) {
    optionsForFindAndCountAll["where"] = {
      email: {
        [Op.like]: `${req.query.email}%`,
      },
    };
  }

  const { count, rows } = await Model.findAndCountAll(
    optionsForFindAndCountAll
  );

  const countPage = Math.ceil(count / number);

  const data = rows.map((position) => {
    return position.dataValues;
  });

  const response = {
    count,
    countPage,
    data,
  };
  if (page > 1) {
    response["prevPage"] = `http://localhost:4000/data?page=${
      page - 1
    }&number=${number}`;
  }
  response["nextPage"] = `http://localhost:4000/data?page=${
    page + 1
  }&number=${number}`;

  res.send(response);
});

app.listen(port);
