import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { expect, jest } from '@jest/globals';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { User } from 'src/app/interfaces/user.interface';
import { SessionService } from 'src/app/services/session.service';
import { UserService } from 'src/app/services/user.service';
import { MeComponent } from './me.component';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let sessionService: SessionService;
  let userService: UserService;
  let matSnackBar: MatSnackBar;
  let router: Router;

  const mockSessionInformation: SessionInformation = {
    token: 'mock-token',
    type: 'Bearer',
    id: 1,
    username: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    admin: false
  };

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    admin: false,
    password: 'test123',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        RouterTestingModule
      ],
      providers: [SessionService, UserService]
    })
      .compileComponents();

    sessionService = TestBed.inject(SessionService);
    userService = TestBed.inject(UserService);
    matSnackBar = TestBed.inject(MatSnackBar);
    router = TestBed.inject(Router);

    sessionService.logIn(mockSessionInformation);

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user information', () => {
    jest.spyOn(userService, 'getById').mockReturnValue(of(mockUser));

    component.ngOnInit();

    expect(component.user).toEqual(mockUser);
  });

  it('should load user data on component init', () => {
    jest.spyOn(userService, 'getById').mockReturnValue(of(mockUser));

    component.ngOnInit();

    expect(userService.getById).toHaveBeenCalledWith('1');
  });

  it('should successfully delete user account', () => {
    jest.spyOn(userService, 'delete').mockReturnValue(of(null));
    jest.spyOn(matSnackBar, 'open').mockReturnValue({} as any);
    jest.spyOn(sessionService, 'logOut');
    jest.spyOn(router, 'navigate');

    component.delete();

    expect(userService.delete).toHaveBeenCalledWith('1');
    expect(matSnackBar.open).toHaveBeenCalledWith("Your account has been deleted !", 'Close', { duration: 3000 });
    expect(sessionService.logOut).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should logout user after deleting account', () => {
    jest.spyOn(userService, 'delete').mockReturnValue(of(null));
    jest.spyOn(matSnackBar, 'open').mockReturnValue({} as any);
    jest.spyOn(sessionService, 'logOut');

    component.delete();

    expect(sessionService.logOut).toHaveBeenCalled();
    expect(sessionService.isLogged).toBe(false);
  });

  it('should redirect to home page after deleting account', () => {
    jest.spyOn(userService, 'delete').mockReturnValue(of(null));
    jest.spyOn(matSnackBar, 'open').mockReturnValue({} as any);
    jest.spyOn(sessionService, 'logOut');
    jest.spyOn(router, 'navigate');

    component.delete();

    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should go back to previous page', () => {
    jest.spyOn(window.history, 'back');
    component.back();
    expect(window.history.back).toHaveBeenCalled();
  });

  it('should display correct user information in template data', () => {
    jest.spyOn(userService, 'getById').mockReturnValue(of(mockUser));
    fixture.detectChanges();
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.user?.email).toBe('test@example.com');
    expect(component.user?.firstName).toBe('Test');
    expect(component.user?.lastName).toBe('User');
  });
});
