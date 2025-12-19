const mongoose = require("mongoose");

// -------------------------
// PRODUCT SCHEMA
// -------------------------
const productSchema = new mongoose.Schema({
    Id: Number,
    Name: String,
    Price: Number,
    Description: String,
    Image: String,
    mediaType: String
});
const Product = mongoose.model("product", productSchema);

// -------------------------
// PROJECT SCHEMA (OLD PROJECTS COLLECTION)
// -------------------------
const projectSchema = new mongoose.Schema({
    name: String,
    bhk: String,
    location: String,
    image: String,
    mediaType: String,
    description: String
});
const Project = mongoose.model("project", projectSchema);

// -------------------------
// COUNTERS SCHEMA
// -------------------------
const countersSchema = new mongoose.Schema({
    title: String,
    value: Number,
    suffix: String
});
const Counter = mongoose.model("counter", countersSchema);

// -------------------------
// ALL PROJECTS SCHEMA (THE ONE YOU UPLOAD FILES TO)
// -------------------------
const allProjectsSchema = new mongoose.Schema({
  name: String,
  projectPlaceid: String,
  iscomplete: { type: Boolean, default: false },
  projectPlace: String,
  bhk: String,
  location: String,
  image: String,
  mediaType: String,

  files: [
    {
      url: { type: String, required: true },
      type: { type: String, required: true }
    }
  ],

  // ⭐ DYNAMIC CATEGORY STORAGE
  categorytab: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
});


// ⭐ FIX MONGOOSE MODEL CACHE PROBLEM COMPLETELY
// delete mongoose.connection.models["AllProjects"];
// delete mongoose.modelSchemas["AllProjects"];

// ⭐ Create NEW REAL MODEL (collection remains "all_projects")
const AllProjects = mongoose.model("AllProjects", allProjectsSchema, "all_projects");

// -------------------------
// FOUNDER SCHEMA
// -------------------------
const FounderSchema = new mongoose.Schema({
    name: String,
    role: String,
    description: String,
    image: String,
    mediaType: String
});
const Founder = mongoose.model("FounderSchema", FounderSchema);

// -------------------------
// LEADERSHIP SCHEMA
// -------------------------
const LeadershipSchema = new mongoose.Schema({
    name: String,
    role: String,
    description: String,
    image: String,
    mediaType: String
});
const Leadership = mongoose.model("LeadershipSchema", LeadershipSchema);

// -------------------------
// SERVICE SCHEMA
// -------------------------
const ServiceSchema = new mongoose.Schema({
    name: String,
    role: String,
    image: String,
    mediaType: String
});
const Service = mongoose.model("ServiceSchema", ServiceSchema);

// -------------------------
// HOME SLIDER SCHEMA
// -------------------------
const sliderSchema = new mongoose.Schema({
    images: [
        {
            url: { type: String, required: true },
            type: { type: String, required: true }
        }
    ]
});
const Slider = mongoose.model("slider", sliderSchema);

// -------------------------
// HOME MEDIA IMAGE SCHEMA
// -------------------------
const homemediaimageSchema = new mongoose.Schema({
    image: String,
    mediaType: String
});
const Homemediaimage = mongoose.model("Homemediaimage", homemediaimageSchema);

// -------------------------
// TESTIMONIALS SCHEMA
// -------------------------
const testimonials = new mongoose.Schema({
    name: String,
    location: String,
    project: String,
    image: String,
    mediaType: String,
    rating: String,
    text: String,
    day: String
});
const Testimonials = mongoose.model("testimonials", testimonials);

// -------------------------
// CUSTOMER SCHEMA
// -------------------------
const customerSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email:String,
    message: String,
    project:String,
    BHKPreference:String,
    day: String,
    time: String,
    status: String
});
const Customer = mongoose.model("customer", customerSchema);

// -------------------------
// CAREER SCHEMA
// -------------------------
const careerSchema = new mongoose.Schema({
    title: String,
    department: String,
    location: String,
    type: String
});
const Career = mongoose.model("career", careerSchema);

// -------------------------
// CONTACT SCHEMA
// -------------------------
const contactSchema = new mongoose.Schema({
    address: String,
    phone: String,
    email: String,
    businessHours: String
});
const contact = mongoose.model("contactSchema", contactSchema);
const LoginSchema = new mongoose.Schema({
    username: String,
    password: String,
   
});
const Login = mongoose.model("LoginSchema", LoginSchema);


// -------------------------
// EXPORT MODELS
// -------------------------
module.exports = {
    Product,
    Project,
    Counter,
    AllProjects,
    Slider,
    Customer,
    Career,
    Homemediaimage,
    Testimonials,
    Founder,
    Leadership,
    Service,
    contact,
    Login
};
