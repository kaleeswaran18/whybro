const express = require("express");
const router = express.Router();
const adminaccountController = require('../Controllers/product');

//login both admin & superadmin
router.post('/login', adminaccountController.Login)

// CREATE
router.post("/create", adminaccountController.BusinessCreate);

// GET ALL
router.get("/get", adminaccountController.GetAllBusiness);

// GET BY ID
router.get("/get/:id", adminaccountController.GetBusinessById);

// UPDATE
router.put("/update/:id", adminaccountController.UpdateBusiness);

// DELETE
router.delete("/delete/:id", adminaccountController.DeleteBusiness);

router.post('/sub/create', adminaccountController.SubBusinessCreate)
router.get('/sub/get', adminaccountController.GetAllSubBusiness)
router.get('/subbus/get/:id', adminaccountController.GetAllsubbusBusiness)
router.get('/sub/get/:id', adminaccountController.GetSubBusinessById)
router.put('/sub/update/:id', adminaccountController.UpdateSubBusiness)
router.delete('/sub/delete/:id', adminaccountController.DeleteSubBusiness)



router.post('/trx/create', adminaccountController.TransactionCreate)
router.get('/trx/get', adminaccountController.GetAllTransaction)
router.get('/trx/get/:id', adminaccountController.GetTransactionById)
router.get('/threetrx/get/:id', adminaccountController.GetTransactionById)
router.put('/trx/update/:id', adminaccountController.UpdateTransaction)
router.delete('/trx/delete/:id', adminaccountController.DeleteTransaction)
module.exports = router;