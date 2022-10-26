import 'reflect-metadata';
import dotenv from 'dotenv';
import { Application } from 'express';

import { FakeController } from './controllers/FakeController';
import { createExpressServer } from 'routing-controllers';
import { HealthController } from './controllers/HealthController';
import { connectToDataBase } from './config/db';
import { CategoryController } from './controllers/CategoryController';

dotenv.config();
connectToDataBase();

const port = process.env.PORT;

const app: Application = createExpressServer({
    controllers: [HealthController, FakeController, CategoryController],
});

app.listen(port);

console.info(`Server has been started on port ${port}`);