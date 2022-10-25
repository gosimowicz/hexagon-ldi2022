import { createExpressServer } from 'routing-controllers';
import dotenv from 'dotenv';
import 'reflect-metadata';
import { HealthController } from './controllers/HealthController';
import { connectToDataBase } from './config/db';

dotenv.config();
connectToDataBase();

const port = process.env.PORT;
console.log(process.env.PG_CONNECTION_STRING);

const app = createExpressServer({
  controllers: [HealthController],
});

app.listen(port);

console.info(`Server has been started on port ${port}`)