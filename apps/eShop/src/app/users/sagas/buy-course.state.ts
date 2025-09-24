import { BuyCourseSaga } from './buy-course.saga';
import { UserEntity } from '../entities/user.entity';
import { CoursePaymentStatus } from '@interfaces';

export abstract class BuyCourseSagaState {
  public saga!: BuyCourseSaga;

  public setContext(saga: BuyCourseSaga) {
    this.saga = saga;
  }

  public abstract pay(): Promise<{ paymentLink: string | null; user: UserEntity }>

  public abstract checkPayment(): Promise<{ user: UserEntity, status: CoursePaymentStatus }>

  public abstract canceled(): Promise<{ user: UserEntity }>
}
