import { TestBed } from '@angular/core/testing';

import { HeroesService } from './heroes.service';

describe('LoginService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HeroesService = TestBed.get(HeroesService);
    expect(service).toBeTruthy();
  });
});
