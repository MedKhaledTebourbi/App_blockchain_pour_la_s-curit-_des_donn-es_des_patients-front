import { TestBed } from '@angular/core/testing';

import { SmartContractService } from './smart-contrat.service';

describe('SmartContratService', () => {
  let service: SmartContractService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmartContractService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
