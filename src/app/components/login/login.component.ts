import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @ViewChild('myModal', { static: false }) myModal: ElementRef | undefined;
  modalInstance:any;
  loginForm!: FormGroup;
  user: any[] = [];
  baseUrl:string='';
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cookieService: CookieService,
    private toastr: ToastrService,
    private router:Router,
     private apiService: ApiService
  ) {
    this.baseUrl=this.apiService.getBaseUrl()
  }

  ngOnInit() {
   
    this.cookieService.deleteAll()
    
    this.createLoginForm();
    this.getUser(); 

  }

  createLoginForm() {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  getUser() {
    this.http.get<any[]>(`${this.baseUrl}/user.json`).subscribe((users) => {

      let userArray: any[] = [];

      if (users) {
        if (Array.isArray(users)) {
          userArray = users;
        } else {
          userArray = Object.values(users);
        }
      }

      this.user = userArray;
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { userName, password } = this.loginForm.value;
      const user = this.user.find((u) => u.userName === userName && u.password === password);

      if (user) {
        
        this.cookieService.set('user', JSON.stringify(user));
        this.toastr.success('Login successful!');
        this.router.navigate(['/dashboard'])
      } else {
        this.toastr.error('Invalid credentials! username is admin password is admin@123');

      }
    }
  }

  get userName() {
    return this.loginForm.get('userName');
  }

  get password() {
    return this.loginForm.get('password');
  }

}