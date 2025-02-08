import { Hono } from 'hono';
import {logger} from 'hono/logger';
//routes import
import { userRoute } from './routes/user';


const app = new Hono().basePath('api/v1');


app.use(logger());
//routes
app.route('/', userRoute);

export default app;
