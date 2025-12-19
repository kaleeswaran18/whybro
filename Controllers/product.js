const { Product, Project, AllProjects,Slider,Career,Customer,Founder,Homemediaimage,Testimonials,Leadership,Service,contact,Counter,Login } = require('../Models/productSchema');
const bcrypt = require("bcrypt");
const cloudinary = require('../multer');
const moment = require("moment-timezone");
const productcontrol = () => {

const jwt = require("jsonwebtoken");


const multiUpload = async (req, res) => {
  try {
    const { projectName } = req.body;

    if (!projectName) {
      return res.status(400).json({ statuscode: 400, message: "Project name required" });
    }

    if (!req.files || !req.files.files) {
      return res.status(400).json({ statuscode: 400, message: "Minimum 1 file required" });
    }

    let files = req.files.files;

    if (!Array.isArray(files)) files = [files];

    if (files.length > 5) {
      return res.status(400).json({ statuscode: 400, message: "Only 5 files allowed" });
    }

    // ⭐ Find existing project
    const project = await AllProjects.findOne({ name: projectName });

    if (!project) {
      return res.status(404).json({
        statuscode: 404,
        message: "Project not found. Create project first."
      });
    }

    // ⭐ Guarantee files is an array
    if (!Array.isArray(project.files)) {
      project.files = [];
    }

    let uploadedFiles = [];

    for (let f of files) {
      const upload = await cloudinary.uploader.upload(f.tempFilePath, {
        resource_type: "auto",
        folder: "house/projects",
      });

      uploadedFiles.push({
        url: upload.secure_url,
        type: upload.resource_type,
      });
    }

    // ⭐ Push safely
    project.files.push(...uploadedFiles);

    await project.save();

    return res.status(200).json({
      statuscode: 200,
      message: "Images added successfully",
      data: project,
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      statuscode: 500,
      message: "Server Error"
    });
  }
};

const signup =async(req,res)=>{
   try {
    const { username, password } = req.body;

    // Check existing user
    const exist = await Login.findOne({ username });
    if (exist) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Save new user
    const user = new Login({
      username,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: "Signup successful" });

  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await Login.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // ---- JWT TOKEN GENERATION ----
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET || "mySecretKey",   // secret key
      { expiresIn: "1d" }                         // token expiration
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
      }
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



    // =====================================================
    // ⭐ CREATE PRODUCT (Cloudinary Upload)
    // =====================================================
  const create = async (req, res) => {
  try {
    console.log(req.body, req.files?.file, "check");

    // ⭐ Check file exists
    if (!req.files || !req.files.file) {
      return res.status(400).json({ msg: "Image is required" });
    }

    const file = req.files.file;

    // ⭐ Upload image OR video automatically
    const uploaded = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto", // <-- Handles image, video, pdf, etc.
      folder: "products/media", // Universal folder
    });

    console.log(uploaded, "uploaded");

    // ⭐ Create DB record
    const createdata = await Project.create({
      name: req.body.name,
      location: req.body.location,
      bhk: req.body.bhk,
      description:req.body.description,

      // Save file URL (image/video/pdf)
      image: uploaded.secure_url,

      // Save Cloudinary media type (image / video / raw)
      mediaType: uploaded.resource_type,
    });

    res.status(200).json({
      statuscode: 200,
      message: "Product created Successfully",
      data: createdata,
    });

  } catch (err) {
    console.log(err);
    res.status(500).send("Please Provide Valid Data!!!");
  }
};
 const uploadProjectImages = async (req, res) => {
  try {
    console.log(req.body, req.files?.file, "check");

    // ⭐ Check file exists
    if (!req.files || !req.files.file) {
      return res.status(400).json({ msg: "Image is required" });
    }

    const file = req.files.file;

    // ⭐ Upload image OR video automatically
    const uploaded = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto", // <-- Handles image, video, pdf, etc.
      folder: "products/media", // Universal folder
    });

    console.log(uploaded, "uploaded");

    // ⭐ Create DB record
    const createdata = await Project.create({
      name: req.body.name,
      location: req.body.location,
      bhk: req.body.bhk,
      description:req.body.description,

      // Save file URL (image/video/pdf)
      image: uploaded.secure_url,

      // Save Cloudinary media type (image / video / raw)
      mediaType: uploaded.resource_type,
    });

    res.status(200).json({
      statuscode: 200,
      message: "Product created Successfully",
      data: createdata,
    });

  } catch (err) {
    console.log(err);
    res.status(500).send("Please Provide Valid Data!!!");
  }
};

