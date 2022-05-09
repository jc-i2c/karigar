var moment = require("moment");
const SystemModules = require("../models/M_system_modules");

// Create system modules API.
const createModules = async (req, res, next) => {
  try {
    let { modulesname } = req.body;

    modulesname = modulesname.toLowerCase();

    let data = [];

    let readObj = {};
    readObj.name = "read";
    readObj.id = "1";

    let writeObj = {};
    writeObj.name = "write";
    writeObj.id = "2";

    let delObj = {};
    delObj.name = "delete";
    delObj.id = "3";

    data.push(readObj, writeObj, delObj);

    var addSystemModules = new SystemModules({
      modulesname: modulesname,
      modulespermission: data,
    });

    const insertQry = await addSystemModules.save();

    if (insertQry) {
      return res.send({
        status: true,
        message: `System modules added.`,
        data: insertQry,
      });
    } else {
      return res.send({
        status: true,
        message: `System modules not added.`,
        data: insertQry,
      });
    }
  } catch (error) {
    // console.log(error, `ERROR`);
    next(error);
  }
};

// Get system modules API.
const getModules = async (req, res, next) => {
  try {
    const getAllPermission = await SystemModules.find();

    let findData = [];
    if (getAllPermission.length > 0) {
      getAllPermission.map((item) => {
        let objectData = {};
        objectData = item.toObject();

        // createdAt date convert into date and time ("DD-MM-YYYY SS:MM:HH") format
        createDate = objectData.createdAt
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, "");

        objectData.createdAt = moment(createDate).format("DD-MM-YYYY SS:MM:HH");

        // updatedAt date convert into date and time ("DD-MM-YYYY SS:MM:HH") format
        updateDate = objectData.updatedAt
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, "");

        objectData.updatedAt = moment(updateDate).format("DD-MM-YYYY SS:MM:HH");

        delete objectData.__v; // delete objectData["__v"]

        findData.push(objectData);
      });
      return res.send({
        status: true,
        message: `${findData.length} System modules found into system.`,
        data: findData,
      });
    } else {
      return res.send({
        status: true,
        message: `System modules not found into system.`,
      });
    }
  } catch (error) {
    console.log(error, `ERROR`);
  }
};

// Update system modules API.
const updateModules = async (req, res, next) => {
  try {
    let systemModulesId = req.body.systemmodulesid;
    let modulesname = req.body.modulesname;

    modulesname = modulesname.toLowerCase();

    const updateQry = { modulesname: modulesname };

    const result = await SystemModules.findByIdAndUpdate(systemModulesId, {
      $set: updateQry,
    });

    if (result) {
      return res.send({
        status: true,
        message: `System modules updated.`,
      });
    } else {
      return res.send({
        status: false,
        message: `System modules not updated.`,
      });
    }
  } catch (error) {
    console.log(error, "ERROR");
  }
};

// Delete system modules API.
const deleteModules = async (req, res, next) => {
  try {
    const systemModulesId = req.body.systemmodulesid;
    if (!systemModulesId) {
      return res.send({
        status: false,
        message: `System modules ID is not allowed to be empty.`,
      });
    } else {
      const findQry = await SystemModules.find({
        _id: {
          $in: systemModulesId,
        },
      });

      var totalCount = findQry.length;
      var count = 0;

      if (totalCount <= 0) {
        return res.send({
          status: true,
          message: `${count} system modules found into system.!`,
        });
      } else {
        // Array of all services.
        await Promise.all(
          findQry.map(async (allRoles) => {
            count = count + 1;
            await SystemModules.findByIdAndDelete(allRoles._id);
          })
        );

        if (totalCount == count) {
          return res.send({
            status: true,
            message: `${count} system modules deleted.!`,
          });
        } else if (count > 0) {
          return res.send({
            status: true,
            message: `system modules deleted ${count} out of ${totalCount} system modules.!`,
          });
        } else {
          return res.send({
            status: true,
            message: `We found database in ${totalCount} system modules but not deleted.!`,
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
  createModules,
  getModules,
  updateModules,
  deleteModules,
};
