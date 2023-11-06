const DataURIParser = require('datauri/parser');
const sharp = require('sharp');

const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your account credentials
cloudinary.config(process.env.CLOUDINARY_URL);

async function uploadImageToCloudinary(imagePath, folder) {
    try {

        const optimize = await optimizeImage(imagePath);
        const base64 = await bufferToBase64(optimize);
        // Upload the image to Cloudinary
        const result = await cloudinary.uploader.upload(base64, {
            folder: folder,
        });

        // Return the URL of the uploaded image
        return {
            url: result.secure_url,
            id: result.public_id
        };
    } catch (error) {
        console.error(error);
        throw new Error('Failed to upload image to Cloudinary');
    }
}

const deleteImageFromCloudinary = async (public_id) => {
    try {
        await cloudinary.uploader.destroy(public_id);
    } catch (error) {
        console.error(error);
        throw new Error('Failed to delete image from Cloudinary');
    }
};

const optimizeImage = async (image) => {
    return (
        sharp(image)
            .toFormat("webp")
            .toBuffer()
    );
};

const bufferToBase64 = async (buffer) => {
    const parser = new DataURIParser();
    return parser.format(".webp", buffer).content;
};

module.exports = {
    uploadImageToCloudinary,
    deleteImageFromCloudinary
};
