/* eslint-disable @typescript-eslint/no-explicit-any */
import { test } from '@playwright/test';

export function Step(title: string) {
  return function (originalFunction: any): any {
    async function replaceFunction(this: any, ...args: any[]): Promise<any> {
      return await test.step(title, async (): Promise<any> => {
        return await originalFunction.call(this, ...args);
      });
    }

    return replaceFunction;
  };
}
