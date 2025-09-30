import { InjectModel } from '@nestjs/mongoose';
import { User } from '../model/user.model';
import { Model, DeleteResult, UpdateResult } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { IUser, IUserCourses, IUserPublicProfile } from '@e-shop/interfaces';

@Injectable()
export class UserRepository {
  public constructor(
    //@InjectModel(User.name) Give as access to the User db model.
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  /**
   *
   * @param user
   */
  async createUser(user: UserEntity): Promise<User> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async getUsers(): Promise<User[] | null> {
    return await this.userModel.find().exec();
  }

  /**
   *
   * @param id
   */
  async getUser(id: string): Promise<IUserPublicProfile> {
    const userData = await this.userModel.findById(id).exec();

    if (!userData) {
      throw new NotFoundException('User not found');
    }

    return new UserEntity(userData as IUser).getUserPublicProfile(); // return sanitized public data, without password
  }

  /**
   *
   * @param id
   */
  async getUserCourses(id: string): Promise<IUserCourses[]> {
    const userData = await this.userModel.findById(id).exec();

    if (!userData) {
      throw new NotFoundException('User not found');
    }

    return userData.courses as IUserCourses[];
  }

  /**
   *
   * @param _id
   * @param rest
   */
  async updateUser({ _id, ...rest }: UserEntity): Promise<UpdateResult> {
    return await this.userModel
      .updateOne(
        { _id },
        {
          $set: { ...rest },
        }
      )
      .exec();
  }

  /**
   *
   * @param email
   */
  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  /**
   *
   * @param email
   * @param data
   */
  async updateUserByEmail(email: string, data: IUser): Promise<UpdateResult> {
    return this.userModel.updateOne({ email }, data).exec();
  }

  /**
   *
   * @param email
   */
  async deleteUser(email: string): Promise<DeleteResult> {
    return await this.userModel.deleteOne({ email }).exec();
  }

  async helthcheck(): Promise<IUser | null> {
    return await this.userModel.findOne({}).exec();
  }
}
