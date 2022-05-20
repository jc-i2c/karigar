var moment = require("moment");
const Custsupttitle = require("../models/M_custsupttitle");

const { editCusSupTitleVal } = require("../helper/joivalidation");

// Create customer support title API.
const createCustSupTitle = async (req, res, next) => {
  try {
    const { title } = req.body;

    var CustSuptTitle = new Custsupttitle({
      title: title,
    });

    const insertQry = await CustSuptTitle.save();

    if (insertQry) {
      return res.send({
        status: true,
        message: `Customer support title created.`,
      });
    } else {
      return res.send({
        status: false,
        message: `Customer support title not created.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Get customer support title API.
const getAllCusSupTitle = async (req, res, next) => {
  try {
    const findQry = await Custsupttitle.find();

    let findData = [];

    if (findQry.length > 0) {
      let resData = {};
      findQry.forEach((data) => {
        resData = data.toObject();

        delete resData.__v; // delete person["__v"]

        // createdAt date convert into date and time ("DD-MM-YYYY HH:MM:SS") format
        createDate = resData.createdAt
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, "");

        resData.createdAt = moment(createDate).format("DD-MM-YYYY HH:MM:SS");

        // updatedAt date convert into date and time ("DD-MM-YYYY HH:MM:SS") format
        updateDate = resData.updatedAt
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, "");

        resData.updatedAt = moment(updateDate).format("DD-MM-YYYY HH:MM:SS");

        findData.push(resData);
      });

      return res.send({
        status: true,
        message: `${findData.length} Customer support title found into system.`,
        data: findData,
      });
    } else {
      return res.send({
        status: false,
        message: `${findData.length} Customer support title not found into system.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Edit customer support title API.
const editCusSupTitle = async (req, res, next) => {
  try {
    let data = {
      custsuptitleid: req.body.custsuptitleid,
      title: req.body.title,
    };

    // Joi validation.
    let { error } = editCusSupTitleVal(data);

    if (error) {
      let errorMsg = {};
      error.details.map(async (error) => {
        errorMsg = { ...errorMsg, [`${error.path}`]: error.message };
      });

      return res.send({
        status: false,
        message: errorMsg,
      });
    } else {
      let findQry = await Custsupttitle.findById(data.custsuptitleid);

      if (findQry) {
        var updateData = {
          title: data.title,
          subtitle: data.subtitle,
          description: data.description,
        };

        let updateQry = await Custsupttitle.findByIdAndUpdate(findQry._id, {
          $set: updateData,
        });

        if (updateQry) {
          return res.send({
            status: true,
            message: `Customer support title updated.!`,
          });
        } else {
          return res.send({
            status: false,
            message: `Customer support title not updated.!`,
          });
        }
      } else {
        return res.send({
          status: false,
          message: `Customer support title not found into system.!`,
        });
      }
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Delete customer support title API.
const deleteCusSupTitle = async (req, res, next) => {
  try {
    const cusSupTitleId = req.body.custsuptitleid;

    if (!cusSupTitleId) {
      return res.send({
        status: false,
        message: `Customer support title Id is not allowed to be empty.`,
      });
    } else {
      const findQry = await Custsupttitle.find({
        _id: {
          $in: cusSupTitleId,
        },
      });

      var totalCount = findQry.length;
      var count = 0;

      if (totalCount <= 0) {
        return res.send({
          status: true,
          message: `${count} Customer support title found into system.!`,
        });
      } else {
        // Array of all customer support title.
        Promise.all([
          findQry.map(async (allCustSup) => {
            count = count + 1;
            await Custsupttitle.findByIdAndDelete(allCustSup._id);
          }),
        ]);

        if (totalCount == count) {
          return res.send({
            status: true,
            message: `${count} Customer support title deleted.!`,
          });
        } else if (count > 0) {
          return res.send({
            status: true,
            message: `Customer support title deleted ${count} out of ${totalCount} customer support title.!`,
          });
        } else {
          return res.send({
            status: true,
            message: `We found database in ${totalCount} customer support title but not deleted.!`,
          });
        }
      }
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

module.exports = {
  createCustSupTitle,
  getAllCusSupTitle,
  editCusSupTitle,
  deleteCusSupTitle,
};
