import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppRoutingModule } from '../../app-routing.module';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { filter, map } from 'rxjs';
import { AuthService } from '../../shared/auth.service';
import { User } from '../../models/User.model';
import { error } from 'console';

@Component({
  selector: 'app-register',
  template: `<p>Register works!</p>`,
  templateUrl: './Register.component.html',
  styleUrl: './Register.component.css',
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [FormsModule]
})

export class RegisterComponent implements OnInit {
  registerGroup!: FormGroup<any>;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['']);
    }
    this.registerGroup = this.fb.group({
      'username': new FormControl("", [Validators.required, Validators.minLength(4)]),
      'password': new FormControl("", Validators.required),
      'passwordRepeat': new FormControl("", Validators.required),
      'name': new FormControl("", Validators.required),
      'email': new FormControl("", [Validators.required, Validators.email])
    }, {
      validators: this.passwordMatch('password', 'passwordRepeat')
    });
  }

  passwordMatch(password: string, confirmPassword: string): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: any } | null => {
      const passwordControl = formGroup.get(password);
      const confirmPasswordControl = formGroup.get(confirmPassword);

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (
        confirmPasswordControl.errors &&
        !confirmPasswordControl.errors['passwordMismatch']
      ) {
        return null;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        confirmPasswordControl.setErrors(null);
        return null;
      }
    };
  }


  public getPasswordError() {
    const control: AbstractControl = this.registerGroup.get('passwordRepeat')!!;
    return control.hasError('passwordMismatch')
      ? 'The passwords do not match'
      : '';
  }
  

  onSubmit() {
    if(this.registerGroup.valid) {
      const formValues = this.registerGroup.value;
      this.authService.addUser(new User(formValues.username, formValues.password, formValues.name, formValues.email));
    }
  }
}
