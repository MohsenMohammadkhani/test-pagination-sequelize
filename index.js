require("dotenv").config();
const express = require("express");
const { Op } = require("sequelize");
const Model = require("./model");
const app = express();
const port = 4000;

app.get("/data", async (req, res) => {
  const page = parseInt(req.query.page);
  const number = parseInt(req.query.number);
  const countItems = await getCountItem();
  const offset = getOffsetPagination(countItems, number, page);
  let limit = number;
  if (!offset) {
    limit = number * page - countItems;
    if (!limit) {
      limit = number;
    }
  }
  const optionsForFindAndCountAll = {
    limit,
    offset,
  };

  if (req.query.email) {
    optionsForFindAndCountAll["where"] = {
      email: {
        [Op.like]: `${req.query.email}%`,
      },
    };
  }

  const rows = await Model.findAll(optionsForFindAndCountAll);

  let data = rows.map((position) => {
    return position.dataValues;
  });
  data=data.reverse()

  const response = {
    count_items: countItems,
    count_page: Math.ceil(countItems / number),
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

const getCountItem = async () => {
  return await Model.count();
};

const getOffsetPagination = (countItems, countPerPage, currentPage) => {
  let offset = countItems - countPerPage * currentPage;
  if (offset < 0) {
    return 0;
  }
  return offset;
};

app.listen(port);
