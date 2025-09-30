import { UserEntity } from '../entities/user.entity';
import { RMQService } from 'nestjs-rmq';
import { PurchaseState } from '@e-shop/interfaces';
import { BuyCourseSagaState } from './buy-course.state';
import { BuyCourseSagaStateStarted } from './staps/buy-course.started.step';
import { BuyCourseSagaStateProcessed } from './staps/buy-course.processed.step';
import { BuyCourseSagaStatePurchased } from './staps/buy-course.purchased.step';
import { BuyCourseSagaStateCanceled } from './staps/buy-course.canceled.step';

/**
 * Pattern STATE
 */
export class BuyCourseSaga {
  private state!: BuyCourseSagaState;

  public constructor(
    public user: UserEntity,
    public courseId: string,
    public rmqService: RMQService
  ) {
    this.setState(user.getCourseState(courseId), courseId);
  }

  public setState(state: PurchaseState, courseId: string) {
    switch (state) {
      case PurchaseState.Started:
        this.state = new BuyCourseSagaStateStarted();
        break;
      case PurchaseState.Processed:
        this.state = new BuyCourseSagaStateProcessed();
        break;
      case PurchaseState.Purchased:
        this.state = new BuyCourseSagaStatePurchased();
        break;
      case PurchaseState.Cancelled:
        this.state = new BuyCourseSagaStateCanceled();
        break;
      default:
        this.state = new BuyCourseSagaStateCanceled();
        console.error('Miscorrect state passed.');
    }

    this.state.setContext(this);
    this.user.setCourseStatus(courseId, state);
    return this;
  }

  public getState(): any {
    return this.state;
  }
}