const updateprojectsSchema = async (req, res) => {
  try {
    console.log(req.body, req.files?.file, "check");

    const id = req.body._id; 
    if (!id) {
      return res.status(400).json({ msg: "ID is required for update" });
    }

    // ⭐ Find existing project
    const oldData = await Project.findById(id);
    if (!oldData) {
      return res.status(404).json({ msg: "Project not found" });
    }

    let fileUrl = oldData.image;        // Keep old URL
    let fileType = oldData.mediaType;   // Keep old type

    // ⭐ If new file uploaded → process it
    if (req.files && req.files.file) {
      const file = req.files.file;

      const uploaded = await cloudinary.uploader.upload(file.tempFilePath, {
        resource_type: "auto",  // ⭐ Supports image + video
        folder: "products/media",
      });

      fileUrl = uploaded.secure_url;
      fileType = uploaded.resource_type;   // ⭐ image / video / raw
    }

    // ⭐ Update database
    const updated = await Project.findByIdAndUpdate(
      id,
      {
        name: req.body.name || oldData.name,
        location: req.body.location || oldData.location,
        bhk: req.body.bhk || oldData.bhk,
       description:req.body.description||oldData.description,
        image: fileUrl,
        mediaType: fileType,
      },
      { new: true }
    );

    res.status(200).json({
      statuscode: 200,
      message: "Project updated successfully",
      data: updated,
    });

  } catch (err) {
    console.log(err);
    res.status(500).send("Please Provide Valid Data!!!");
  }
};


     const deleteprojectsSchema = async (req, res) => {
        try {
            
   const result = await Project.deleteOne({ _id: req.body._id });
            res.status(200).json({
                statuscode:200,
                message: "Project delete Successfully",
                data: createdata,
            });

        } catch (err) {
            console.log(err);
            res.status(500).send("Please Provide Valid Data!!!");
        }
    };
     const getprojectsSchema = async (req, res) => {
        try {
           

            
            

            const createdata = await Project.find({
               
            });

            res.status(200).json({
                statuscode:200,
                message: "get a data Successfully",
                data: createdata,
            });

        } catch (err) {
            console.log(err);
            res.status(500).send("Please Provide Valid Data!!!");
        }
    };
const Foundercreate = async (req, res) => {
  try {
    console.log(req.body, req.files?.file, "check");

    if (!req.files || !req.files.file) {
      return res.status(400).json({ msg: "File is required" });
    }

    const file = req.files.file;

    // ⭐ Upload Image or Video Automatically
    const uploaded = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto", // <-- supports image + video
      folder: "products/media",
    });

    console.log(uploaded, "uploaded");

    const createdata = await Founder.create({
      name: req.body.name,
      role: req.body.role,
      description: req.body.description,

      // ⭐ Store uploaded file URL
      image: uploaded.secure_url,

      // ⭐ Save file type (image / video)
      mediaType: uploaded.resource_type,
    });

    res.status(200).json({
      statuscode: 200,
      message: "Founder created successfully",
      data: createdata,
    });

  } catch (err) {
    console.log(err);
    res.status(500).send("Please Provide Valid Data!!!");
  }
};


const FounderupdateSchema = async (req, res) => {
  try {
    console.log(req.body, req.files?.file, "check");

    const id = req.body._id;
    if (!id) {
      return res.status(400).json({ msg: "ID is required for update" });
    }

    // ⭐ Find existing founder data
    const oldData = await Founder.findById(id);
    if (!oldData) {
      return res.status(404).json({ msg: "Founder not found" });
    }

    let fileUrl = oldData.image;       // keep old image/video
    let fileType = oldData.mediaType;  // keep old type

    // ⭐ If new file uploaded → update
    if (req.files && req.files.file) {
      const file = req.files.file;

      const uploaded = await cloudinary.uploader.upload(file.tempFilePath, {
        resource_type: "auto",   // ⭐ supports IMAGE + VIDEO
        folder: "products/media",
      });

      fileUrl = uploaded.secure_url;
      fileType = uploaded.resource_type; // ⭐ image / video
    }

    // ⭐ Update founder details
    const updated = await Founder.findByIdAndUpdate(
      id,
      {
        name: req.body.name || oldData.name,
        role: req.body.role || oldData.role,
        description: req.body.description || oldData.description,
        image: fileUrl,
        mediaType: fileType,
      },
      { new: true }
    );

    res.status(200).json({
      statuscode: 200,
      message: "Founder updated successfully",
      data: updated,
    });

  } catch (err) {
    console.log(err);
    res.status(500).send("Please Provide Valid Data!!!");
  }
};


     const FounderdeleteSchema = async (req, res) => {
        try {
            
   const result = await Founder.deleteOne({ _id: req.body._id });
            res.status(200).json({
                statuscode:200,
                message: "Project delete Successfully",
                data: createdata,
            });

        } catch (err) {
            console.log(err);
            res.status(500).send("Please Provide Valid Data!!!");
        }
    };
     const FoundergetSchema = async (req, res) => {
        try {
           

            
            

            const createdata = await Founder.find({
               
            });

            res.status(200).json({
                statuscode:200,
                message: "get a data Successfully",
                data: createdata,
            });

        } catch (err) {
            console.log(err);
            res.status(500).send("Please Provide Valid Data!!!");
        }
    };

const Leadershipcreate = async (req, res) => {
  try {
    console.log(req.body, req.files?.file, "check");

    if (!req.files || !req.files.file) {
      return res.status(400).json({ msg: "File is required" });
    }

    const file = req.files.file;

    // ⭐ Upload image or video
    const uploaded = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto", // supports both image + video
      folder: "products/media",
    });

    console.log(uploaded, "uploaded");

    const createdata = await Leadership.create({
      name: req.body.name,
      role: req.body.role,
      description: req.body.description,

      // ⭐ Store file URL
      image: uploaded.secure_url,

      // ⭐ Save file type (image/video)
      mediaType: uploaded.resource_type,
    });

    res.status(200).json({
      statuscode: 200,
      message: "Leadership member created successfully",
      data: createdata,
    });

  } catch (err) {
    console.log(err);
    res.status(500).send("Please Provide Valid Data!!!");
  }
};


