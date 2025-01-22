// user-settings.component.ts
import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user';
import {UI_TEXTS} from "../../config/const.config";

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent {
  profileForm!: FormGroup;
  currentUser: User | undefined;
  protected readonly UI_TEXTS = UI_TEXTS;
  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.initializeForm();
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUser=user;
        this.profileForm.patchValue({
          username: user.username,
          email: user.email,
          birthdate: user.birthdate,
          height: user.height,
        });
      }
    });
  }

  initializeForm(): void {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      birthdate: [''],
      height: ['', [Validators.required, Validators.min(10), Validators.max(350)]],
    });
  }

  onSubmit(): void {
        if (this.profileForm.valid) {
          const updatedUser = {
            ...this.currentUser,
            ...this.profileForm.value,
          };
      this.authService.updateUserSettings(updatedUser).subscribe((data: any) => {console.log(data)});
    } else {
      console.log('Form is invalid');
    }
  }
}
