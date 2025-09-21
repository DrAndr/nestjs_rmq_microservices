import { IUser, IUserCourses, UserRole } from '@e-shop/interfaces';
import bcrypt from 'bcryptjs';

export class UserEntity implements IUser {
  _id?: string;
  displayName?: string;
  email!: string;
  password!: string;
  role!: UserRole;
  courses?: IUserCourses[]

  public constructor(user: Partial<IUser>) {
    this._id = user._id as string | undefined;
    this.displayName = user.displayName;
    this.email = user.email as string;
    this.password=user.password as string;
    this.role = user?.role || UserRole.USER;
    this.courses = (user?.courses ?? []) as IUserCourses[];
  }

  public getUserPublicProfile(){
    return {
      _id: this._id,
      email: this.email,
      displayName: this.displayName,
      role: this.role,
    }
  }

  public async setPassword(password: string): Promise<this> {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(password, salt);
    return this;
  }

  public async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }

  public async updateProfile(displayName: string){
    this.displayName = displayName;
    return this;
  }
}
