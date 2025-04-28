// import { ViewEncapsulation } from '@angular/compiler';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class CreateTaskComponent {

  taskForm!: FormGroup;
  user: any[] = []
  baseUrl:string='';
  newId:any
  task:any[]=[]
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
      private apiService: ApiService
  ) {


    this.baseUrl=this.apiService.getBaseUrl()
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      status: ['', Validators.required],
      priority: ['', Validators.required],
      dueDate: ['', Validators.required],
      assignee: ['', Validators.required]
    }); ''
    this.getUser()
    this.getTask()

    
   

  }

  submit() {
    if (this.taskForm.valid) {

    
      this.dialogRef.close(this.taskForm.value); // send back the form data
    }
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


  getTask() {
    this.http.get<any[]>(`${this.baseUrl}/tasks.json`)
      .subscribe((res: any) => {
        
        if (res) {
          
          const taskArray: any[] = Object.values(res);
  
          this.task = taskArray;
  
        
          const lastTask = taskArray[taskArray.length - 1];
          this.newId = lastTask && lastTask.id ? Number(lastTask.id) + 1 : 1;
  
     

          if (this.data) {
            this.taskForm.patchValue(this.data)
            this.taskForm.addControl('id', this.fb.control(this.data.id));
            this.taskForm.addControl('type',this.fb.control('edit'))
          }
          else{
            this.taskForm.addControl('id', this.fb.control(this.newId));
            this.taskForm.addControl('type',this.fb.control('add'))
          }
        }
      });
  }
  
  
  close() {
    this.dialogRef.close();
  }
}