const LeadershipupdateSchema = async (req, res) => {
  try {
    console.log(req.body, req.files?.file, "check");

    const id = req.body._id; // frontend must send this

    if (!id) {
      return res.status(400).json({ msg: "ID is required for update" });
    }

    // ⭐ Find old record
    const oldData = await Leadership.findById(id);

    if (!oldData) {
      return res.status(404).json({ msg: "Leadership member not found" });
    }

    let fileUrl = oldData.image;        // keep old URL
    let mediaType = oldData.mediaType;  // keep old media type

    // ⭐ If new file uploaded → upload to Cloudinary
    if (req.files && req.files.file) {
      const file = req.files.file;

      const uploaded = await cloudinary.uploader.upload(file.tempFilePath, {
        resource_type: "auto",       // supports video + image
        folder: "products/media",
      });

      fileUrl = uploaded.secure_url;
      mediaType = uploaded.resource_type;
    }

    // ⭐ Update the data
    const updated = await Leadership.findByIdAndUpdate(
      id,
      {
        name: req.body.name ?? oldData.name,
        role: req.body.role ?? oldData.role,
        description: req.body.description ?? oldData.description,

        // Updated file URL or old one
        image: fileUrl,

        // store image/video
        mediaType: mediaType,
      },
      { new: true }
    );

    res.status(200).json({
      statuscode: 200,
      message: "Leadership member updated successfully",
      data: updated,
    });

  } catch (err) {
    console.log(err);
    res.status(500).send("Please Provide Valid Data!!!");
  }
};


     const LeadershipdeleteSchema = async (req, res) => {
        try {
            
   const result = await Leadership.deleteOne({ _id: req.body._id });
            res.status(200).json({
                statuscode:200,
                message: "Project delete Successfully",
                data: createdata,
            });

        } catch (err) {
            console.log(err);
            res.status(500).send("Please Provide Valid Data!!!",err);
        }
    };
     const LeadershipgetSchema = async (req, res) => {
        try {
           

            
            

            const createdata = await Leadership.find({
               
            });

            res.status(200).json({
                statuscode:200,
                message: "get a data Successfully",
                data: createdata,
            });

        } catch (err) {
            console.log(err);
            res.status(500).send("Please Provide Valid Data!!!");
        }
    };

  const homeimage = async (req, res) => {
  try {
    console.log(req.body, req.files?.file, "check");

    if (!req.files || !req.files.file) {
      return res.status(400).json({ msg: "File is required" });
    }

    const file = req.files.file;

    // ⭐ Auto detect image or video
    const uploaded = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",   // <-- supports IMAGE + VIDEO
      folder: "products/media",
    });

    console.log(uploaded, "uploaded");

    const createdata = await Homemediaimage.create({
      image: uploaded.secure_url,    // ⭐ File URL (img/video)
      mediaType: uploaded.resource_type,  // ⭐ "image" or "video"
    });

    res.status(200).json({
      statuscode: 200,
      message: "Media uploaded successfully",
      data: createdata,
    });

  } catch (err) {
    console.log(err);
    res.status(500).send("Please Provide Valid Data!!!");
  }
};


 
     const deletehomeimage = async (req, res) => {
        try {
            
   const result = await Homemediaimage.deleteOne({ _id: req.body._id });
            res.status(200).json({
                statuscode:200,
                message: "Project delete Successfully",
                data: createdata,
            });

        } catch (err) {
            console.log(err);
            res.status(500).send("Please Provide Valid Data!!!");
        }
    };
     const gethomeimage = async (req, res) => {
        try {
           

            
            

            const createdata = await Homemediaimage.find({
               
            });

            res.status(200).json({
                statuscode:200,
                message: "get a data Successfully",
                data: createdata,
            });

        } catch (err) {
            console.log(err);
            res.status(500).send("Please Provide Valid Data!!!");
        }
    };


     // =====================================================
    // ⭐ createform 
    // =====================================================
    const createform = async (req, res) => {
        try {
           console.log(req.body,'req.body')
            const createdata = await Customer.create({
                
                name: req.body.name,
            phone: req.body.mobile,
            message: req.body.message,
            email: req.body.email,
            project:req.body.project,
            BHKPreference:req.body.bhk+"bhk",
            status:" ",
 
            // 👉 Store Day & Time Separately
            day: moment().tz("Asia/Kolkata").format("DD-MM-YYYY"), // 20-11-2025
            time: moment().tz("Asia/Kolkata").format("hh:mm A"),   // 07:52 AM
            });

            res.status(200).json({
                statuscode:200,
                message: "Create form succssfully created Successfully",
                data: createdata,
            });

        } catch (err) {
            console.log(err);
            res.status(500).send("Please Provide Valid Data!!!",err);
        }
    };

 const getform = async (req, res) => {
        try {
           
            const createdata = await Customer.find({});

            res.status(200).json({
                statuscode:200,
                message: "Get all form data Successfully",
                data: createdata,
            });

        } catch (err) {
            console.log(err);
            res.status(500).send("Please Provide Valid Data!!!");
        }
    };

    // =====================================================
    // ⭐ Testimonials 
    // =====================================================
  const createTestimonials = async (req, res) => {
  try {
    console.log(req.body, req.files?.file, "check");

    // ⭐ Check if file exists
    if (!req.files || !req.files.file) {
      return res.status(400).json({ msg: "File is required" });
    }

    const file = req.files.file;

    // ⭐ Upload (image/video auto detect)
    const uploaded = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",   // auto detect image OR video
      folder: "testimonials/media",
    });

    console.log(uploaded, "uploaded");

    // ⭐ Create testimonial
    const createdata = await Testimonials.create({
      name: req.body.name,
      location: req.body.location,
      project: req.body.project,
      rating: req.body.rating,
      text: req.body.text,

      // ⭐ Save file URL (image or video)
      image: uploaded.secure_url,

      // ⭐ Save file type: "image" or "video"
      mediaType: uploaded.resource_type,

      // ⭐ Save date
      day: moment().tz("Asia/Kolkata").format("DD-MM-YYYY"),
    });

    res.status(200).json({
      statuscode: 200,
      message: "Testimonial created successfully",
      data: createdata,
    });

  } catch (err) {
    console.log(err);
    res.status(500).send("Please Provide Valid Data!!!");
  }
};


 const getTestimonials = async (req, res) => {
        try {
           
            const createdata = await Testimonials.find({});

            res.status(200).json({
                statuscode:200,
                message: "Get all form data Successfully",
                data: createdata,
            });

        } catch (err) {
            console.log(err);
            res.status(500).send("Please Provide Valid Data!!!");
        }
    };
