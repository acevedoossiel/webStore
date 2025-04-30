import carouselModel from '../models/carouselModel';
import cloudinary from 'cloudinary';

class CarouselService {
    async getCarouselByType(type: string) {
        // Busca o crea un carrusel si no existe
        let carousel = await carouselModel.findOne({ type });
        if (!carousel) {
            carousel = await carouselModel.create({ type, images: [] });
        }
        return carousel;
    }

    async uploadImage(type: string, imagePath: string) {
        try {
            // Sube la imagen a Cloudinary
            const result = await cloudinary.v2.uploader.upload(imagePath);
            const imageUrl = result.secure_url; // La URL de la imagen en Cloudinary

            // Actualiza el carrusel con la nueva imagen
            const carousel = await carouselModel.findOneAndUpdate(
                { type },
                { $addToSet: { images: imageUrl } },
                { upsert: true, new: true }
            );

            return carousel;
        } catch (error) {
            console.error('❌ Error al subir la imagen a Cloudinary:', error);
            throw new Error('Error al subir la imagen a Cloudinary');
        }
    }

    async removeImage(type: string, imageUrl: string) {
        try {
            // Elimina la imagen de Cloudinary
            const publicId = imageUrl.split('/').pop()?.split('.').shift(); // Extrae el ID público de la URL
            if (publicId) {
                await cloudinary.v2.uploader.destroy(publicId); // Elimina la imagen de Cloudinary
            }

            // Elimina la imagen de la base de datos
            const updatedCarousel = await carouselModel.findOneAndUpdate(
                { type },
                { $pull: { images: imageUrl } },
                { new: true }
            );

            return updatedCarousel;
        } catch (error) {
            console.error('❌ Error al eliminar la imagen de Cloudinary:', error);
            throw new Error('Error al eliminar la imagen de Cloudinary');
        }
    }

    async replaceImages(type: string, newImages: string[]) {
        // Ojo: este método no elimina físicamente las imágenes antiguas
        const oldCarousel = await carouselModel.findOne({ type });
        const oldImages = oldCarousel?.images || [];

        // Reemplaza las imágenes en la base de datos
        const updatedCarousel = await carouselModel.findOneAndUpdate(
            { type },
            { images: newImages },
            { upsert: true, new: true }
        );

        // Elimina físicamente las imágenes antiguas de Cloudinary
        oldImages.forEach(async (img) => {
            if (!newImages.includes(img)) {
                const publicId = img.split('/').pop()?.split('.').shift();
                if (publicId) {
                    await cloudinary.v2.uploader.destroy(publicId); // Elimina la imagen de Cloudinary
                }
            }
        });

        return updatedCarousel;
    }
}

export const carouselService = new CarouselService();
