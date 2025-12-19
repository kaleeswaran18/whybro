
const { Adminaccountmodel, Busniess, SubBusniess, Transcation } =  require('../Models/productSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();
const moment=require('moment')
const adminaccountSchema = () => {

  // ============================================
  // LOGIN
  // ============================================
  const Login = async (req, res) => {
    try {
      const { password, phone } = req.body;
      console.log(password, phone,'password, phone')
      let user = await Adminaccountmodel.findOne({ phoneNo: phone }).populate("branchid");

      if (!user) {
        return res.status(400).json({
          status: false,
          message: "Invalid phone number, please check."
        });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({
          status: false,
          message: "Invalid password."
        });
      }

      const token = jwt.sign(
        { id: user._id, role: user.role, phoneNo: user.phoneNo },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30m" }
      );

      res.status(200).json({
        status: true,
        message: "Login successful",
        data: {
          id: user._id,
          role: user.role,
          phone: user.phoneNo,
          email: user.Email,
          branch: user.branchid,
          token
        }
      });

    } catch (err) {
      console.error("Something went wrong:", err);
      res.status(500).json({ status: false, message: "Internal Server Error" });
    }
  };

  // ============================================
  // BUSINESS CREATE
  // ============================================
const BusinessCreate = async (req, res) => {
  try {
    const { Name, amount } = req.body;
    console.log(req.body)
console.log(Name,'name1')
    if (!Name || Name.trim() === "") {
      return res.status(400).json({
        status: false,
        message: "Business Name is required"
      });
    }

    const exists = await Busniess.findOne({
      Name: { $regex: new RegExp("^" + Name.trim() + "$", "i") }
    });

    if (exists) {
      return res.status(400).json({
        status: false,
        message: "Business Name Already Exists"
      });
    }

    const updatedText = moment().format("DD/MM/YYYY hh:mm A");

    const bus = await Busniess.create({
      Name: Name.trim(),
      Books: 0,
      amount: amount || 0,
      updatedText: updatedText
    });

    res.status(200).json({
      status: true,
      message: "Business Created Successfully",
      data: bus
    });

  } catch (err) {
    console.error("Something went wrong:", err);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};


  // ============================================
  // BUSINESS GET ALL
  // ============================================
 const GetAllBusiness = async (req, res) => {
  try {
    // 1️⃣ Get all Business
    const bus = await Busniess.find().lean();

    // 2️⃣ Extract all business ids
    const businessIds = bus.map(b => b._id);

    // 3️⃣ Get sub-business count for each business
    const subCounts = await SubBusniess.aggregate([
      {
        $match: {
          Busniessid: { $in: businessIds }
        }
      },
      {
        $group: {
          _id: "$Busniessid",
          count: { $sum: 1 }
        }
      }
    ]);

    // 4️⃣ Merge subbusiness count into business response
    const merged = bus.map(biz => {
      const found = subCounts.find(sub => String(sub._id) === String(biz._id));

      return {
        ...biz,
        totalSubBusiness: found ? found.count : 0
      };
    });

    // 5️⃣ Return final formatted data
    return res.status(200).json({
      status: true,
      count: merged.length,
      data: merged
    });

  } catch (err) {
    console.error("GetAllBusiness Error:", err);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};


  // ============================================
  // BUSINESS GET BY ID
  // ============================================
  const GetBusinessById = async (req, res) => {
    try {
      const bus = await Busniess.findById(req.params.id);

      if (!bus) {
        return res.status(404).json({
          status: false,
          message: "Business Not Found"
        });
      }

      res.status(200).json({
        status: true,
        data: bus
      });

    } catch (err) {
      console.error("Something went wrong:", err);
      res.status(500).json({ status: false, message: "Internal Server Error" });
    }
  };

  // ============================================
  // BUSINESS UPDATE
  // ============================================
 const UpdateBusiness = async (req, res) => {
  try {
    const { Name, Books } = req.body;
    const { id } = req.params;

    // 🔍 Check duplicate name except current document
    const exists = await Busniess.findOne({
      Name: { $regex: new RegExp("^" + Name.trim() + "$", "i") },
      _id: { $ne: id }
    });

    if (exists) {
      return res.status(400).json({
        status: false,
        message: "Business Name Already Exists"
      });
    }

    const bus = await Busniess.findByIdAndUpdate(
      id,
      {
        Name: Name.trim(),
        Books
      },
      { new: true }
    );

    if (!bus) {
      return res.status(404).json({
        status: false,
        message: "Business Not Found"
      });
    }

    res.status(200).json({
      status: true,
      message: "Business Updated Successfully",
      data: bus
    });

  } catch (err) {
    console.error("Something went wrong:", err);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};


  // ============================================
  // BUSINESS DELETE
  // ============================================
  const DeleteBusiness = async (req, res) => {
    try {
      const bus = await Busniess.findByIdAndDelete(req.params.id);

      if (!bus) {
        return res.status(404).json({
          status: false,
          message: "Business Not Found"
        });
      }

      res.status(200).json({
        status: true,
        message: "Business Deleted Successfully"
      });

    } catch (err) {
      console.error("Something went wrong:", err);
      res.status(500).json({ status: false, message: "Internal Server Error" });
    }
  };
// ============================================
// SUB BUSINESS CREATE
// ============================================
const SubBusinessCreate = async (req, res) => {
  try {
    const { Name, Busniessid,amount } = req.body;

    const exists = await SubBusniess.findOne({
      Name: { $regex: new RegExp("^" + Name.trim() + "$", "i") }
    });

    if (exists) {
      return res.status(400).json({
        status: false,
        message: "SubBusiness Name Already Exists"
      });
    }
  const updatedText = moment().format("DD/MM/YYYY hh:mm A");

    const sub = await SubBusniess.create({
      Name: Name.trim(),
      Busniessid:Busniessid,
      amount: amount || 0,
      updatedText: updatedText
    });

    res.status(200).json({
      status: true,
      message: "SubBusiness Created Successfully",
      data: sub
    });

  } catch (err) {
    console.error("Something went wrong:", err);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};


// ============================================
// SUB BUSINESS GET ALL
// ============================================
const GetAllSubBusiness = async (req, res) => {
  try {
    const sub = await SubBusniess.find().populate("Busniessid");

    res.status(200).json({
      status: true,
      data: sub
    });

  } catch (err) {
    console.error("Something went wrong:", err);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};
const GetAllsubbusBusiness = async (req, res) => {
  try {
  console.log(req.params.id,"req.params.id")

    // 🔐 validation
    if (!req.params.id) {
      return res.status(400).json({
        status: false,
        message: "Business ID (_id) is required"
      });
    }

    // 📌 fetch data
    const sub = await SubBusniess.find({ Busniessid: req.params.id })
      .populate("Busniessid")
      .lean();
     console.log(sub,"sub")
    return res.status(200).json({
      status: true,
      count: sub.length,
      data: sub
    });

  } catch (err) {
    console.error("GetAllSubBusiness Error =>", err);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error"
    });
  }
};
// ============================================
// SUB BUSINESS GET BY ID
// ============================================
const GetSubBusinessById = async (req, res) => {
  try {
    const sub = await SubBusniess.findById(req.params.id).populate("Busniessid");

    if (!sub) {
      return res.status(404).json({
        status: false,
        message: "SubBusiness Not Found"
      });
    }

    res.status(200).json({
      status: true,
      data: sub
    });

  } catch (err) {
    console.error("Something went wrong:", err);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

// ============================================
// SUB BUSINESS UPDATE
// ============================================
const UpdateSubBusiness = async (req, res) => {
  try {
    const { Name, Busniessid } = req.body;
    const { id } = req.params;

    const exists = await SubBusniess.findOne({
      Name: { $regex: new RegExp("^" + Name.trim() + "$", "i") },
      _id: { $ne: id }
    });

    if (exists) {
      return res.status(400).json({
        status: false,
        message: "SubBusiness Name Already Exists"
      });
    }

    const sub = await SubBusniess.findByIdAndUpdate(
      id,
      {
        Name: Name.trim(),
        Busniessid
      },
      { new: true }
    );

    if (!sub) {
      return res.status(404).json({
        status: false,
        message: "SubBusiness Not Found"
      });
    }

    res.status(200).json({
      status: true,
      message: "SubBusiness Updated Successfully",
      data: sub
    });

  } catch (err) {
    console.error("Something went wrong:", err);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};


// ============================================
// SUB BUSINESS DELETE
// ============================================
const DeleteSubBusiness = async (req, res) => {
  try {
    const sub = await SubBusniess.findByIdAndDelete(req.params.id);

    if (!sub) {
      return res.status(404).json({
        status: false,
        message: "SubBusiness Not Found"
      });
    }

    res.status(200).json({
      status: true,
      message: "SubBusiness Deleted Successfully"
    });

  } catch (err) {
    console.error("Something went wrong:", err);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};
// ============================================
// TRANSACTION CREATE
// ============================================
const TransactionCreate = async (req, res) => {
  try {
    const { SubBusniessid, Busniessid, type, amount } = req.body;

    // 1️⃣ Find sub business
    const subBusiness = await SubBusniess.findById(SubBusniessid);

    if (!subBusiness) {
      return res.status(404).json({
        status: false,
        message: "Sub business not found"
      });
    }

    // 2️⃣ Cashout validation
    if (type === 'Cash-out') {
      if (subBusiness.amount < amount) {
        return res.status(400).json({
          status: false,
          message: `You have only ${subBusiness.amount}`
        });
      }

      subBusiness.amount -= amount;
    } 
    // 3️⃣ Cashin
    else {
      console.log( subBusiness.amount,amount,"checkalll")
      subBusiness.amount += amount;
    }

    // 4️⃣ Save updated balance
    await subBusiness.save();

    // 5️⃣ Create transaction
    const transaction = await Transcation.create({
      SubBusniessid,
      Busniessid,
      type,
      amount,
      date: moment().format('YYYY-MM-DD'),
      time: moment().format('hh:mm A'),
    });

    return res.status(200).json({
      status: true,
      message: "Transaction Created Successfully",
      data: transaction
    });

  } catch (err) {
    console.error("Something went wrong:", err);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error"
    });
  }
};

// ============================================
// TRANSACTION GET ALL
// ============================================
const GetAllTransaction = async (req, res) => {
  try {
    const trx = await Transcation.find()
      .populate("Busniessid")
      .populate("SubBusniessid");

    res.status(200).json({
      status: true,
      data: trx
    });

  } catch (err) {
    console.error("Something went wrong:", err);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

// ============================================
// TRANSACTION GET BY ID
// ============================================
const GetTransactionById = async (req, res) => {
  try {
    
    const trx = await Transcation.find({SubBusniessid:req.params.id})
    

    if (!trx) {
      return res.status(404).json({
        status: false,
        message: "Transaction Not Found"
      });
    }

    res.status(200).json({
      status: true,
      data: trx
    });

  } catch (err) {
    console.error("Something went wrong:", err);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};
const GetthreeTransactionById = async (req, res) => {
  try {
    // 1️⃣ Get SubBusiness
    const subBusiness = await SubBusniess.findById(req.params.id);

    if (!subBusiness) {
      return res.status(404).json({
        status: false,
        message: "SubBusiness not found"
      });
    }

    // 2️⃣ Aggregate Transactions
    const result = await Transcation.aggregate([
      {
        $match: {
          SubBusniessid: req.params.id
        }
      },
      {
        $group: {
          _id: "$type",
          totalAmount: { $sum: "$amount" }
        }
      }
    ]);

    let cashInTotal = 0;
    let cashOutTotal = 0;

    result.forEach(item => {
      if (item._id === 'Cashin') {
        cashInTotal = item.totalAmount;
      }
      if (item._id === 'Cashout') {
        cashOutTotal = item.totalAmount;
      }
    });

    // 3️⃣ Response
    res.status(200).json({
      status: true,
      Amount: subBusiness.amount, // ✅ FIX
      cashInTotal,
      cashOutTotal
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      message: "Internal Server Error"
    });
  }
};



// ============================================
// TRANSACTION UPDATE
// ============================================
const UpdateTransaction = async (req, res) => {
  try {
    const trx = await Transcation.findByIdAndUpdate(
      req.params.id,
      {
        type: req.body.type,
        amount: req.body.amount,
        time: req.body.time,
        date: req.body.date
      },
      { new: true }
    );

    if (!trx) {
      return res.status(404).json({
        status: false,
        message: "Transaction Not Found"
      });
    }

    res.status(200).json({
      status: true,
      message: "Transaction Updated Successfully",
      data: trx
    });

  } catch (err) {
    console.error("Something went wrong:", err);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

// ============================================
// TRANSACTION DELETE
// ============================================
const DeleteTransaction = async (req, res) => {
  try {
    const trx = await Transcation.findByIdAndDelete(req.params.id);

    if (!trx) {
      return res.status(404).json({
        status: false,
        message: "Transaction Not Found"
      });
    }

    res.status(200).json({
      status: true,
      message: "Transaction Deleted Successfully"
    });

  } catch (err) {
    console.error("Something went wrong:", err);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

  return {
    Login,
    BusinessCreate,
    GetAllBusiness,
    GetBusinessById,
    UpdateBusiness,
    DeleteBusiness,
    

  // SUB BUSINESS
  SubBusinessCreate,
  GetAllSubBusiness,
  GetSubBusinessById,
  UpdateSubBusiness,
  DeleteSubBusiness,

  // TRANSACTION
  TransactionCreate,
  GetAllTransaction,
  GetTransactionById,
  UpdateTransaction,
  DeleteTransaction,
  GetAllsubbusBusiness,
  GetthreeTransactionById
  };

};

module.exports = adminaccountSchema();
