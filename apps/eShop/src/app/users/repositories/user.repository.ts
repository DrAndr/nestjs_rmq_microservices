import { InjectModel } from '@nestjs/mongoose';
import { User } from '../model/user.model';
import { Model,DeleteResult, UpdateResult } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { IUser } from '@e-shop/interfaces';

@Injectable()
export class UserRepository  {
  public constructor(
    //@InjectModel(User.name) Give as access to the User db model.
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) { }

  async createUser(user: UserEntity): Promise<User> {
    const newUser = new this.userModel(user);
    return newUser.save()
  }

  async getUsers(): Promise<User[] | null> {
    return await this.userModel.find().exec();
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  async updateUser(email: string, data: IUser):Promise<UpdateResult> {
    return this.userModel.updateOne({ email }, data).exec();
  }

  async deleteUser(email: string): Promise<DeleteResult> {
    return await this.userModel.deleteOne({ email }).exec();
  }
}
