import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  validForm!: FormGroup;
  passwordLength: number = 0;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.validForm = this.formBuilder.group({
      login: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]],
      email: ['', [Validators.required, Validators.email], [this.checkEmail()]],
      password: ['', [Validators.required, Validators.minLength(7)]]
    });

    this.validForm.get('password')?.valueChanges.subscribe((value: string) => {
      this.passwordLength = value.length;
    });
  }

  checkEmail(): AsyncValidatorFn {
    return async (control: AbstractControl): Promise<ValidationErrors | null> => {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const data = await response.json();
      const emails = data.map((user: any) => user.email);

      if (emails.includes(control.value)) {
        return { emailExists: true };
      } else {
        return null;
      }
    };
  }

  onSubmit() {
    if (this.validForm.valid) {
      console.log('Hi user');
    }
  }

}
