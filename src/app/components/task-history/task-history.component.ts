import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { GridApi } from 'ag-grid-community';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-task-history',
  templateUrl: './task-history.component.html',
  styleUrls: ['./task-history.component.scss']
})
export class TaskHistoryComponent implements OnInit{
  columnDefs = [
    
    // { headerName: 'ID', field: 'id'},
    { headerName: 'Status', field: 'status' ,minWidth:150},
    { headerName: 'Title', field: 'title' ,minWidth:150},
    { headerName: 'Description', field: 'description' ,flex:1 ,minWidth:150},
    { headerName: 'Time', field: 'time' ,minWidth:150}
  ];

  rowData: any[] = [];
  searchValue: string = '';

  gridApi!: GridApi;      
  baseUrl:string='';
  constructor(private http: HttpClient,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.baseUrl=this.apiService.getBaseUrl()

    this.loadData();
  }

  loadData() {
    this.http.get<any[]>(`${this.baseUrl}/task-history.json`) 
      .subscribe((data:any) => {
        if (data) {
          this.rowData = Object.values(data); 
        } else {
          this.rowData = []; 
        }
  
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
  

  export(){
    this.gridApi.exportDataAsCsv()
  }


  getRowClass(params: any) {
    const status = params.data?.status;
    switch (status) {
      case 'created':
        return 'created';
      case 'updated':
        return 'updated';
      case 'deleted':
        return 'deleted';
      default:
        return '';
    }
  }
}