const updateTestimonials = async (req, res) => {
  try {
    console.log(req.body, req.files?.file, "check-update");

    const id = req.body._id;
    if (!id) return res.status(400).json({ msg: "ID is required" });

    // ⭐ Find existing document
    const oldData = await Testimonials.findById(id);
    if (!oldData) {
      return res.status(404).json({ msg: "Testimonial not found" });
    }

    let imageUrl = oldData.image;
    let mediaType = oldData.mediaType;

    // ⭐ If new file uploaded → upload to Cloudinary
    if (req.files && req.files.file) {
      const file = req.files.file;

      const uploaded = await cloudinary.uploader.upload(file.tempFilePath, {
        resource_type: "auto",  // image/video
        folder: "testimonials/media",
      });

      imageUrl = uploaded.secure_url;
      mediaType = uploaded.resource_type;
    }

    // ⭐ Prepare update object
    const updateData = {
      name: req.body.name || oldData.name,
      location: req.body.location || oldData.location,
      project: req.body.project || oldData.project,
      rating: req.body.rating || oldData.rating,
      text: req.body.text || oldData.text,

      // ⭐ Updated image & media type
      image: imageUrl,
      mediaType: mediaType,

      // ⭐ Update date (if needed)
      day: moment().tz("Asia/Kolkata").format("DD-MM-YYYY"),
    };

    // ⭐ Save updated data
    const updated = await Testimonials.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({
      statuscode: 200,
      message: "Testimonials updated successfully",
      data: updated,
    });

  } catch (err) {
    console.log(err);
    res.status(500).send("Please Provide Valid Data!!!");
  }
};

   const updateform = async (req, res) => {
  try {
    const id = req.body._id;

    if (!id) {
      return res.status(400).json({ msg: "ID is required" });
    }

    // ⭐ Only extract status
    const statusValue = req.body.status;

    if (statusValue === undefined) {
      return res.status(400).json({ msg: "Status is required" });
    }

    // ⭐ Update ONLY status field — nothing else is modified
    const updated = await Customer.findByIdAndUpdate(
      id,
      { $set: { status: statusValue } },  // update ONLY this field
      { new: true }
    );

    res.status(200).json({
      statuscode: 200,
      message: "Status updated successfully",
      data: updated
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Please Provide Valid Data!!!" });
  }
};

     const deleteTestimonials = async (req, res) => {
        try {
           const result = await Testimonials.deleteOne({ _id: req.body._id });
           

            res.status(200).json({
                statuscode:200,
                message: "testimonials  delete Successfully",
                data: createdata,
            });

        } catch (err) {
            console.log(err);
            res.status(500).send("Please Provide Valid Data!!!");
        }
    };

    
      // =====================================================
    // ⭐ createcarrer 
    // =====================================================
     const createcarrer = async (req, res) => {
        try {
           
            const createdata = await Career.create({
                
                title: req.body.title,
                    department: req.body.department,
                location: req.body.location,
                 type: req.body.type,
                // ⭐ Cloudinary URL
            });

            res.status(200).json({
                statuscode:200,
                message: "Product created Successfully",
                data: createdata,
            });

        } catch (err) {
            console.log(err);
            res.status(500).send("Please Provide Valid Data!!!");
        }
    };

 

const CategoryFile = async (req, res) => {
  try {
    const { _id } = req.body;

    // 1️⃣ Validate project
    const project = await AllProjects.findById(_id);
    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    // 2️⃣ Validate files exist
    const fileKeys = Object.keys(req.files || {});
    if (fileKeys.length === 0) {
      return res.status(400).json({ msg: "No files received" });
    }

    console.log("🔥 Incoming Files:", req.files);
    console.log("📌 Category Keys:", fileKeys);

    // 3️⃣ Process each uploaded category file
    for (let key of fileKeys) {

      // Single / multiple file support
      const file = Array.isArray(req.files[key])
        ? req.files[key][0]
        : req.files[key];

      // Skip empty / invalid file fields
      if (!file || !file.size || file.size === 0 || !file.tempFilePath) {
        console.log("⏭ Skipping empty field:", key);
        continue;
      }

      console.log(`⬆️ Uploading Category: ${key}`);

      // 4️⃣ Upload to Cloudinary
      const uploaded = await cloudinary.uploader.upload(
        file.tempFilePath,
        {
          resource_type: "auto",
          folder: "products/media"
        }
      );

      console.log("✔ Uploaded:", uploaded.secure_url);

      // 5️⃣ Ensure category array exists
      if (!project.categorytab[key]) {
        project.categorytab[key] = [];
      }

      // 6️⃣ Push file inside the category tab
      project.categorytab[key].push({
        url: uploaded.secure_url,
        type: uploaded.resource_type
      });
    }

    // ⭐ REQUIRED FIX for Schema.Types.Mixed
    project.markModified("categorytab");

    // 7️⃣ Save updated project
    await project.save();

    // 8️⃣ Return updated project
    res.status(200).json({
      statuscode: 200,
      message: "Category files added successfully",
      data: project
    });

  } catch (err) {
    console.error("❌ CategoryFile Error:", err);
    res.status(500).json({
      msg: "Server Error",
      error: err.message
    });
  }
};





    
     const updatecarrer = async (req, res) => {
        try {
           
          
            const updateData = {
                  title: req.body.title,
                    department: req.body.department,
                location: req.body.location,
                 type: req.body.type,
            };

         

            const updated = await Career.findByIdAndUpdate(
                req.body._id,
                updateData,
                { new: true }
            );
            res.status(200).json({
                statuscode:200,
                message: "Updatecarrer post Successfully",
                
            });

        } catch (err) {
            console.log(err);
            res.status(500).send("Please Provide Valid Data!!!");
        }
    };
      const createcounter = async (req, res) => {
        try {
           
            const createdata = await Counter.create({
              
                title: req.body.title,
                    value: req.body.value,
                suffix: req.body.suffix,
                
            });

            res.status(200).json({
                statuscode:200,
                message: "Product created Successfully",
                data: createdata,
            });

        } catch (err) {
            console.log(err);
            res.status(500).send("Please Provide Valid Data!!!");
        }
    };
    const updatecounter = async (req, res) => {
        try {
           
          
            const updateData = {
                    title: req.body.title,
                    value: req.body.value,
                suffix: req.body.suffix,
            };

         

            const updated = await Counter.findByIdAndUpdate(
                req.body._id,
                updateData,
                { new: true }
            );
            res.status(200).json({
                statuscode:200,
                message: "Updatecarrer post Successfully",
                
            });

        } catch (err) {
            console.log(err);
            res.status(500).send("Please Provide Valid Data!!!");
        }
    };
     const deletecounter = async (req, res) => {
        try {
           const result = await Counter.deleteOne({ _id: req.body._id });
           

            res.status(200).json({
                statuscode:200,
                message: "Carrer post delete Successfully",
                
            });

        } catch (err) {
            console.log(err);
            res.status(500).send("Please Provide Valid Data!!!");
        }
    };
      const getcounter = async (req, res) => {
        try {
           
            const createdata = await Counter.find({});

            res.status(200).json({
                statuscode:200,
                message: "get all carrerpost Successfully",
                data: createdata,
            });

        } catch (err) {
            console.log(err);
            res.status(500).send("Please Provide Valid Data!!!");
        }
    };
      const updatecontact = async (req, res) => {
        try {
   
          console.log(req.body.address,' req.body.address')
            const updateData = {
                  address: req.body.address,
                    phone: req.body.phone,
                email: req.body.email,
                 businessHours: req.body.businessHours,
            };

         

            const updated = await contact.findByIdAndUpdate(
                req.body._id,
                updateData,
                { new: true }
            );
            res.status(200).json({
                statuscode:200,
                message: "Updatecarrer post Successfully",
              
            });

        } catch (err) {
            console.log(err);
            res.status(500).send("Please Provide Valid Data!!!",err);
        }
    };
   
      const createcontact = async (req, res) => {
        try {
           
            const createdata = await contact.create({
                
                address: req.body.address,
                    phone: req.body.phone,
                email: req.body.email,
                 businessHours: req.body.businessHours,
                // ⭐ Cloudinary URL
            });

            res.status(200).json({
                statuscode:200,
                message: "Product created Successfully",
                data: createdata,
            });

        } catch (err) {
            console.log(err);
            res.status(500).send("Please Provide Valid Data!!!");
        }
    };
     const deletecarrer = async (req, res) => {
        try {
           const result = await Career.deleteOne({ _id: req.body._id });
           

            res.status(200).json({
                statuscode:200,
                message: "Carrer post delete Successfully",
                data: createdata,
            });

        } catch (err) {
            console.log(err);
            res.status(500).send("Please Provide Valid Data!!!");
        }
    };
       const deletecontact = async (req, res) => {
        try {
           const result = await contact.deleteOne({ _id: req.body._id });
           

            res.status(200).json({
                statuscode:200,
                message: "Carrer post delete Successfully",
               
            });

        } catch (err) {
            console.log(err);
            res.status(500).send("Please Provide Valid Data!!!");
        }
    };
   const deleteOneHousePhoto = async (req, res) => {
  try {
    const { _id, url } = req.body;

    console.log("REQ BODY:", req.body);

    if (!_id || !url) {
      return res.status(400).json({
        statuscode: 400,
        message: "projectId and url are required",
      });
    }

    // 1️⃣ Project கண்டுபிடிக்க
    const project = await AllProjects.findById(_id);

    if (!project) {
      return res.status(404).json({
        statuscode: 404,
        message: "Project not found",
      });
    }

    // 2️⃣ files array-இல் இருந்து matching URL remove பண்ண
    project.files = project.files.filter(
      (file) => file.url !== url
    );

    // 3️⃣ Cloudinary delete பண்ண
    try {
      const publicId = url.split("/").slice(-1)[0].split(".")[0];
      await cloudinary.uploader.destroy("house/projects/" + publicId);
    } catch (e) {
      console.log("Cloudinary delete error:", e);
    }

    // 4️⃣ Save updated document
    await project.save();

    return res.status(200).json({
      statuscode: 200,
      message: "Photo deleted successfully",
      data: project,
    });

  } catch (err) {
    console.log("ERROR:", err);
    return res.status(500).json({
      statuscode: 500,
      message: "Internal Server Error",
    });
  }
};

    
      const getcarrer = async (req, res) => {
        try {
           
            const createdata = await Career.find({});

            res.status(200).json({
                statuscode:200,
                message: "get all carrerpost Successfully",
                data: createdata,
            });

        } catch (err) {
            console.log(err);
            res.status(500).send("Please Provide Valid Data!!!");
        }
    };
    
      const getcontact = async (req, res) => {
        try {
           
            const createdata = await contact.find({});

            res.status(200).json({
                statuscode:200,
                message: "get all carrerpost Successfully",
                data: createdata,
            });

        } catch (err) {
            console.log(err);
            res.status(500).send("Please Provide Valid Data!!!");
        }
    };
    // =====================================================
    // ⭐ sliderscreate 
    // =====================================================
const sliderscreate = async (req, res) => {
  try {
    console.log(req.body, req.files?.file, "check-slider");

    if (!req.files || !req.files.file) {
      return res.status(400).json({ msg: "File is required" });
    }

    const file = req.files.file;

    // ⭐ Upload (auto detect: image/video)
    const uploaded = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",     // <-- IMPORTANT (supports image + video)
      folder: "slider/media",    // you can keep images folder if you want
    });

    // ⭐ Check existing slider (only one document exists always)
    let sliderDoc = await Slider.findOne();

    if (!sliderDoc) {
      // Create first doc
      sliderDoc = await Slider.create({
        images: [
          {
            url: uploaded.secure_url,
            type: uploaded.resource_type,  // image or video
          }
        ]
      });
    } else {
      // Push new file
      sliderDoc.images.push({
        url: uploaded.secure_url,
        type: uploaded.resource_type,
      });

      await sliderDoc.save();
    }

    res.status(200).json({
      statuscode: 200,
      message: "Slider updated successfully",
      data: sliderDoc,
    });

  } catch (err) {
    console.log(err);
    res.status(500).send("Please Provide Valid Data!!!");
  }
};

