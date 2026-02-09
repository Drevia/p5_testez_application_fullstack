import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { expect, jest } from '@jest/globals';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { Teacher } from 'src/app/interfaces/teacher.interface';
import { SessionService } from '../../../../services/session.service';
import { TeacherService } from '../../../../services/teacher.service';
import { Session } from '../../interfaces/session.interface';
import { SessionApiService } from '../../services/session-api.service';
import { DetailComponent } from './detail.component';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let sessionService: SessionService;
  let sessionApiService: SessionApiService;
  let teacherService: TeacherService;
  let matSnackBar: MatSnackBar;
  let router: Router;

  const mockSessionInformationAdmin: SessionInformation = {
    token: 'mock-token',
    type: 'Bearer',
    id: 1,
    username: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    admin: true
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

  const mockSession: Session = {
    id: 1,
    name: 'Test Session',
    date: new Date('2024-01-20'),
    teacher_id: 1,
    description: 'Test Description',
    users: [1, 2, 3],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  };

  const mockTeacher: Teacher = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        ReactiveFormsModule
      ],
      declarations: [DetailComponent],
      providers: [SessionService, SessionApiService, TeacherService]
    })
      .compileComponents();

    sessionService = TestBed.inject(SessionService);
    sessionApiService = TestBed.inject(SessionApiService);
    teacherService = TestBed.inject(TeacherService);
    matSnackBar = TestBed.inject(MatSnackBar);
    router = TestBed.inject(Router);

    sessionService.logIn(mockSessionInformationAdmin);

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display session information', () => {
    jest.spyOn(sessionApiService, 'detail').mockReturnValue(of(mockSession));
    jest.spyOn(teacherService, 'detail').mockReturnValue(of(mockTeacher));

    component.ngOnInit();

    expect(component.session).toEqual(mockSession);
    expect(component.teacher).toEqual(mockTeacher);
  });

  it('should display delete button if user is admin', () => {
    fixture.detectChanges();
    expect(component.isAdmin).toBe(true);
  });

  it('should not display delete button if user is not admin', () => {
    sessionService.logIn(mockSessionInformationUser);
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.isAdmin).toBe(false);
  });

  it('should delete session successfully', () => {
    jest.spyOn(sessionApiService, 'delete').mockReturnValue(of(null));
    jest.spyOn(matSnackBar, 'open').mockReturnValue({} as any);
    jest.spyOn(router, 'navigate');

    component.sessionId = '1';
    component.delete();

    expect(sessionApiService.delete).toHaveBeenCalledWith('1');
    expect(matSnackBar.open).toHaveBeenCalledWith('Session deleted !', 'Close', { duration: 3000 });
    expect(router.navigate).toHaveBeenCalledWith(['sessions']);
  });

  it('should set isParticipate to true if user is in users list', () => {
    jest.spyOn(sessionApiService, 'detail').mockReturnValue(of(mockSession));
    jest.spyOn(teacherService, 'detail').mockReturnValue(of(mockTeacher));

    component.userId = '1';
    component.ngOnInit();

    expect(component.isParticipate).toBe(true);
  });

  it('should set isParticipate to false if user is not in users list', () => {
    const mockSessionWithoutUser: Session = {
      id: 1,
      name: 'Test Session',
      date: new Date('2024-01-20'),
      teacher_id: 1,
      description: 'Test Description',
      users: [2, 3], // User 1 is NOT in this list
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    };
    jest.spyOn(sessionApiService, 'detail').mockReturnValue(of(mockSessionWithoutUser));
    jest.spyOn(teacherService, 'detail').mockReturnValue(of(mockTeacher));

    component.ngOnInit();

    expect(component.isParticipate).toBe(false);
  });

  it('should participate in session', () => {
    jest.spyOn(sessionApiService, 'participate').mockReturnValue(of(void 0));
    jest.spyOn(sessionApiService, 'detail').mockReturnValue(of(mockSession));
    jest.spyOn(teacherService, 'detail').mockReturnValue(of(mockTeacher));

    component.sessionId = '1';
    component.userId = '1';
    component.participate();

    expect(sessionApiService.participate).toHaveBeenCalledWith('1', '1');
  });

  it('should unparticipate from session', () => {
    jest.spyOn(sessionApiService, 'unParticipate').mockReturnValue(of(void 0));
    jest.spyOn(sessionApiService, 'detail').mockReturnValue(of(mockSession));
    jest.spyOn(teacherService, 'detail').mockReturnValue(of(mockTeacher));

    component.sessionId = '1';
    component.userId = '1';
    component.unParticipate();

    expect(sessionApiService.unParticipate).toHaveBeenCalledWith('1', '1');
  });

  it('should go back to previous page', () => {
    jest.spyOn(window.history, 'back');
    component.back();
    expect(window.history.back).toHaveBeenCalled();
  });
});

