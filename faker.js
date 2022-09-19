const Model = require("./model");

const addFakeRow = async () => {
  for (let counter = 1; counter <= 300; counter++) {
    await Model.create({
      firstname: "firstname-" + counter,
      lastname: "lastname-" + counter,
      email: "email-" + counter,
      mobile: "mobile-" + counter,
      city: "city-" + counter,
    });
  }
};

module.exports = {
  addFakeRow,
};
