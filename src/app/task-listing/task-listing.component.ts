import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CreateTaskComponent } from '../components/create-task/create-task.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from '../components/confirmation/confirmation.component';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from '../services/api.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-task-listing',
  templateUrl: './task-listing.component.html',
  styleUrls: ['./task-listing.component.scss']
})
export class TaskListingComponent implements OnInit {

  todo: any[] = [];
  inProgress: any[] = [];
  done: any[] = [];
  user: any[] = [];
  selectedUser: any = null;

  loginUser: any;

  baseUrl: string = '';

  constructor(private http: HttpClient, private dialog: MatDialog, private toastr: ToastrService,
    private cookieService: CookieService,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.baseUrl = this.apiService.getBaseUrl()
    this.getTask()
    this.getUser()



  }

  getUserDetails() {
    return this.apiService.getuserDetails()

  }

  getTask() {
    this.http.get<any>(`${this.baseUrl}/tasks.json`)
      .subscribe(res => {
        let tasksArray: any[] = [];

        if (res) {
          if (Array.isArray(res)) {
            tasksArray = res;
          } else {
            tasksArray = Object.values(res);
          }
        }

        let filteredTasks: any[] = [];

        if (this.getUserDetails().role === 'admin') {
          filteredTasks = tasksArray;
        } else {
          filteredTasks = tasksArray.filter((task: any) => task.assignee === this.getUserDetails().userName);
        }

        this.todo = filteredTasks.filter((task: any) => task.status === 'To Do');
        this.inProgress = filteredTasks.filter((task: any) => task.status === 'In Progress');
        this.done = filteredTasks.filter((task: any) => task.status === 'Done');
      });
  }



  drop(event: CdkDragDrop<any[]>, status: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      task.status = status;
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );


      this.http.patch(`${this.baseUrl}/tasks/${task.id}.json`, {
        ...task,
        status: status
      }).subscribe((res: any) => {
        if (res) {
          this.toastr.success('Task status updated successfully')
          this.updateTaskHistory('updated', task.title)
        }
      });

    }
  }


  createTask(formData?: any) {


    if (this.getUserDetails().role != 'admin') {
      this.toastr.error('Only admin have permission for create & edit task')


      return

    }


    const dialogRef = this.dialog.open(CreateTaskComponent, {
      width: '500px',
      data: formData ?? formData
    });

    dialogRef.afterClosed().subscribe((formValue: any) => {
      if (formValue) {
        if (formValue.type == 'edit') {
          const data = { ...formValue };
          delete data.type;
          this.editTaskFn(data);
        }
        else {
          const data = { ...formValue };
          delete data.type;
          this.createTaskFn(formValue)
        }
      }
    });
  }

  createTaskFn(formValue: any) {

    this.http.post(`${this.baseUrl}/tasks.json`, formValue).subscribe((res: any) => {

      if (res) {
        this.getTask()
        this.updateTaskHistory('created', formValue.title)
        this.toastr.success('Task created Successfully')

      }

    }, (error: any) => {
      this.toastr.error('Task creation Failed')

    })
  }
  editTaskFn(formValue: any) {
    this.http.patch(`${this.baseUrl}/tasks/${formValue.id}.json`, formValue).subscribe((res: any) => {

      if (res) {
        this.getTask()
        this.updateTaskHistory('updated', formValue.title)
        this.toastr.success('Task updated Successfully')

      }

    }, (error: any) => {
      this.toastr.error('Task updation Failed')


    })

  }

  deleteTask(id: any) {
    if (this.getUserDetails().role != 'admin') {
      this.toastr.error('Only admin have permission for create & edit task')
      return
    }




    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '500px',
      data: {
        type: 'delete',
        title: 'Delete Confirmation',
        message: 'Are you sure you want to delete this data ?'
      }
    });

    dialogRef.afterClosed().subscribe((res: any) => {

      if (res.status == 'deleted') {
        this.deleteTaskFn(id)
      }
    });
  }


  deleteTaskFn(task: any) {
    this.http.delete(`${this.baseUrl}/tasks/${task.id}.json`).subscribe((res: any) => {

      if (res) {
        this.getTask()
        this.updateTaskHistory('deleted', task.title)
        this.toastr.success('Data deleted Successfully')
      }
      else {
        this.toastr.error('Task deleted failed')

      }

    })

  }

  statusChange(status: any, data: any) {
    const task = {
      ...data,
      status: status

    }

    this.http.patch(`${this.baseUrl}/tasks/${task.id}.json`, task).subscribe((res: any) => {

      if (res) {
        this.getTask()
        this.updateTaskHistory('updated', task.title)
        this.toastr.success('Task status updated Successfully')

      }
      else {
        this.toastr.error('Task status updated failed')
      }


    }, (error: any) => {
      this.toastr.error('Task status updated failed')

    })

  }

  getPriorityClass(item: any): any {
    const className = item.toLowerCase()

    return {
      high: className == 'high',
      medium: className == 'medium',
      low: className == 'low'
    };

  }

  updateTaskHistory(status: 'updated' | 'deleted' | 'created', title: 'string') {
    

    const datas = {
      status,
      title,
      description: `Task ${status} successfully`,
      time: new Date().toLocaleString()
    };

    this.http.post(`${this.baseUrl}/task-history.json`, datas).subscribe((res: any) => {
    })

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

  onUserChange(event: any, task: any) {
    if (this.getUserDetails().role != 'admin') {
      this.toastr.error('Only admin have permission to assign task')
      return
    }
    const user: any = this.apiService.getuserDetails()
    const data = {
      ...task,
      assignee: event
    }
    this.http.put(`${this.baseUrl}/tasks/${task.id}.json`, {
      ...data
    }).subscribe((res: any) => {
      if (res) {
        const message: any = user.userName + ' assigned task to ' + event
        this.toastr.success(message)
        this.updateTaskHistory('updated', message)
      }
    });


  }


}

