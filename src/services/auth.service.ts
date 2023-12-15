import { HttpException, HttpStatus } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from 'bcrypt';
import { LoginDto } from "src/common/dto/login.dto";
import { SignupDto } from "src/common/dto/signup.dto";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm/repository/Repository";

export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  public async logIn(loginDto: LoginDto) {

    const user = await this.userRepository.findOne({ where: { login: loginDto.login }});

    if (!user)
      throw new Error('User not found!');

    const isPasswordVerifed = await this.verifPassword(loginDto.password, user.password);

    if (!isPasswordVerifed)
      throw new Error('Password not valid');

    const jwt_token = await this.jwtSignPayload({ ...user, password: undefined });

    return jwt_token;
  }

  public async signUp(signupDto: SignupDto) {

    const hashedPassword = await this.hashingPassword(signupDto.password);

    const user = await this.userRepository.findOne({ where: [{ username: signupDto.username },{ login: signupDto.login}] });

    if (user)
      throw new Error('User already exists!');

    const created = await this.userRepository.create({
      ...signupDto, password: hashedPassword });
    
    await this.userRepository.save(created);

    const jwt_token = await this.jwtSignPayload({ ...created, password: undefined });

    return jwt_token;
  }

  public async verif(jwt_token: string) {

  }

  private async hashingPassword(plainText: string, salt: number = 10) {
    
    return await bcrypt.hash(plainText, salt);
  }

  private async verifPassword(entered: string, hashed: string) {
    
    return await bcrypt.compare(entered, hashed);
  }

  private async jwtSignPayload(payload: any) {
    return await this.jwtService.signAsync(payload);
  }

  private async jwtVerifPaylaod(jwt_token: string) {
    const userPayload = await this.jwtService.verifyAsync(jwt_token, { secret: 'chatapp' }) as User;

    return await this.userRepository.findOne({ where: { login: userPayload.login }});
  }
}