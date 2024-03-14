import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Timeline } from '../models/timeline';
import { TimelinedataService } from '../timelinedata.service';
import * as moment from 'moment';

@Component({
  selector: 'app-timeline-editor',
  templateUrl: './timeline-editor.component.html',
  styleUrls: ['./timeline-editor.component.css']
})
export class TimelineEditorComponent {
  htmlContent=''
  reportContent=''
  route=inject(ActivatedRoute)
  router=inject(Router)
  timelineData:Timeline=new Timeline();

  data:any
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
   
  };
  constructor(private timelineservice:TimelinedataService){}

  ngOnInit(){
    this.checkData();
    this.htmlContent=this.data.description;
    this.reportContent=this.data.report;
  }
  checkDate(date:any){
    // console.log(this.data.end_time)
    return moment(date).isSameOrBefore(new Date())
   }
  checkData(){
    this.route.queryParams.subscribe(params => {
      const data = params['data'];
      // Use data if present
      this.data=JSON.parse(data)
      // console.log(data)
      this.timelineData=data as Timeline
    });
  }
  updateData(){
      // this.timelineData.
      // console.log(this.timelineData)
      this.data.description=this.htmlContent
      this.data.report=this.reportContent
      return this.timelineservice.UpdateTimeline(this.data.id,this.data).subscribe(() => {
        this.router.navigate(['dashboard'])
      })
    }
    postData(){
      this.data.description=this.htmlContent
      this.data.report=this.reportContent
      return this.timelineservice.PostTimeline(this.data).subscribe(() => {
          this.router.navigate(['dashboard'])
      })
  }
}
