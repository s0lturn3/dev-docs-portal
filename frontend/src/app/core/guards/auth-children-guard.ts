import { CanActivateChildFn } from '@angular/router';

export const authChildrenGuard: CanActivateChildFn = (childRoute, state) => {
  return true;
};
