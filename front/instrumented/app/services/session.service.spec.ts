import { TestBed } from '@angular/core/testing';
import { expect, jest } from '@jest/globals';
import { SessionInformation } from '../interfaces/sessionInformation.interface';
import { SessionService } from './session.service';

describe('SessionService', () => {
  let service: SessionService;

  const mockSessionInformation: SessionInformation = {
    token: 'mock-token',
    type: 'Bearer',
    id: 1,
    username: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    admin: false
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with isLogged as false', () => {
    expect(service.isLogged).toBe(false);
  });

  it('should initialize with sessionInformation as undefined', () => {
    expect(service.sessionInformation).toBeUndefined();
  });

  it('should set isLogged to true on logIn', () => {
    service.logIn(mockSessionInformation);
    expect(service.isLogged).toBe(true);
  });

  it('should set sessionInformation on logIn', () => {
    service.logIn(mockSessionInformation);
    expect(service.sessionInformation).toEqual(mockSessionInformation);
  });

  it('should emit true to $isLogged observable on logIn', (done) => {
    service.$isLogged().subscribe(isLogged => {
      if (isLogged) {
        expect(isLogged).toBe(true);
        done();
      }
    });
    service.logIn(mockSessionInformation);
  });

  it('should set isLogged to false on logOut', () => {
    service.logIn(mockSessionInformation);
    service.logOut();
    expect(service.isLogged).toBe(false);
  });

  it('should set sessionInformation to undefined on logOut', () => {
    service.logIn(mockSessionInformation);
    service.logOut();
    expect(service.sessionInformation).toBeUndefined();
  });

  it('should emit false to $isLogged observable on logOut', (done) => {
    service.logIn(mockSessionInformation);
    service.$isLogged().subscribe(isLogged => {
      if (!isLogged && service.sessionInformation === undefined) {
        expect(isLogged).toBe(false);
        done();
      }
    });
    service.logOut();
  });
});
