import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import express, { Application } from 'express';
import { connectDB } from './database';
import morgan from 'morgan';
import cors from 'cors';
import RoleRoutes from './routes/roleRoute';
import UserRoutes from './routes/userRoute';
import ProductRoutes from './routes/productRoute';

dotenv.config();

class Server {
    public app: Application;
    constructor() {
        connectDB();
        this.app = express();
        this.config();
        this.routes();
    }

    config(): void {
        this.app.set('port', process.env.PORT || 3000);
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(cookieParser());
        this.app.use(express.urlencoded({ extended: false }));
    }

    routes(): void {
        this.app.use('/api/roles', RoleRoutes);
        this.app.use('/api/users', UserRoutes);
        this.app.use('/api/products', ProductRoutes);
    }
  
    start(): void {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server running on port: ', this.app.get('port'));
        });
    }
}

const server = new Server();
server.start();
