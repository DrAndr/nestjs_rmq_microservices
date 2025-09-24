import { UserEntity } from '../../entities/user.entity';
import { BuyCourseSagaState } from '../buy-course.state';
import { CoursePaymentStatus, PurchaseState } from '@e-shop/interfaces';
import { PaymentCheck } from '@e-shop/contracts';
import { NotFoundException } from '@nestjs/common';

export class BuyCourseSagaStateProcessed extends BuyCourseSagaState {
  /**
   *
   */
  public override pay(): Promise<{
    paymentLink: string | null;
    user: UserEntity;
  }> {
    throw new Error('Please wait payment already processed.');
  }

  /**
   *
   */
  public async checkPayment(): Promise<{ user: UserEntity, status: CoursePaymentStatus }> {
    const { status } = await this.saga.rmqService.send<
      PaymentCheck.Request,
      PaymentCheck.Response
    >(PaymentCheck.topic, {
      userId: this.saga.user._id as string,
      courseId: this.saga.courseId,
    });

    if (!status) {
      throw new NotFoundException('No payments processed.');
    }

    if (status === CoursePaymentStatus.success) {
      this.saga.setState(PurchaseState.Purchased, this.saga.courseId);
    } else if (status === CoursePaymentStatus.cancelled) {
      this.saga.setState(PurchaseState.Cancelled, this.saga.courseId);
    }

    return { user: this.saga.user, status };
  }

  /**
   *
   */
  public async canceled(): Promise<{ user: UserEntity }> {
    throw new Error('Processed payment can`t be cancelled.');
  }
}
