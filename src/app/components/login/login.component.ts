import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];

  constructor(private afAuth: AngularFireAuth,
    private authService: AuthService,
    private router: Router,
    private matDialog: MatDialog) {
  }

  ngOnInit(): void {
    this.subs.push(this.authService.userData.subscribe((data: any) => {
      if (data) {
        this.router.navigateByUrl('/').then();
      }
    }));
  }

  ngOnDestroy(): void {
    this.subs.map(s => s.unsubscribe());
  }

  login(form: NgForm): void {
    const { email, password } = form.value;
    if (!form.valid) {
      return;
    }
    this.authService.SignIn(email, password);
    form.resetForm();
  }

  register(form: NgForm): void {
    const { fname, lname, email, password, avatar } = form.value;
    if (!form.valid) {
      return;
    }
    this.authService.SignUp(email, password, fname, lname, avatar);
    form.resetForm();
  }
}