const slidersdelete = async (req, res) => {
  try {
    const { _id, url } = req.body;

    if (!_id || !url) {
      return res.status(400).json({ msg: "Image URL and ID required" });
    }

    // ⭐ Correct way to remove an object inside array
    const updated = await Slider.findByIdAndUpdate(
      _id,
      { $pull: { images: { url: url } } },
      { new: true }
    );

    res.status(200).json({
      statuscode: 200,
      message: "Image removed successfully",
      data: updated,
    });

  } catch (err) {
    console.log(err);
    res.status(500).send("Please Provide Valid Data!!!");
  }
};

const slidersupdate = async (req, res) => {
  try {
    const { _id, oldImageUrl } = req.body;

    if (!_id) {
      return res.status(400).json({ message: "Slider ID is required" });
    }

    const slider = await Slider.findById(_id);
    if (!slider) {
      return res.status(404).json({ message: "Slider not found" });
    }

    // --------------------------------------
    // 1️⃣ REMOVE IMAGE (if requested)
    // --------------------------------------
    if (oldImageUrl) {
      slider.images = slider.images.filter((img) => img !== oldImageUrl);
    }

    // --------------------------------------
    // 2️⃣ ADD / REPLACE IMAGE (if uploaded)
    // --------------------------------------
    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "slider/images",
      });

      slider.images.push(uploaded.secure_url);
    }

    // --------------------------------------
    // 3️⃣ SAVE UPDATED DOCUMENT
    // --------------------------------------
    const updatedSlider = await slider.save();

    res.status(200).json({
        statuscode:200,
      message: "Slider updated successfully",
      data: updatedSlider,
    });

  } catch (err) {
    console.log("Slider update error:", err);
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

   
     const slidersget = async (req, res) => {
        try {
    
     const sliderData = await Slider.find();
    res.status(200).json({
        statuscode:200,
      message: "Slider updated successfully",
      data: sliderData,
    });

  } catch (err) {
    console.log(err);
    res.status(500).send("Please Provide Valid Data!!!");
  }
};
// =====================================================
    // ⭐ createAlprojectsSchema 
    // =====================================================
 const createAlprojectsSchema = async (req, res) => {
  try {
    console.log(req.body, req.files?.file, "incoming-create");

    if (!req.files || !req.files.file) {
      return res.status(400).json({ statuscode: 400, msg: "File is required" });
    }

    const file = req.files.file;

    if (!file.tempFilePath) {
      return res.status(400).json({ statuscode: 400, msg: "Invalid file upload" });
    }

    if (!req.body.projectPlace) {
      return res.status(400).json({ statuscode: 400, msg: "projectPlace is required" });
    }

    const project = await Project.findOne({ name: req.body.projectPlace });

    if (!project) {
      return res.status(404).json({ statuscode: 404, msg: "Project Place not found" });
    }

    const uploaded = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
      folder: "products/media",
    });

    console.log(uploaded, "uploaded");

    const createdata = await AllProjects.create({
      projectPlace: req.body.projectPlace,
      projectPlaceid: project._id,

      name: req.body.name,
      location: req.body.location,
      bhk: req.body.bhk,

      image: uploaded.secure_url,
      mediaType: uploaded.resource_type,

      // ⭐ Default categories created here
      categorytab: {
        elevation: [],
        floorplan: [],
        isometric: [],
        interior: [],
        projectview: [],
        video: [],
        siteprogress: []
      }
    });

    res.status(200).json({
      statuscode: 200,
      message: "Project created Successfully",
      data: createdata,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      statuscode: 500,
      msg: "Please Provide Valid Data!!!",
      error: err.message,
    });
  }
};




 const updateAlprojectsSchema = async (req, res) => {
  try {
    console.log(req.body, req.files?.file, "incoming-update");

    const id = req.body._id;

    // ⭐ Validate ID
    if (!id) {
      return res.status(400).json({ statuscode: 400, msg: "ID is required for update" });
    }

    // ⭐ Find old data
    const oldData = await AllProjects.findById(id);

    if (!oldData) {
      return res.status(404).json({ statuscode: 404, msg: "Project not found" });
    }

    // ================================
    // HANDLE PROJECT PLACE CHANGE
    // ================================
    let projectPlaceId = oldData.projectPlaceid;
    let projectPlace = oldData.projectPlace;

    if (req.body.projectPlace) {
      const project = await Project.findOne({ name: req.body.projectPlace });

      if (!project) {
        return res.status(404).json({ statuscode: 404, msg: "Project Place not found" });
      }

      projectPlaceId = project._id;
      projectPlace = req.body.projectPlace;
    }

    // ================================
    // HANDLE IMAGE / VIDEO UPDATE
    // ================================
    let fileUrl = oldData.image;
    let mediaType = oldData.mediaType;

    if (req.files && req.files.file) {
      const file = req.files.file;

      const uploaded = await cloudinary.uploader.upload(file.tempFilePath, {
        resource_type: "auto",  // <-- supports image / video
        folder: "products/media",
      });

      fileUrl = uploaded.secure_url;
      mediaType = uploaded.resource_type; // "image" or "video"
    }

    // ================================
    // UPDATE DOCUMENT
    // ================================
    const updated = await AllProjects.findByIdAndUpdate(
      id,
      {
        projectPlace,
        projectPlaceid: projectPlaceId,

        name: req.body.name || oldData.name,
        location: req.body.location || oldData.location,
        bhk: req.body.bhk || oldData.bhk,

        image: fileUrl,
        mediaType: mediaType,
      },
      { new: true }
    );

    return res.status(200).json({
      statuscode: 200,
      message: "Project updated successfully",
      data: updated,
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      statuscode: 500,
      msg: "Please Provide Valid Data!!!",
      error: err.message
    });
  }
};


     const deleteAlprojectsSchema = async (req, res) => {
        try {
            
   const result = await AllProjects.deleteOne({ _id: req.body._id });
            res.status(200).json({
                statuscode:200,
                message: "Project delete Successfully",
                data: createdata,
            });

        } catch (err) {
            console.log(err);
            res.status(500).send("Please Provide Valid Data!!!");
        }
    };
     const getAlprojectsSchema = async (req, res) => {
        try {
           

            
            

            const createdata = await AllProjects.find({
               
            });

            res.status(200).json({
                statuscode:200,
                message: "get a data Successfully",
                data: createdata,
            });

        } catch (err) {
            console.log(err);
            res.status(500).send("Please Provide Valid Data!!!");
        }
    };
      const getAlprojectscategorySchema = async (req, res) => {
        try {
           

            
            

            const createdata = await AllProjects.find({
               _id:req.body._id
            });

            res.status(200).json({
                statuscode:200,
                message: "get a data Successfully",
                data: createdata,
            });

        } catch (err) {
            console.log(err);
            res.status(500).send("Please Provide Valid Data!!!");
        }
    };


