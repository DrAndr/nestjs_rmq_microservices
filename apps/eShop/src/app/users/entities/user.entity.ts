import {
  IDomainEvent,
  IUser,
  IUserCourses,
  PurchaseState,
  UserRole,
} from '@e-shop/interfaces';
import bcrypt from 'bcryptjs';
import { AccountChangedCourse } from '@e-shop/contracts';

export class UserEntity implements IUser {
  _id?: string;
  displayName?: string;
  email!: string;
  password!: string;
  role!: UserRole;
  courses: IUserCourses[] = [];
  events: IDomainEvent[] = [];

  public constructor(user: Partial<IUser>) {
    this._id = user._id as string | undefined;
    this.displayName = user.displayName;
    this.email = user.email as string;
    this.password = user.password as string;
    this.role = user?.role || UserRole.USER;
    this.courses = (user?.courses ?? []) as IUserCourses[];
  }

  public getUserPublicProfile() {
    return {
      _id: this._id,
      email: this.email,
      displayName: this.displayName,
      role: this.role,
    };
  }

  public async setPassword(password: string): Promise<this> {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(password, salt);
    return this;
  }

  public async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }

  public async updateProfile(displayName: string) {
    this.displayName = displayName;
    return this;
  }

  /**
   * Saga method
   * @param courseId
   * @param status
   */
  public setCourseStatus(courseId: string, status: PurchaseState) {
    if (status === PurchaseState.Cancelled) {
      this.courses = this.courses.filter(
        (course) => course.courseId === courseId
      );
      return this;
    }

    const exists = !!this.courses?.find(
      (course) => course.courseId === courseId
    );

    if (!exists) {
      this.courses.push({
        courseId,
        purchaseState: status,
      });
    } else {
      this.courses = this.courses.map((course) => {
        if (course.courseId === courseId) {
          course.purchaseState = status;
        }
        return course;
      });
    }

    this.events.push({
      topic: AccountChangedCourse.topic as string,
      data: { courseId, userId: this._id, state: status },
    });
    return this;
  }
}
