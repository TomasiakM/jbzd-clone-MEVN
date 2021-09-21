const Category = require("../models/Category");

module.exports = async (req, res) => {
  const cat = await Category.find({});

  let categories = [],
    closeCategories = [];
  cat.forEach((e) => {
    const data = { id: e._id, name: e.name, urlName: e.urlName };
    if (e.isForAuthUsers) closeCategories.push(data);
    else categories.push(data);
  });

  res.send({ categories, closeCategories });
};
