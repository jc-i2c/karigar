const SystemModules = require("../models/M_system_modules");

// Create system modules API.
const createModules = async (req, res, next) => {
  try {
    let { modulesname } = req.body;

    modulesname = modulesname.toLowerCase();

    var addSystemModules = new SystemModules({
      modulesname: modulesname,
      modulespermission: [
        { name: "read", id: 1 },
        { name: "write", id: 2 },
        { name: "delete", id: 3 },
      ],
    });

    const insertQry = await addSystemModules.save();

    if (insertQry) {
      return res.send({
        status: true,
        message: "System modules added.",
        data: insertQry,
      });
    } else {
      return res.send({
        status: true,
        message: "System modules not added.",
        data: insertQry,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Get system modules API.
const getModules = async (req, res, next) => {
  try {
    const getAllPermission = await SystemModules.find();

    if (getAllPermission.length > 0) {
      return res.send({
        status: true,
        message: "System modules found into system.",
        data: getAllPermission,
      });
    } else {
      return res.send({
        status: true,
        message: "System modules not found into system.",
      });
    }
  } catch (error) {
    console.log(error, "ERROR");
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
