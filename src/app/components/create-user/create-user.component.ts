import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/services/api.service'; // Adjust path as needed

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent {
  userForm!: FormGroup;
  user: any[] = [];
  baseUrl: string = '';
  newId: any;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private apiService: ApiService
  ) {
    this.baseUrl = this.apiService.getBaseUrl(); // Get base URL from API service
    this.userForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required],
      // id: [''],
      // type: ['']
    });
    
    this.getUserData();
  }

  submit() {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;

      if (formValue.type === 'edit') {
        // Editing: send the data back
        this.dialogRef.close(this.userForm.value);
      } else {
        // Creating: handle ID generation
        this.dialogRef.close({ ...formValue, id: this.newId });
      }
    }
  }

  getUserData() {
    this.http.get<any[]>(`${this.baseUrl}/user.json`).subscribe((users) => {

      if(users){
        const userArray: any[] = Object.values(users);

        this.user = userArray;
  
       
        const lastUser = userArray[userArray.length - 1];
        this.newId = lastUser && lastUser.id ? Number(lastUser.id) + 1 : 1;
  
      
        if (this.data) {
          this.userForm.patchValue(this.data);
          this.userForm.addControl('id', this.fb.control(this.data.id));
          this.userForm.addControl('type', this.fb.control('edit'));
        } else {
          this.userForm.addControl('id', this.fb.control(this.newId));
          this.userForm.addControl('type', this.fb.control('add'));
        }
      }
      
    });
  }

  close() {
    this.dialogRef.close();
  }
}
