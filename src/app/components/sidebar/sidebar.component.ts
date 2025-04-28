import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { ApiService } from 'src/app/services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  showSidebar: boolean = false
  // user:any
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private cookieService: CookieService, private dialog: MatDialog,
     private apiService: ApiService,
      private toastr: ToastrService
  ) {




  }


  isExpanded = false;

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }


  ngOnInit(): void {
    
  }

  get authUser() {
let user=null
     user = this.cookieService.get('user')
    if (user) {
      return true
    }
    else {
      return false
    }

  }

  logout() {

    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '500px',
      data: {
        type: 'logout',
        title: 'Logout Confirmation',
        message: 'Are you sure you want to logout ?'
      }
    });

    dialogRef.afterClosed().subscribe((res: any) => {

      if (res.status == 'logout') {
        this.cookieService.deleteAll()
        this.router.navigate([''])
      }
    });


  }

  getUserDetails() {
    return this.apiService.getuserDetails()

  }
  navigateTouser(){
    if (this.getUserDetails().role != 'admin') {
      this.toastr.error('Only admin have permission for create & edit task')


      return

    }
    this.router.navigate(['/user'])
  }
}


