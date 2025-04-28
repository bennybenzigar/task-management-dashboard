import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskListingComponent } from './task-listing/task-listing.component';
import { TaskHistoryComponent } from './components/task-history/task-history.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guard/auth.guard';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { UserListingComponent } from './components/user-listing/user-listing.component';

const routes: Routes = [
{  path:'', pathMatch:'full', redirectTo:''},
  {path:'dashboard', component:TaskListingComponent, canActivate: [authGuard],canActivateChild:[authGuard]},
  {path:'task-history', component:TaskHistoryComponent,canActivate: [authGuard],canActivateChild:[authGuard]},
  {path:'', component:LoginComponent},
  {path:'user', component:UserListingComponent},
  {path:'**', component:PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
