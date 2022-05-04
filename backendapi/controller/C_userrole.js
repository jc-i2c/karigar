const Userrole = require("../models/M_userrole");

// Create and Update user role API.
const createUserRole = async (req, res, next) => {
  try {
    var data = req.body.data;
    let userroleid = data.userroleid;

    let checkUserRole = await Userrole.findById(userroleid);

    if (checkUserRole) {
      // if  exists
      let permissions = [];
      data.permissions.map((item) => {
        permissions.push(item);
      });

      var saveData = {
        permissions: permissions,
      };

      let updateQry = await Userrole.findByIdAndUpdate(userroleid, {
        $set: saveData,
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
      // new create
      let permissions = [];
      data.permissions.map((item) => {
        permissions.push(item);
      });

      var saveData = new Userrole({
        rolename: data.rolename,
        permissions: permissions,
      });

      const insertQry = await saveData.save();

      if (insertQry) {
        return res.send({
          status: true,
          message: "User role added.",
          data: insertQry,
        });
      } else {
        return res.send({
          status: false,
          message: "User role not added.",
        });
      }
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
      path: "permissions.systemmodulesid",
      select: "modulesname",
    });

    let findData = [];

    if (getAllUserRole.length > 0) {
      getAllUserRole.map(async (item) => {
        let objectData = {};
        objectData = item.toJSON();

        // createdAt date convert into date and time (DD/MM/YYYY HH:MM:SS) format
        objectData.createdAt = objectData.createdAt
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, "");

        // updatedAt date convert into date and time (DD/MM/YYYY HH:MM:SS) format
        objectData.updatedAt = objectData.updatedAt
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, "");

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
        // Array of all services.
        await Promise.all(
          findQry.map(async (allRoles) => {
            if (!allRoles._id == "626113fadf6c093c730a54fa") {
              console.log(allRoles, "allRoles");
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

const getPermission = async (req, res, next) => {
  try {
    const userroll = res.user.userroll;

    const result = await Userrole.findOne()
      .where({
        _id: userroll,
      })
      .populate({
        path: "permissions.systemmodulesid",
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
    console.log(error, "ERROR");
  }
};

module.exports = {
  createUserRole,
  getAllRole,
  delUserRole,
  getPermission,
};
