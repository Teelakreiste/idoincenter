import { TestBed } from '@angular/core/testing';

import { SecurityGuardGuard } from './security-guard.guard';

describe('SecurityGuardGuard', () => {
  let guard: SecurityGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SecurityGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
