import { Controller, Get } from 'routing-controllers';
import { db } from '../config/db';

enum Status {
    OK = 'UP',
    DOWN = 'DOWN'
}

@Controller()
export class HealthController {
    @Get('/health')
    async index() {

        return {
            http: Status.OK,
            db: await this.getDbStatus()
        };
    }

    private async getDbStatus(): Promise<Status> {
        try {
            await db.raw('SELECT 1');

            return Status.OK;
        } catch (e) {
            console.error(e);
        }

        return Status.DOWN;
    }
}