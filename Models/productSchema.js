const mongoose = require("mongoose")

// ================= ADMIN MODEL ===================

const adminaccountmodel = new mongoose.Schema({
    userName: { type: String },
    Email: { type: String, default: null },
    phoneNo: { type: Number, default: null },
    password: { type: String },
    role: { type: String },
    token: { type: String },
    profilePicture: { type: String },
    branchid: { type: mongoose.Schema.Types.ObjectId, ref: "Branchschememodel" },
    isactive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
})
const Adminaccountmodel = mongoose.model("Admin", adminaccountmodel, "Admin")

// ================= BUSINESS MODEL ===================

const createnewbusniessmodel = new mongoose.Schema({
    Name: { type: String },
    Books: { type: Number, default: null },
    updatedText:{ type: String,default: 0},
    amount: { type: Number}
})
const Busniess = mongoose.model("Busniess", createnewbusniessmodel, "Busniess")

// ================= SUB BUSINESS MODEL ===================

const createsubbusniessmodel = new mongoose.Schema({
    Name: { type: String },
    Busniessid: { type: mongoose.Schema.Types.ObjectId, ref: "Busniess" },
    updatedText:{ type: String,default: 0},
    amount: { type: Number}
})
const SubBusniess = mongoose.model("SubBusniess", createsubbusniessmodel, "SubBusniess")

// ================= TRANSACTION MODEL ===================

const transcationsubbusniessmodel = new mongoose.Schema({
    SubBusniessid: { type: mongoose.Schema.Types.ObjectId, ref: "SubBusniess" },
    Busniessid: { type: mongoose.Schema.Types.ObjectId, ref: "Busniess" },
    type: { type: String },
    amount: { type: Number },
    time: { type: String },
    date: { type: String }
})
const Transcation = mongoose.model("Transcation", transcationsubbusniessmodel, "Transcation")

// ================= EXPORT ===================

module.exports = {
    Adminaccountmodel,
    Busniess,
    SubBusniess,
    Transcation
}