const servicecreate = async (req, res) => {
  try {
    console.log(req.body, req.files?.file, "incoming-service");

    // ⭐ Validate file
    if (!req.files || !req.files.file) {
      return res.status(400).json({
        statuscode: 400,
        msg: "File (image/video) is required",
      });
    }

    const file = req.files.file;

    if (!file.tempFilePath) {
      return res.status(400).json({
        statuscode: 400,
        msg: "Invalid file upload",
      });
    }

    // ⭐ Upload file (image/video auto detect)
    const uploaded = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto", // image or video
      folder: "products/services",
    });

    console.log(uploaded, "uploaded");

    // ⭐ Create service entry
    const createdata = await Service.create({
      name: req.body.name,
      role: req.body.role,

      // store file URL
      image: uploaded.secure_url,

      // store media type → image / video
      mediaType: uploaded.resource_type,
    });

    res.status(200).json({
      statuscode: 200,
      message: "Service created successfully",
      data: createdata,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      statuscode: 500,
      msg: "Please Provide Valid Data!!!",
      error: err.message,
    });
  }
};


const updateservicecreateSchema = async (req, res) => {
  try {
    console.log(req.body, req.files?.file, "service-update");

    const id = req.body._id;

    if (!id) {
      return res.status(400).json({ msg: "ID is required for update" });
    }

    // ⭐ Find existing service
    const oldData = await Service.findById(id);

    if (!oldData) {
      return res.status(404).json({ msg: "Service not found" });
    }

    let fileUrl = oldData.image;      // keep old file
    let mediaType = oldData.mediaType; // keep old media type

    // ⭐ If new file uploaded → upload (image/video)
    if (req.files && req.files.file) {
      const file = req.files.file;

      const uploaded = await cloudinary.uploader.upload(file.tempFilePath, {
        resource_type: "auto",       // auto detect image / video
        folder: "products/services", // store properly
      });

      fileUrl = uploaded.secure_url;
      mediaType = uploaded.resource_type; // image / video
    }

    // ⭐ Update data
    const updated = await Service.findByIdAndUpdate(
      id,
      {
        name: req.body.name || oldData.name,
        role: req.body.role || oldData.role,

        image: fileUrl,
        mediaType: mediaType,
      },
      { new: true }
    );

    res.status(200).json({
      statuscode: 200,
      message: "Service updated successfully",
      data: updated,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      statuscode: 500,
      msg: "Update failed",
      error: err.message,
    });
  }
};


     const deleteservicesSchema = async (req, res) => {
        try {
            
   const result = await Service.deleteOne({ _id: req.body._id });
            res.status(200).json({
                 statuscode:200,
                message: "Project delete Successfully",
                data: createdata,
            });

        } catch (err) {
            console.log(err);
            res.status(500).send("Please Provide Valid Data!!!");
        }
    };
     const getserviceSchema = async (req, res) => {
        try {
           

            
            

            const createdata = await Service.find({
               
            });

            res.status(200).json({
                 statuscode:200,
                message: "get a data Successfully",
                data: createdata,
            });

        } catch (err) {
            console.log(err);
            res.status(500).send("Please Provide Valid Data!!!");
        }
    };


    // =====================================================
    // ⭐ ViewProject
    // =====================================================
   const ViewProject = async (req, res) => {
        try {
            console.log(req.params.id)
            const projectname=await AllProjects.find({projectPlaceid:req.params.id})

           

            res.status(200).json({
                 statuscode:200,
                message: "Product created Successfully",
                data: projectname,
            });

        } catch (err) {
            console.log(err);
            res.status(500).send("Please Provide Valid Data!!!");
        }
    };

    // =====================================================
    // ⭐ GET ALL PRODUCTS
    // =====================================================
    const get = async (req, res) => {
        try {
            const findData = await product.find();
            res.status(200).send({
               statuscode:200,
                data: findData,
                message: "Got Products Successfully!"
            });
        } catch (err) {
            console.log("Error fetching products");
        }
    };


    // =====================================================
    // ⭐ UPDATE PRODUCT (with or without new image)
    // =====================================================
    const update = async (req, res) => {
        try {
            let newImageUrl = null;

            // If new image uploaded
            if (req.files && req.files.file) {
                const file = req.files.file;

                // Upload to Cloudinary
                const uploaded = await cloudinary.uploader.upload(file.tempFilePath, {
                    folder: "products/images",
                });

                newImageUrl = uploaded.secure_url;
            }

            // Update data object
            const updateData = {
                Id: req.body.Id,
                Name: req.body.Name,
                Price: req.body.Price,
                Description: req.body.Description,
            };

            if (newImageUrl) {
                updateData.Image = newImageUrl;
            }

            const updated = await product.findByIdAndUpdate(
                req.body.uID,
                updateData,
                { new: true }
            );

            res.status(200).json({
                 statuscode:200,
                message: "Product Updated Successfully!",
                data: updated,
            });

        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "Update failed" });
        }
    };


    // =====================================================
    // ⭐ DELETE PRODUCT
    // =====================================================
    const deleted = async (req, res) => {
        try {
            const result = await Product.deleteOne({ _id: req.body._id });

            res.status(200).send({
                 statuscode:200,
                data: result,
                message: "Product Deleted Successfully!"
            });

        } catch (err) {
            console.log("Something went wrong!!!");
        }
    };


    return {
        create,
        get,
        update,
        deleted,
        createAlprojectsSchema,
        ViewProject,
        sliderscreate,
        createform,
        createcarrer,
        updatecarrer,
        deletecarrer,
        getcarrer,
        getform,
        
        slidersdelete,
        slidersget,
        updateAlprojectsSchema,
        deleteAlprojectsSchema,
        getAlprojectsSchema,
          updateprojectsSchema,
        deleteprojectsSchema,
        getprojectsSchema,
        gethomeimage,
deletehomeimage,
multiUpload,
homeimage,
createTestimonials,
getTestimonials,
updateTestimonials,
deleteTestimonials,
slidersupdate,
FoundergetSchema,
FounderdeleteSchema,
FounderupdateSchema,
Foundercreate,
Leadershipcreate,
LeadershipupdateSchema,
LeadershipdeleteSchema,
LeadershipgetSchema,
servicecreate,
updateservicecreateSchema,
deleteservicesSchema,
getserviceSchema,
updatecontact,
createcontact,
getcontact,
deletecontact,
updateform,
createcounter,
updatecounter,
deletecounter,
getcounter,
uploadProjectImages,
signup,
login,
deleteOneHousePhoto,
CategoryFile,
getAlprojectscategorySchema
    };
};

module.exports = productcontrol();
