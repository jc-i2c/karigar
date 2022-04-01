const Termscondition = require("../models/M_termsconditions");

const { editTermsConditionVal } = require("../helper/joivalidation");

// Create terms condition API.
const createTermscondition = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    var createTermsCondition = new Termscondition({
      title: title,
      description: description,
    });

    const insertQry = await createTermsCondition.save();

    if (insertQry) {
      return res.send({
        status: true,
        message: `Terms condition created.`,
      });
    } else {
      return res.send({
        status: false,
        message: `Terms condition not created.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Get terms condition API.
const getAllTermscondition = async (req, res, next) => {
  try {
    const findQry = await Termscondition.find();

    if (findQry.length > 0) {
      return res.send({
        status: true,
        message: `${findQry.length} Terms condition found into system.`,
        data: findQry,
      });
    } else {
      return res.send({
        status: false,
        message: `${findQry.length} Terms condition not found into system.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Edit terms condition API.
const editTermscondition = async (req, res, next) => {
  try {
    let data = {
      termsconditionid: req.body.termsconditionid,
      title: req.body.title,
      description: req.body.description,
    };

    // Joi validation.
    let { error } = editTermsConditionVal(data);

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
      let findQry = await Termscondition.findById(data.termsconditionid);

      if (findQry) {
        var updateData = {
          title: data.title,
          description: data.description,
        };

        let updateQry = await Termscondition.findByIdAndUpdate(findQry._id, {
          $set: updateData,
        });

        if (updateQry) {
          return res.send({
            status: true,
            message: `Terms condition updated.!`,
          });
        } else {
          return res.send({
            status: false,
            message: `Terms condition not updated.!`,
          });
        }
      } else {
        return res.send({
          status: false,
          message: `Terms condition not found into system.!`,
        });
      }
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Delete terms condition API.
const deleteTermscondition = async (req, res, next) => {
  try {
    const termsConditionId = req.body.termsconditionid;

    if (!termsConditionId) {
      return res.send({
        status: false,
        message: `Termscondition Id is not allowed to be empty.`,
      });
    } else {
      const findQry = await Termscondition.find({
        _id: {
          $in: termsConditionId,
        },
      });

      var totalCount = findQry.length;
      var count = 0;

      if (totalCount <= 0) {
        return res.send({
          status: true,
          message: `${count} Terms and conditions found into system.!`,
        });
      } else {
        // Array of all Terms and conditions.
        await Promise.all(
          findQry.map(async (allTermsConditions) => {
            count = count + 1;
            await Termscondition.findByIdAndDelete(allTermsConditions._id);
          })
        );

        if (totalCount == count) {
          return res.send({
            status: true,
            message: `${count} Terms and conditions deleted.!`,
          });
        } else if (count > 0) {
          return res.send({
            status: true,
            message: `Terms and conditions deleted ${count} out of ${totalCount} terms and conditions.!`,
          });
        } else {
          return res.send({
            status: true,
            message: `We found database in ${totalCount} terms and conditions but not deleted.!`,
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
  createTermscondition,
  getAllTermscondition,
  editTermscondition,
  deleteTermscondition,
};
