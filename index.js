require("dotenv").config();
const express = require("express");
const { Op } = require("sequelize");
const Model = require("./model");
const app = express();
const port = 4000;

app.get("/data", async (req, res) => {
  const currentPage = parseInt(req.query.page);
  const countItemsPerPage = parseInt(req.query.number);
  const countItems = await getCountItem();

  const offset = getOffsetPagination(
    countItems,
    countItemsPerPage,
    currentPage
  );
  const countPages = getCountPages(countItems, countItemsPerPage);
  const limit = getLimit(
    countItemsPerPage,
    currentPage,
    countItems,
    countPages
  );

  let where = {};
  if (req.query.email) {
    where["where"] = {
      email: {
        [Op.like]: `${req.query.email}%`,
      },
    };
  }

  const rows = await Model.findAll({ ...where, offset, limit });

  let data = rows.map((position) => {
    return position.dataValues;
  });
  data = data.reverse();

  const response = {
    count_items: countItems,
    count_page: countPages,
    data,
  };
  if (currentPage > 1) {
    response["prevPage"] = `http://localhost:4000/data?page=${
      currentPage - 1
    }&number=${countItemsPerPage}`;
  }
  response["nextPage"] = `http://localhost:4000/data?page=${
    currentPage + 1
  }&number=${countItemsPerPage}`;

  res.send(response);
});

const getCountItem = async () => {
  return await Model.count();
};

const getCountPages = (countItems, countItemsPerPage) => {
  return Math.ceil(countItems / countItemsPerPage);
};

const getOffsetPagination = (countItems, countItemsPerPage, currentPage) => {
  let offset = countItems - countItemsPerPage * currentPage;
  if (offset < 0) {
    return 0;
  }
  return offset;
};

const getLimit = (countItemsPerPage, currentPage, countItems, countPages) => {
  if (currentPage == countPages) {
    return countItems - countItemsPerPage * (currentPage - 1);
  }
  return countItemsPerPage;
};

app.listen(port);
