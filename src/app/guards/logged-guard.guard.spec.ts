import { TestBed } from '@angular/core/testing';

import { LoggedGuardGuard } from './logged-guard.guard';

describe('LoggedGuardGuard', () => {
  let guard: LoggedGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LoggedGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
