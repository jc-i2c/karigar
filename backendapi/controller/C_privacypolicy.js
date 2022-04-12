const Privacypolicy = require("../models/M_privacypolicy");

// Create or update privacy policy API.
const createUpdatePrivacy = async (req, res, next) => {
  try {
    const { privacypolicyid, privacypolicy } = req.body;
    const findQry = await Privacypolicy.findById(privacypolicyid);

    if (findQry) {
      // Update privacy policy.
      const result = await Privacypolicy.findByIdAndUpdate(privacypolicyid, {
        $set: { privacypolicy: privacypolicy },
      });

      if (result) {
        return res.send({
          status: true,
          message: `Privacy policy updated.`,
        });
      } else {
        return res.send({
          status: true,
          message: `Privacy policy not updated.`,
        });
      }
    } else {
      // Create new privacy policy
      var createPrivacyPolicy = new Privacypolicy({
        privacypolicy: privacypolicy,
      });

      const insertQry = await createPrivacyPolicy.save();

      if (insertQry) {
        return res.send({
          status: true,
          message: `Privacy policy created.`,
        });
      } else {
        return res.send({
          status: false,
          message: `Privacy policy not created.`,
        });
      }
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Get privacy policy API.
const getPrivacyPolicy = async (req, res, next) => {
  try {
    const getQry = await Privacypolicy.findOne();

    if (getQry) {
      return res.send({
        status: true,
        message: `Privacy policy found into system.`,
        data: getQry,
      });
    } else {
      return res.send({
        status: false,
        message: `Privacy policy not found into system.`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

// Delete privacy policy API.
const deletePrivacyPolicy = async (req, res, next) => {
  try {
    const privacyPolicyId = req.body.privacypolicyid;
    if (privacyPolicyId) {
      const deleteQry = await Privacypolicy.findByIdAndDelete(privacyPolicyId);
      if (deleteQry) {
        return res.send({
          status: true,
          message: `Privacy policy deleted.!`,
        });
      } else {
        return res.send({
          status: true,
          message: `Privacy policy not deleted.!`,
        });
      }
    } else {
      return res.send({
        status: true,
        message: `Privacy policy Id is required.!`,
      });
    }
  } catch (error) {
    // console.log(error, "ERROR");
    next(error);
  }
};

module.exports = { createUpdatePrivacy, getPrivacyPolicy, deletePrivacyPolicy };
