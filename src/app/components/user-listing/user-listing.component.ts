import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { CreateUserComponent } from '../create-user/create-user.component';
import { ConfirmationComponent } from '../confirmation/confirmation.component';

@Component({
  selector: 'app-user-listing',
  templateUrl: './user-listing.component.html',
  styleUrls: ['./user-listing.component.scss']
})
export class UserListingComponent {
  baseUrl: string = '';
  rowData: any[] = [];
  searchValue: string = '';
  gridApi: any;

  col= ()=>{
    return
  }
  columnDefs = [
    { headerName: 'User Name', field: 'userName', sortable: true, filter: true,flex:1 ,minWidth:150},
    { headerName: 'Role', field: 'role', sortable: true, filter: true ,flex:1,minWidth:150},
    { headerName: 'Password', field: 'password', sortable: true, filter: true,flex:1 ,minWidth:150},
    // { headerName: 'Created At', field: 'createdAt', sortable: true, filter: true ,flex:1},
    { headerName: 'Edit', field: 'edit', sortable: true, filter: true ,flex:1,minWidth:150,
      cellRenderer: () => {
        return `<span class="material-icons" style="cursor: pointer; color: #1976d2;">edit</span>`;
      }
    },
    {
      headerName: 'Delete',
      field: 'delete',
      flex: 1,
      minWidth:150,
      cellRenderer: () => {
        return `<span class="material-icons" style="cursor: pointer; color: red;">delete</span>`;
      }}

  ];

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
     private toastr: ToastrService,
        private cookieService: CookieService,
         private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.baseUrl = this.apiService.getBaseUrl();
    this.getUser();
  }

  getUser() {
    this.http.get<any[]>(`${this.baseUrl}/user.json`) 
      .subscribe((data: any) => {
        let userArray: any[] = [];
        if (data) {
          if (Array.isArray(data)) {
            userArray = data;
          } else {
            userArray = Object.values(data);
          }
        }
        this.rowData=userArray
      });
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  onQuickFilterChanged() {
    if (this.gridApi) {
      (this.gridApi as any).setQuickFilter(this.searchValue);
    }
  }

  export() {
    this.gridApi.exportDataAsCsv(); 
  }

  getRowClass(params: any) {
    const status = params.data?.status;
    switch (status) {
      case 'active':
        return 'active';
      case 'inactive':
        return 'inactive';
      case 'suspended':
        return 'suspended';
      default:
        return '';
    }
  }

  getUserDetails() {
    return this.apiService.getuserDetails()

  }
  createUser(formData?: any) {
    if (this.getUserDetails().role != 'admin') {
      this.toastr.error('Only admin has permission to create & edit users');
      return;
    }
  
    const dialogRef = this.dialog.open(CreateUserComponent, {
      width: '500px',
      data: formData ?? formData
    });
  
    dialogRef.afterClosed().subscribe((formValue: any) => {
      if (formValue) {

        if (formValue.type == 'edit') {


          const data = { ...formValue };
          delete data.type;
          
          this.editUserFn(data);
        } else {
          const data = { ...formValue };
          delete data.type;
          
          this.createUserFn(data);
        }
      }
    });
  }
  
  createUserFn(formValue: any) {
    this.http.post(`${this.baseUrl}/user.json`, formValue).subscribe((res: any) => {
      if (res) {
        this.getUser(); 
        // this.updateUserHistory('created', formValue.name);
        this.toastr.success('User created successfully');
      }
    }, (error: any) => {
      this.toastr.error('User creation failed');
    });
  }

  editUserFn(formValue: any) {
    this.http.put(`${this.baseUrl}/user/${formValue.id}.json`, formValue).subscribe((res: any) => {
      if (res) {
        this.getUser(); 
        // this.updateUserHistory('updated', formValue.name);
        this.toastr.success('User updated successfully');
      }
    }, (error: any) => {
      this.toastr.error('User update failed');
    });
  }
  

  deleteUserFn(user: any) {
    this.http.delete(`${this.baseUrl}/user/${user.id}.json`).subscribe((res: any) => {
      if (res) {
        this.getUser();
     
        this.toastr.success('User deleted successfully');
      } else {
        this.toastr.error('User deletion failed');
      }
    });
  }


  cellChange(event: any) {
    const field = event.colDef.field;  
    const rowData = event.data;         
  
    if (field === 'edit') {
     
      this.createUser(rowData)
      
    } else if (field === 'delete') {

      const dialogRef = this.dialog.open(ConfirmationComponent, {
            width: '500px',
            data: {
              type: 'delete',
              title: 'Delete Confirmation',
              message: 'Are you sure you want to delete this user ?'
            }
          });
      
          dialogRef.afterClosed().subscribe((res: any) => {
      
            if (res.status == 'deleted') {
            
              this.deleteUserFn(rowData)
            }
          });

      
     
    } else {
      // console.log('Clicked on other fields:', field);
    }
  }
  
}