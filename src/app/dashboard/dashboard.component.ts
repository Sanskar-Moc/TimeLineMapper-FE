import { Component, Inject, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Timeline } from '../models/timeline';
import { TimelinedataService } from '../timelinedata.service';
import * as moment from 'moment';
// import * as moment from 'moment';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  showEditStudentModal=false
  auth=inject(AuthService)
  name=JSON.parse(sessionStorage.getItem('LoggedInUser')!).name;
  imgUrl=JSON.parse(sessionStorage.getItem('LoggedInUser')!).picture;
  email=JSON.parse(sessionStorage.getItem('LoggedInUser')!).email;
  today=new Date()
  timelineList: any[] | undefined;

  constructor(private timelineservice:TimelinedataService,@Inject('moment') private moment: moment.Moment){}
  ngOnInit(){
    this.loadtimelines(JSON.parse(sessionStorage.getItem('LoggedInUser')!).email)
    // this.loadalltimelines()
  
    

  }


    // Load timelines
    loadtimelines(email:string) {
      return this.timelineservice.GetTimelinesById(email).subscribe((data: any) => {
        this.timelineList = data;
        console.log(this.timelineList)
      })
    }
    loadalltimelines() {
      return this.timelineservice.GetTimelines().subscribe((data: any) => {
        this.timelineList = data;
        console.log(this.timelineList)
      })
    }
  data={
    title:'',
    start_time:'',
    end_time:'',
    userId:this.email,
    state:'STARTED'
  }
  private router=inject(Router);

  signOut(){
    sessionStorage.removeItem('LoggedInUser')
    this.auth.signOut();
  }


  gotoEdit(){
    this.router.navigate(['editor'],{ queryParams: { data: JSON.stringify(this.data) } });
  }
  gotoEditSelect(data:any){
    this.router.navigate(['editor'],{ queryParams: { data: JSON.stringify(data) } });
  }
  checkDate(date:any){
   if( moment(date).isSameOrAfter(new Date())){
    this.data.state='PENDING'
    return true;
   }
   this.data.state='STARTED'
   return false;
  }

}
