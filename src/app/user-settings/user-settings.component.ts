// user-settings.component.ts
import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user';
import {UI_TEXTS} from "../../config/const.config";
import {catchError, EMPTY, tap} from "rxjs";
import {ToastrService} from "ngx-toastr";

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
  private toastr = inject(ToastrService);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  constructor() {}

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
      username: [''],
      email: ['', [Validators.email]],
      birthdate: [''],
      height: ['', [Validators.min(10), Validators.max(350)]],
    });
  }

  onSubmit(): void {
        if (this.profileForm.valid) {
          const updatedUser = {
            ...this.currentUser,
            ...this.profileForm.value,
          };
      this.authService.updateUserSettings(updatedUser).pipe(
        tap(() => {
          this.toastr.success(UI_TEXTS.USER_SETTINGS_UPDATE_SUCCESS);
        }),
        catchError((error) => {
          const errorMessage = error.message || UI_TEXTS.API_ERROR;
          this.toastr.error(errorMessage);
          return EMPTY;
        })
      ).subscribe();
    } else {
      console.log('Form is invalid');
    }
  }
}
