import { BuyCourseSagaState } from '../buy-course.state';
import { UserEntity } from '../../entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { CourseGetCourse, PaymentGenerateLink } from '@e-shop/contracts';
import { CoursePaymentStatus, PurchaseState } from '@e-shop/interfaces';

export class BuyCourseSagaStateStarted extends BuyCourseSagaState {
  public async pay(): Promise<{
    paymentLink: string | null;
    user: UserEntity;
  }> {
    const course = await this.saga.rmqService.send<
      CourseGetCourse.Request,
      CourseGetCourse.Response
    >(CourseGetCourse.topic, {
      id: this.saga.courseId,
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.price <= 0) {
      this.saga.setState(PurchaseState.Purchased, this.saga.courseId);
      return { paymentLink: null, user: this.saga.user };
    }

    const { paymentLink } = await this.saga.rmqService.send<
      PaymentGenerateLink.Request,
      PaymentGenerateLink.Response
    >(PaymentGenerateLink.topic, {
      userId: this.saga.user._id as string,
      courseId: course._id as string,
      sum: course.price as number,
    });

    this.saga.setState(PurchaseState.Processed, this.saga.courseId);

    return { paymentLink, user: this.saga.user };
  }

  // For what this redundant method here?
  public async checkPayment(): Promise<{ user: UserEntity, status: CoursePaymentStatus }> {
    throw new NotFoundException('No payments processed yst.');
  }

  public async canceled(): Promise<{ user: UserEntity }> {
    this.saga.setState(PurchaseState.Cancelled, this.saga.courseId);
    return { user: this.saga.user };
  }
}
