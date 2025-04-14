import carouselModel from '../models/carouselModel';
import fs from 'fs';
import path from 'path';

class CarouselService {
    async getCarouselByType(type: string) {
        // Busca o crea un carrusel si no existe
        let carousel = await carouselModel.findOne({ type });
        if (!carousel) {
            carousel = await carouselModel.create({ type, images: [] });
        }
        return carousel;
    }

    async uploadImage(type: string, filename: string) {
        const imageUrl = `/uploads/images/${filename}`;

        const carousel = await carouselModel.findOneAndUpdate(
            { type },
            { $addToSet: { images: imageUrl } },
            { upsert: true, new: true }
        );

        return carousel;
    }

    async removeImage(type: string, imageUrl: string) {
        const updatedCarousel = await carouselModel.findOneAndUpdate(
            { type },
            { $pull: { images: imageUrl } },
            { new: true }
        );

        // Elimina el archivo físico del servidor
        const filePath = path.resolve('uploads/images', path.basename(imageUrl));
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return updatedCarousel;
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

        // Elimina físicamente las imágenes antiguas que ya no estén
        oldImages.forEach((img) => {
            if (!newImages.includes(img)) {
                const filePath = path.resolve('uploads/images', path.basename(img));
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
        });

        return updatedCarousel;
    }
}

export const carouselService = new CarouselService();
