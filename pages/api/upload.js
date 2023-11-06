const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default async function handler(req, res) {
  const {image} = JSON.parse(req.body);
  const results = await cloudinary.uploader.upload(image, {
    categorization: "google_tagging",
    //confidence level is .6
    auto_tagging: .6
  });
  res.status(200).json(results)
}
