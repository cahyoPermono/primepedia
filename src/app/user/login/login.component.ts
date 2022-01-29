import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  inSubmission = false;
  showAlert = false;
  alertColor = 'blue';
  alertMsg = 'Please Wait!!';

  constructor(private auth: AngularFireAuth) {}

  credentials = {
    email: '',
    password: '',
  };

  ngOnInit(): void {}

  async login() {
    this.inSubmission = true;
    this.showAlert = true;
    this.alertMsg = 'Please Wait!!';
    this.alertColor = 'blue';

    try {
      await this.auth.signInWithEmailAndPassword(
        this.credentials.email,
        this.credentials.password
      );
    } catch (error) {
      console.error(error);
      this.inSubmission = false;
      this.showAlert = true;
      this.alertMsg = 'Error Login';
      this.alertColor = 'red';
      return
    }

    this.showAlert = true;
    this.alertMsg = 'Succesfully Login';
    this.alertColor = 'green';
    this.inSubmission = false;
  }
}
