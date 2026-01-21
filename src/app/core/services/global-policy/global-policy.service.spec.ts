import { TestBed } from '@angular/core/testing';

import { GlobalPolicyService } from './global-policy.service';

describe('GlobalPolicyService', () => {
  let service: GlobalPolicyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalPolicyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
