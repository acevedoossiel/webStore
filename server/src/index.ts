import express, { Application } from 'express';
import { connectDB } from './database'; //acceso a la base de datos
import morgan from 'morgan';
import cors from 'cors';
class Server {
    public app: Application;
    constructor() {
        connectDB();
        this.app = express();
        this.config();
        this.routes();
    }

    config(): void {
        this.app.set('port', process.env.PORT || 3000); //En que puerto va a ejecutar
        this.app.use(morgan('dev')); //que ejecutamos y que tiempo
        this .app.use(cors({origin:  "http://localhost:4200" , credentials:  true })); 
        this.app.use(express.json()); //permite que utilicemos json
        this.app.use(express.urlencoded({ extended: false })); //decodifca las url
    }
    routes(): void {

    }
    
    start(): void {
        this.app.listen(this.app.get('port'), () => {
            console.log('El servidor se esta ejecutando en el puerto: ', this.app.get('port'));
        });
    }
}
const server = new Server();
server.start();
