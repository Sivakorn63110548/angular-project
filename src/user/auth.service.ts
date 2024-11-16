import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from './auth.model';
import { HttpException, HttpStatus } from '@nestjs/common';  // For better error handling

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<any> {
    const { username, password } = loginDto;
    const user = await this.userModel.findOne({ username });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const payload = { username: user.username, userId: user._id };
    const token = this.jwtService.sign(payload);

    return { message: 'User logged in', token: token };
  }

  async register(registerDto: RegisterDto): Promise<any> {
    const { img, name, email, username, password, phone, address } = registerDto;

    const existingUser = await this.userModel.findOne({ username });
    if (existingUser) {
      throw new HttpException('Username already exists', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      name,
      email,
      username,
      password: hashedPassword,
      phone,
      address,
      img
    });

    await newUser.save();
    return { message: 'User registered successfully' };
  }

  async getProfile(param: any): Promise<any> {
    const user = await this.userModel.findOne({ _id: param }).exec();
    return user;
  }
}
