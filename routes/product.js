const express = require("express");
const router = express.Router();
const productcontrol = require('../Controllers/product');

// ⭐ Direct upload → no multer middleware
router.post('/create', productcontrol.create);
router.post('/projectsSchema', productcontrol.createAlprojectsSchema);
router.put('/updateprojectsSchema', productcontrol.updateprojectsSchema);
router.post('/deleteprojectsSchema', productcontrol.deleteprojectsSchema);
router.get('/getprojectsSchema', productcontrol.getprojectsSchema);
router.put('/getAlprojectscategorySchema', productcontrol.getAlprojectscategorySchema);


router.post('/Foundercreate', productcontrol.Foundercreate);
router.put('/FounderupdateSchema', productcontrol.FounderupdateSchema);
router.post('/FounderdeleteSchema', productcontrol.FounderdeleteSchema);
router.get('/FoundergetSchema', productcontrol.FoundergetSchema);


router.post('/servicecreate', productcontrol.servicecreate);
router.put('/updateservice', productcontrol.updateservicecreateSchema);
router.post('/deleteservicesSchema', productcontrol.deleteservicesSchema);

router.post('/deleteOneHousePhoto', productcontrol.deleteOneHousePhoto);

router.get('/getserviceSchema', productcontrol.getserviceSchema);




router.post('/Leadershipcreate', productcontrol.Leadershipcreate);
router.put('/Leadershipupdate', productcontrol.LeadershipupdateSchema);
router.post('/LeadershipdeleteSchema', productcontrol.LeadershipdeleteSchema);
router.get('/LeadershipgetSchema', productcontrol.LeadershipgetSchema);

// 380468
router.post('/createTestimonials', productcontrol.createTestimonials);
router.get('/getTestimonials', productcontrol.getTestimonials);
router.put('/updateTestimonials', productcontrol.updateTestimonials);
router.post('/deleteTestimonials', productcontrol.deleteTestimonials);  



// =====================================================
    // ⭐ Alprojects 
    // =====================================================
router.post('/createAlprojectsSchema', productcontrol.createAlprojectsSchema);
router.put('/updateAlprojectsSchema', productcontrol.updateAlprojectsSchema);
router.post('/deleteAlprojectsSchema', productcontrol.deleteAlprojectsSchema);
router.get('/getAlprojectsSchema', productcontrol.getAlprojectsSchema);



router.post('/multiUpload', productcontrol.multiUpload);

router.get('/get', productcontrol.get);

  // =====================================================
    // ⭐ carrer 
    // =====================================================
router.post('/createcarrer', productcontrol.createcarrer);
router.put('/updatecarrer', productcontrol.updatecarrer);
router.post('/deletecarrer', productcontrol.deletecarrer);
router.get('/getcarrer', productcontrol.getcarrer);
router.put('/CategoryFile',productcontrol.CategoryFile)
router.post('/createcounter', productcontrol.createcounter);
router.put('/updatecounter', productcontrol.updatecounter);
router.post('/deletecounter', productcontrol.deletecounter);
router.get('/getcounter', productcontrol.getcounter);



router.post('/createcontact', productcontrol.createcontact);
router.put('/updatecontact', productcontrol.updatecontact);
router.get('/getcontact', productcontrol.getcontact);
router.post('/deletecontact', productcontrol.deletecontact);
// =====================================================
    // ⭐ carrer 
    // =====================================================
router.get('/ViewProject/:id', productcontrol.ViewProject);
// =====================================================
    // ⭐  sliderscreate
    // =====================================================
router.post('/sliderscreate', productcontrol.sliderscreate);
router.post('/uploadProjectImages', productcontrol.uploadProjectImages);

router.get('/slidersget', productcontrol.slidersget);
router.post('/slidersdelete', productcontrol.slidersdelete);
router.put('/slidersupdate', productcontrol.slidersupdate);


router.put('/update', productcontrol.update);




router.post('/homeimage', productcontrol.homeimage);
router.get('/gethomeimage', productcontrol.gethomeimage);
router.post('/deletehomeimage', productcontrol.deletehomeimage);
router.post('/signup', productcontrol.signup);
router.post('/login', productcontrol.login);
// =====================================================
    // ⭐ createform 
    // =====================================================
router.post('/createform', productcontrol.createform);
router.get('/getform', productcontrol.getform);
router.put('/updateform', productcontrol.updateform);


router.post('/deleted', productcontrol.deleted);

module.exports = router;
