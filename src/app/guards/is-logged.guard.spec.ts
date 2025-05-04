import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { isLoggedGuard } from './is-logged.guard';

describe('isLoggedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => isLoggedGuard());

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
