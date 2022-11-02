import { UserRepository } from './../repository/UserRepository';
import { Get, JsonController } from 'routing-controllers';
import Container from 'typedi';

@JsonController('/user')
export class UserController {

    get userRepository() {
        return Container.get(UserRepository);
    }

    @Get('/random')
    public async getRandomUser() {
        return this.userRepository.getRandomUser();
    }
}