import { Router } from 'express';
import { ProductController } from '../controllers/productController';

class productRoutes {
    public router: Router = Router();
    constructor() {
        this.config();
    }
    config(): void {
        this.router.post('/', ProductController.createProduct);
        this.router.get('/get', ProductController.getAllProducts);
        this.router.get('/get/:id', ProductController.getProductById);
        this.router.put('/update/:id', ProductController.updateProductById);
        this.router.delete('/delete/:id', ProductController.deleteProductById);
    }
}
const ProductRoutes = new productRoutes();
export default ProductRoutes.router;
