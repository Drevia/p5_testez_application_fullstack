import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { of } from 'rxjs';
import { expect, jest } from '@jest/globals';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { SessionService } from 'src/app/services/session.service';
import { Session } from '../../interfaces/session.interface';
import { SessionApiService } from '../../services/session-api.service';
import { ListComponent } from './list.component';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let sessionService: SessionService;
  let sessionApiService: SessionApiService;

  const mockSessions: Session[] = [
    {
      id: 1,
      name: 'Session 1',
      date: new Date('2024-01-20'),
      teacher_id: 1,
      description: 'Description 1',
      users: [1, 2],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 2,
      name: 'Session 2',
      date: new Date('2024-01-21'),
      teacher_id: 2,
      description: 'Description 2',
      users: [3, 4],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }
  ];

  const mockSessionInformationAdmin: SessionInformation = {
    token: 'mock-token',
    type: 'Bearer',
    id: 1,
    username: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    admin: true
  };

  const sessionApiServiceMock = {
    all: jest.fn().mockReturnValue(of([]))
  };

  const mockSessionInformationUser: SessionInformation = {
    token: 'mock-token',
    type: 'Bearer',
    id: 2,
    username: 'user',
    firstName: 'Regular',
    lastName: 'User',
    admin: false
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [HttpClientModule, MatCardModule, MatIconModule],
      providers: [SessionApiService, SessionService]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    sessionService = TestBed.inject(SessionService);
    sessionApiService = TestBed.inject(SessionApiService);
    sessionService.logIn(mockSessionInformationUser);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display list of sessions', () => {
    jest.spyOn(sessionApiService, 'all').mockReturnValue(of(mockSessions));
    component.sessions$ = sessionApiService.all();

    component.sessions$.subscribe(sessions => {
      expect(sessions).toEqual(mockSessions);
      expect(sessions.length).toBe(2);
    });
  });

  it('should display Create and Detail buttons when user is admin', () => {
    sessionService.logIn(mockSessionInformationAdmin);
    fixture.detectChanges();

    expect(component.user?.admin).toBe(true);
    expect(component.user?.id).toBe(1);
  });

  it('should not display Create and Detail buttons when user is not admin', () => {
    sessionService.logIn(mockSessionInformationUser);
    fixture.detectChanges();

    expect(component.user?.admin).toBe(false);
  });

  it('should get user information from session service', () => {
    sessionService.logIn(mockSessionInformationAdmin);

    expect(component.user).toEqual(mockSessionInformationAdmin);
  });

  it('should return session list from sessions$ observable', (done) => {
    jest.spyOn(sessionApiService, 'all').mockReturnValue(of(mockSessions));

    component.sessions$ = sessionApiService.all();

    component.sessions$.subscribe(sessions => {
      expect(sessions).toEqual(mockSessions);
      done();
    });
  });
});
