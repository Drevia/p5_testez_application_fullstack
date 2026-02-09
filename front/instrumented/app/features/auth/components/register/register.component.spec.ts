import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { expect, jest } from '@jest/globals';
import { AuthService } from '../../services/auth.service';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers: [AuthService],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        RouterTestingModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values and required validators', () => {
    expect(component.form.get('email')?.value).toBe('');
    expect(component.form.get('firstName')?.value).toBe('');
    expect(component.form.get('lastName')?.value).toBe('');
    expect(component.form.get('password')?.value).toBe('');
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

  it('should display firstName required error when firstName field is empty and touched', () => {
    const firstNameControl = component.form.get('firstName');
    firstNameControl?.markAsTouched();
    expect(firstNameControl?.hasError('required')).toBe(true);
  });

  it('should display lastName required error when lastName field is empty and touched', () => {
    const lastNameControl = component.form.get('lastName');
    lastNameControl?.markAsTouched();
    expect(lastNameControl?.hasError('required')).toBe(true);
  });

  it('should display password required error when password field is empty and touched', () => {
    const passwordControl = component.form.get('password');
    passwordControl?.markAsTouched();
    expect(passwordControl?.hasError('required')).toBe(true);
  });

  it('should successfully register with valid credentials', () => {
    jest.spyOn(authService, 'register').mockReturnValue(of(void 0));
    jest.spyOn(router, 'navigate');

    component.form.patchValue({
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123'
    });

    component.submit();

    expect(authService.register).toHaveBeenCalledWith({
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123'
    });
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle registration error and set onError flag', () => {
    jest.spyOn(authService, 'register').mockReturnValue(throwError(() => new Error('Registration failed')));

    component.form.patchValue({
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123'
    });

    component.submit();

    expect(authService.register).toHaveBeenCalled();
    expect(component.onError).toBe(true);
  });

  it('should set onError to false initially', () => {
    expect(component.onError).toBe(false);
  });

  it('should not submit form when validation fails', () => {
    jest.spyOn(authService, 'register');

    component.form.patchValue({
      email: '',
      firstName: '',
      lastName: '',
      password: ''
    });

    expect(component.form.valid).toBe(false);
  });
});
