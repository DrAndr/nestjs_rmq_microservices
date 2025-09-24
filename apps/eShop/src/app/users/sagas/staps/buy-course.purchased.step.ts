import { BuyCourseSagaState } from '../buy-course.state';
import { UserEntity } from '../../entities/user.entity';
import { CoursePaymentStatus } from '@e-shop/interfaces';

export class BuyCourseSagaStatePurchased extends BuyCourseSagaState{
  /**
   *
   */
  public override pay(): Promise<{
    paymentLink: string | null;
    user: UserEntity;
  }> {
    throw new Error('Course already payed.');
  }

  /**
   *
   */
  public override checkPayment(): Promise<{ user: UserEntity, status: CoursePaymentStatus }> {
    throw new Error('Can`t check status payment for already bought course.');
  }

  /**
   *
   */
  public override canceled(): Promise<{ user: UserEntity }> {
    throw new Error('Already payed course can`t be cancelled.');
  }
}
