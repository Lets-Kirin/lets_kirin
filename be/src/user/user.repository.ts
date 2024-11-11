import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthCredentialDto } from 'src/auth/dto/auth-credential.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(authCredentialDto: AuthCredentialDto): Promise<void> {
    const { id, pw, name, year } = authCredentialDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(pw, salt);
    const user = this.create({ id, pw: hashedPassword, name, year });

    try {
      await this.save(user);
    } catch (error) {
      console.error('Create user error:', error);
      if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
        throw new ConflictException('이미 사용 중인 아이디입니다.');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
