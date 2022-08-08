import { TestBed } from '@angular/core/testing';

import { ListeServiceService } from './liste-service.service';

describe('ListeServiceService', () => {
  let service: ListeServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListeServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
