const Banner = require("../models/M_banner");
var moment = require("moment");

const { createBannerVal, updateBannerVal } = require("../helper/joivalidation");
const { removeFile } = require("../helper/removefile");

// Create dashboard banner API.
const createHomeBanner = async (req, res, next) => {
  try {
    const { bannertitle, bannersubtitle } = req.body;

    if (req.file) {
      var bannerImage = req.file.filename;

      let data = {};
      data.bannertitle = bannertitle;
      data.bannersubtitle = bannersubtitle;
      data.bannerimage = bannerImage;

      // Joi validation.
      const { error } = createBannerVal(data);

      if (error) {
        removeFile(bannerImage);
        let errorMsg = {};
        error.details.map(async (error) => {
          errorMsg = { ...errorMsg, [`${error.path}`]: error.message };
        });

        return res.send({
          status: false,
          message: errorMsg,
        });
      } else {
        var createNewBanner = new Banner({
          bannertitle: bannertitle,
          bannersubtitle: bannersubtitle,
          bannerimage: bannerImage,
        });

        const insertQry = await createNewBanner.save();

        if (insertQry) {
          return res.send({
            status: true,
            message: `Banner created.`,
          });
        } else {
          return res.send({
            status: false,
            message: `Banner not created.`,
          });
        }
      }
    } else {
      removeFile(bannerImage);

      return res.send({
        status: false,
        message: `Banner image is required`,
      });
    }
  } catch (error) {
    removeFile(bannerImage);

    // console.log(error, "ERROR");
    next(error);
  }
};

// Update dashboard banner API.
const updateBanner = async (req, res, next) => {
  try {
    let { bannerid, bannertitle, bannersubtitle } = req.body;

    let findQry = await Banner.findById(bannerid);

    if (findQry) {
      if (req.file) {
        var newBanner = req.file.filename;
      }

      // Image name.
      var bannerImage = newBanner ? newBanner : findQry.bannerimage;

      let data = {};
      data.bannerid = bannerid;
      data.bannertitle = bannertitle;
      data.bannersubtitle = bannersubtitle;

      // Joi validation.
      const { error } = updateBannerVal(data);

      if (error) {
        if (req.file) {
          removeFile(req.file.filename);
        }

        let errorMsg = {};
        error.details.map(async (error) => {
          errorMsg = { ...errorMsg, [`${error.path}`]: error.message };
        });

        return res.send({
          status: false,
          message: errorMsg,
        });
      } else {
        delete data._id;
        data.bannerimage = bannerImage;

        let updateQry = await Banner.findByIdAndUpdate(bannerid, {
          $set: data,
        });

        if (updateQry) {
          if (req.file) {
            removeFile(findQry.bannerimage);
          }

          return res.send({
            status: true,
            message: `Banner updated.!`,
          });
        } else {
          if (req.file) {
            removeFile(req.file.filename);
          }
          return res.send({
            status: false,
            message: `Banner not updated.!`,
          });
        }
      }
    } else {
      if (req.file) {
        var bannerImage = req.file.filename;
        removeFile(bannerImage);
      }

      return res.send({
        status: false,
        message: `Banner not found into system.`,
      });
    }
  } catch (error) {
    if (req.file) {
      var bannerImage = req.file.filename;
      removeFile(bannerImage);
    }
    // console.log(error, "ERROR");
    next(error);
  }
};

// Get all dashboard banner API.
const getAllBanner = async (req, res, next) => {
  try {
    let findQry = await Banner.find();

    if (findQry.length > 0) {
      let findData = [];
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
        message: `${findData.length} banner found into system.`,
        data: findData,
      });
    } else {
      return res.send({
        status: false,
        message: `${findData.length} banner not found into system.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Delete dashboard banner API.
const deleteBanner = async (req, res, next) => {
  try {
    const bannerId = req.body.bannerid;

    if (!bannerId) {
      return res.send({
        status: false,
        message: `Banner Id is not allowed to be empty.`,
      });
    } else {
      const findQry = await Banner.find({
        _id: {
          $in: bannerId,
        },
      });

      var totalCount = findQry.length;
      var count = 0;

      if (totalCount <= 0) {
        return res.send({
          status: true,
          message: `${count} banner found into system.!`,
        });
      } else {
        // Array of all banner.
        Promise.all([
          findQry.map(async (allBanner) => {
            count = count + 1;
            await Banner.findByIdAndDelete(allBanner._id);
            removeFile(allBanner.bannerimage);
          }),
        ]);

        if (totalCount == count) {
          return res.send({
            status: true,
            message: `${count} banner deleted.!`,
          });
        } else if (count > 0) {
          return res.send({
            status: true,
            message: `banner deleted ${count} out of ${totalCount} banner.!`,
          });
        } else {
          return res.send({
            status: true,
            message: `We found database in ${totalCount} banner but not deleted.!`,
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
  createHomeBanner,
  updateBanner,
  getAllBanner,
  deleteBanner,
};
