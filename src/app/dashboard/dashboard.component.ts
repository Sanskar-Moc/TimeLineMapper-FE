import { Component, Inject, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Timeline } from '../models/timeline';
import { TimelinedataService } from '../timelinedata.service';
import * as moment from 'moment';
import { GptserviceService } from '../gptservice.service';
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
  now: Date = new Date();
  formattedDate = this.now.toISOString().slice(0, 10) + "T00:00:00";
  
  timelineList: any[] | undefined;

  constructor( private timelineservice:TimelinedataService,@Inject('moment') private moment: moment.Moment){}
  ngOnInit(){
    console.log(this.formattedDate)
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
    state:'REG'
  }
  private router=inject(Router);

  signOut(){
    sessionStorage.removeItem('LoggedInUser')
    this.auth.signOut();
  }


  gotoEdit(){
    if(this.data.title==='' || this.data.start_time==='' || this.data.end_time==='') {
      alert("All fields are required")
      return
    }
    this.router.navigate(['editor'],{ queryParams: { data: JSON.stringify(this.data) } });
  }
  gotoEditSelect(data:any){
    if(this.checkDate(data.end_time) && data.state!=='FINISHED'){
        data.state="PENDING";
        this.timelineservice.UpdateTimeline(data.id,data).subscribe(() => {
          this.router.navigate(['editor'],{ queryParams: { data: JSON.stringify(data) } })
        })
    }

    this.router.navigate(['editor'],{ queryParams: { data: JSON.stringify(data) } });
  }
  checkDate(date:any){
   if( moment(date).isSameOrBefore(new Date())){
    
    return true;
   }
   
   return false;
  }

}
