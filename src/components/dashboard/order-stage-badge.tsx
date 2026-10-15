import {
  OrderStageBadge,
  OrderStageIndicator,
  getStageStepIndex,
  getStageDisplayLabel,
} from './order-stage-indicator';

export {
  OrderStageBadge,
  OrderStageIndicator,
  getStageStepIndex,
  getStageDisplayLabel,
};
export type { OrderStageBadgeProps, OrderStageIndicatorProps } from './order-stage-indicator';

export const OrderStageStepper = OrderStageIndicator;
export default OrderStageBadge;
