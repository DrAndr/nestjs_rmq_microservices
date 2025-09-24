import { BuyCourseSagaState } from '../buy-course.state';
import { UserEntity } from '../../entities/user.entity';
import { CoursePaymentStatus, PurchaseState } from '@e-shop/interfaces';

export class BuyCourseSagaStateCanceled extends BuyCourseSagaState {
  /**
   *
   */
  public override pay(): Promise<{
    paymentLink: string | null;
    user: UserEntity;
  }> {
    this.saga.setState(PurchaseState.Started, this.saga.courseId);
    return this.saga.getState().pay();
  }

  /**
   *
   */
  public async checkPayment(): Promise<{ user: UserEntity, status: CoursePaymentStatus }> {
    throw new Error('Payment has been cancelled.');
  }

  /**
   *
   */
  public async canceled(): Promise<{ user: UserEntity }> {
    throw new Error('Already canceled.');
  }
}
