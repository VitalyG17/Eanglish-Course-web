import {ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  TuiDataList,
  TuiTextfield,
  TuiDateFormat,
  TuiIcon,
  TuiAppearance,
  TuiTitle,
  TuiError,
  TuiButton,
} from '@taiga-ui/core';
import {TuiInputDateModule, TuiInputModule, TuiInputPhoneModule} from '@taiga-ui/legacy';
import {TuiDay} from '@taiga-ui/cdk';
import {TuiDataListWrapper, TuiEmailsPipe, TuiFieldErrorPipe, TuiPassword, TuiSegmented} from '@taiga-ui/kit';
import {EmailEnum} from '../../shared/enum/EmailEnum';
import {AsyncPipe, NgIf} from '@angular/common';
import {LoginFormType, RegistrationFormType, RegistrationFormTypeMode} from './shared/registrationFormGroup';
import {TuiForm, TuiHeader} from '@taiga-ui/layout';
import {Router} from '@angular/router';
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'sign-in-up',
  standalone: true,
  templateUrl: './sign-in-up.component.html',
  styleUrl: './sign-in-up.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TuiDateFormat,
    TuiInputDateModule,
    FormsModule,
    TuiInputPhoneModule,
    TuiInputModule,
    TuiDataListWrapper,
    TuiEmailsPipe,
    NgIf,
    TuiDataList,
    TuiTextfield,
    TuiPassword,
    TuiIcon,
    TuiError,
    TuiFieldErrorPipe,
    AsyncPipe,
    TuiForm,
    TuiAppearance,
    TuiHeader,
    TuiTitle,
    TuiButton,
    TuiSegmented,
  ],
})
export class SignInUpComponent implements OnInit, OnDestroy {
  private readonly router: Router = inject(Router);
  private readonly destroy$: Subject<void> = new Subject<void>();

  protected readonly maxDate: TuiDay = TuiDay.currentLocal();
  protected readonly autocompleteEmails: string[] = Object.values(EmailEnum);
  protected readonly RegistrationFormTypeMode: typeof RegistrationFormTypeMode = RegistrationFormTypeMode;

  protected modeControl: FormControl<RegistrationFormTypeMode> = new FormControl<RegistrationFormTypeMode>(
    RegistrationFormTypeMode.LOGIN,
    {nonNullable: true},
  );

  protected get currentForm(): FormGroup {
    return this.modeControl.value === RegistrationFormTypeMode.REGISTRATION ? this.registrationForm : this.loginForm;
  }

  protected registrationForm: FormGroup<RegistrationFormType> = new FormGroup({
    name: new FormControl<string | null>(null, Validators.required),
    surname: new FormControl<string | null>(null, Validators.required),
    birthDate: new FormControl<TuiDay | null>(null, Validators.required),
    phoneNumber: new FormControl<string | null>(null, Validators.minLength(12)),
    email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
    password: new FormControl<string | null>(null, [Validators.required, Validators.minLength(8)]),
  });

  protected loginForm: FormGroup<LoginFormType> = new FormGroup({
    email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
    password: new FormControl<string | null>(null, Validators.required),
  });

  protected onSubmit() {
    this.modeControl.value === RegistrationFormTypeMode.LOGIN ? this.submitLogin() : this.submitRegistration();
  }

  private submitRegistration(): void {
    this.registrationForm.markAllAsTouched();
    this.registrationForm.updateValueAndValidity();

    if (this.registrationForm.valid) {
      console.log('Регистрация:', this.registrationForm.value);
      // TODO: Реализовать сервис для регистрации
      // this.regService.register(this.registrationForm.value).subscribe(res => {
      //   this.router.navigate(['/success-page']);
      // });
    }
  }

  private submitLogin(): void {
    this.loginForm.markAllAsTouched();
    this.loginForm.updateValueAndValidity();

    if (this.loginForm.valid) {
      console.log('Вход:', this.loginForm.value);
      // TODO: Реализовать сервис для логина
      // this.authService.login(this.loginForm.value).subscribe(res => {
      //   this.router.navigate(['/success-page']);
      // });
    }
  }

  public ngOnInit(): void {
    this.modeControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.registrationForm.reset();
      this.loginForm.reset();
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
