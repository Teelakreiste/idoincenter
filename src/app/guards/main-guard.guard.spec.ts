import { TestBed } from '@angular/core/testing';

import { MainGuardGuard } from './main-guard.guard';

describe('MainGuardGuard', () => {
  let guard: MainGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MainGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
