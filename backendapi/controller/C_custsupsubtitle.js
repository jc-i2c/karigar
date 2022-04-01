const Custsuptsubtitle = require("../models/M_custsuptsubtitle");

const { editCusSupSubTitleVal } = require("../helper/joivalidation");

// Create customer support subtitle API.
const createCustSupSubTitle = async (req, res, next) => {
  try {
    const { custsuptitleid, subtitle, description } = req.body;

    var createTermsCondition = new Custsuptsubtitle({
      custsuptitleid: custsuptitleid,
      subtitle: subtitle,
      description: description,
    });

    const insertQry = await createTermsCondition.save();

    if (insertQry) {
      return res.send({
        status: true,
        message: `Customer support subtitle created.`,
      });
    } else {
      return res.send({
        status: false,
        message: `Customer support subtitle not created.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Get customer support subtitle API.
const getAllCusSupSubTitle = async (req, res, next) => {
  try {
    const findQry = await Custsuptsubtitle.find()
      .where({
        custsuptitleid: req.body.custsuptitleid,
      })
      .populate({ path: "custsuptitleid", select: "title" });

    if (findQry.length > 0) {
      return res.send({
        status: true,
        message: `${findQry.length} Customer support subtitle found into system.`,
        data: findQry,
      });
    } else {
      return res.send({
        status: false,
        message: `${findQry.length} Customer support subtitle not found into system.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Edit customer support subtitle API.
const editCusSupSubTitle = async (req, res, next) => {
  try {
    let data = {
      custsupsubtitleid: req.body.custsupsubtitleid,
      custsuptitleid: req.body.custsuptitleid,
      subtitle: req.body.subtitle,
      description: req.body.description,
    };

    // Joi validation.
    let { error } = editCusSupSubTitleVal(data);

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
      let findQry = await Custsuptsubtitle.findById(data.custsupsubtitleid);

      if (findQry) {
        var updateData = {
          custsuptitleid: req.body.custsuptitleid,
          title: data.title,
          subtitle: data.subtitle,
          description: data.description,
        };

        let updateQry = await Custsuptsubtitle.findByIdAndUpdate(findQry._id, {
          $set: updateData,
        });

        if (updateQry) {
          return res.send({
            status: true,
            message: `Customer support subtitle updated.!`,
          });
        } else {
          return res.send({
            status: false,
            message: `Customer support subtitle not updated.!`,
          });
        }
      } else {
        return res.send({
          status: false,
          message: `Customer support subtitle not found into system.!`,
        });
      }
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Delete customer support subtitle API.
const deleteCusSupSubTitle = async (req, res, next) => {
  try {
    const custSupSubTitleId = req.body.custsupsubtitleid;

    if (!custSupSubTitleId) {
      return res.send({
        status: false,
        message: `Customer support subtitle Id is not allowed to be empty.`,
      });
    } else {
      const findQry = await Custsuptsubtitle.find({
        _id: {
          $in: custSupSubTitleId,
        },
      });

      var totalCount = findQry.length;
      var count = 0;

      if (totalCount <= 0) {
        return res.send({
          status: true,
          message: `${count} Customer support subtitle found into system.!`,
        });
      } else {
        // Array of all customer support subtitle.
        Promise.all([
          findQry.map(async (allCustSup) => {
            count = count + 1;
            await Custsuptsubtitle.findByIdAndDelete(allCustSup._id);
          }),
        ]);

        if (totalCount == count) {
          return res.send({
            status: true,
            message: `${count} Customer support subtitle deleted.!`,
          });
        } else if (count > 0) {
          return res.send({
            status: true,
            message: `Customer support subtitle deleted ${count} out of ${totalCount} customer support subtitle.!`,
          });
        } else {
          return res.send({
            status: true,
            message: `We found database in ${totalCount} customer support subtitle but not deleted.!`,
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
  createCustSupSubTitle,
  getAllCusSupSubTitle,
  editCusSupSubTitle,
  deleteCusSupSubTitle,
};
