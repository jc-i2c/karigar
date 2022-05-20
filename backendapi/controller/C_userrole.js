var moment = require("moment");
const Userrole = require("../models/M_userrole");

// Create userrole API.
const createRole = async (req, res, next) => {
  try {
    var data = req.body;

    let roleTag = req.body.roletag;
    roleTag = roleTag.replace(/\s/g, "");

    var saveData = new Userrole({
      rolename: data.rolename,
      systemmodulesid: data.systemmodulesid,
      roletag: roleTag,
    });

    const insertQry = await saveData.save();

    if (insertQry) {
      return res.send({
        status: true,
        message: "Userrole created.",
        data: insertQry,
      });
    } else {
      return res.send({
        status: false,
        message: "Userrole not created.",
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Update userrole API.
const updateRole = async (req, res, next) => {
  try {
    var roleId = req.body.roleid;

    let findQry = await Userrole.findById(roleId);

    if (findQry) {
      // Find userrole
      let data = {};

      data.rolename = req.body.rolename;
      data.systemmodulesid = req.body.systemmodulesid;

      let updateQry = await Userrole.findByIdAndUpdate(roleId, {
        $set: data,
      });

      if (updateQry) {
        return res.send({
          status: true,
          message: `Userrole updated.!`,
        });
      } else {
        return res.send({
          status: false,
          message: `Userrole not updated.!`,
        });
      }
    } else {
      return res.send({
        status: false,
        message: "Userrole not found into system.",
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Get all userrole API.
const getAllRole = async (req, res, next) => {
  try {
    const getAllUserRole = await Userrole.find().populate({
      path: "systemmodulesid",
      select: "modulesname",
    });

    let findData = [];

    if (getAllUserRole.length > 0) {
      getAllUserRole.map(async (item) => {
        let objectData = {};
        objectData = item.toJSON();

        // createdAt date convert into date and time ("DD-MM-YYYY HH:MM:SS") format
        createDate = objectData.createdAt
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, "");

        objectData.createdAt = moment(createDate).format("DD-MM-YYYY HH:MM:SS");

        // updatedAt date convert into date and time ("DD-MM-YYYY HH:MM:SS") format
        updateDate = objectData.updatedAt
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, "");

        objectData.updatedAt = moment(updateDate).format("DD-MM-YYYY HH:MM:SS");

        delete objectData.__v; // delete objectData["__v"]

        findData.push(objectData);
      });
      return res.send({
        status: true,
        message: `${findData.length} user role found into system.`,
        data: findData,
      });
    } else {
      return res.send({
        status: false,
        message: `${findData.length} user role not found into system.`,
      });
    }
  } catch (error) {
    console.log(error, "ERROR");
  }
};

// Delete userrole API.
const delUserRole = async (req, res, next) => {
  try {
    const userRoleId = req.body.userroleid;
    if (!userRoleId) {
      return res.send({
        status: false,
        message: `Userrole ID is not allowed to be empty.`,
      });
    } else {
      const findQry = await Userrole.find({
        _id: {
          $in: userRoleId,
        },
      });

      var totalRole = findQry.length;
      var cntRole = 0;

      if (totalRole <= 0) {
        return res.send({
          status: true,
          message: `${cntRole} userrole found into system.!`,
        });
      } else {
        // Array of all userroles.
        await Promise.all(
          findQry.map(async (allRoles) => {
            if (allRoles._id) {
              cntRole = cntRole + 1;
              await Userrole.findByIdAndDelete(allRoles._id);
            } else {
              totalRole = totalRole - 1;
            }
          })
        );

        if (totalRole == cntRole) {
          return res.send({
            status: true,
            message: `${cntRole} userrole deleted.!`,
          });
        } else if (cntRole > 0) {
          return res.send({
            status: true,
            message: `userrole deleted ${cntRole} out of ${totalRole} userrole.!`,
          });
        } else {
          return res.send({
            status: true,
            message: `We found database in ${totalRole} userrole but not deleted.!`,
          });
        }
      }
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Get user permission API.
const getPermission = async (req, res, next) => {
  try {
    const userroll = res.user.userroll;

    const result = await Userrole.findOne()
      .where({
        _id: userroll,
      })
      .populate({
        path: "systemmodulesid",
        select: "modulesname",
      });

    if (result) {
      return res.send({
        status: true,
        message: `User permission found into system.`,
        data: result,
      });
    } else {
      return res.send({
        status: false,
        message: `User permission not found into system.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

module.exports = {
  getAllRole,
  createRole,
  updateRole,
  delUserRole,
  getPermission,
};
