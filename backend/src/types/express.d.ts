import "express-serve-static-core";
import type { User } from '@lemac/data-model';

declare module "express-serve-static-core" {
  interface Request {
    user?: User;
  }
}

export {};