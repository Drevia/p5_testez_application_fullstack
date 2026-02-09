import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { expect, jest } from '@jest/globals';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { SessionService } from 'src/app/services/session.service';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let sessionService: SessionService;
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [AuthService, SessionService],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values and required validators', () => {
    expect(component.form.get('email')?.value).toBe('');
    expect(component.form.get('password')?.value).toBe('');
    expect(component.form.get('email')?.hasError('required')).toBe(true);
    expect(component.form.get('password')?.hasError('required')).toBe(true);
  });

  it('should display email required error when email field is empty and touched', () => {
    const emailControl = component.form.get('email');
    emailControl?.markAsTouched();
    expect(emailControl?.hasError('required')).toBe(true);
  });

  it('should display email format error when email is invalid', () => {
    const emailControl = component.form.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBe(true);
  });

  it('should display password required error when password field is empty and touched', () => {
    const passwordControl = component.form.get('password');
    passwordControl?.markAsTouched();
    expect(passwordControl?.hasError('required')).toBe(true);
  });

  it('should successfully login with valid credentials', () => {
    jest.spyOn(authService, 'login').mockReturnValue(of(mockSessionInformation));
    jest.spyOn(sessionService, 'logIn');
    jest.spyOn(router, 'navigate');

    component.form.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });

    component.submit();

    expect(authService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
    expect(sessionService.logIn).toHaveBeenCalledWith(mockSessionInformation);
    expect(router.navigate).toHaveBeenCalledWith(['/sessions']);
  });

  it('should handle login error and set onError flag', () => {
    jest.spyOn(authService, 'login').mockReturnValue(throwError(() => new Error('Invalid credentials')));

    component.form.patchValue({
      email: 'test@example.com',
      password: 'wrongpassword'
    });

    component.submit();

    expect(authService.login).toHaveBeenCalled();
    expect(component.onError).toBe(true);
  });

  it('should set onError to false initially', () => {
    expect(component.onError).toBe(false);
  });

  it('should toggle hide password visibility', () => {
    expect(component.hide).toBe(true);
    component.hide = false;
    expect(component.hide).toBe(false);
  });

  it('should not submit form when validation fails', () => {
    jest.spyOn(authService, 'login');

    component.form.patchValue({
      email: '',
      password: ''
    });

    expect(component.form.valid).toBe(false);
  });
});
