import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Timeline } from '../models/timeline';
import { TimelinedataService } from '../timelinedata.service';
import * as moment from 'moment';
import { GptserviceService } from '../gptservice.service';

@Component({
  selector: 'app-timeline-editor',
  templateUrl: './timeline-editor.component.html',
  styleUrls: ['./timeline-editor.component.css']
})
export class TimelineEditorComponent {
  name=JSON.parse(sessionStorage.getItem('LoggedInUser')!).name;
  htmlContent=''
  reportContent=''
  route=inject(ActivatedRoute)
  router=inject(Router)
  timelineData:Timeline=new Timeline();
  gpthelp='';

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
  constructor(private gptServ:GptserviceService ,private timelineservice:TimelinedataService){}

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
      if(this.data.state==='PENDING'){
        this.data.state='FINISHED'
      }
      return this.timelineservice.UpdateTimeline(this.data.id,this.data).subscribe(() => {
        this.router.navigate(['dashboard'])
      })
    }
    goDashboard(){
      this.router.navigate(['dashboard'])
    }
    postData(){
      this.data.description=this.htmlContent
      this.data.report=this.reportContent
      this.data.state='STARTED';
      return this.timelineservice.PostTimeline(this.data).subscribe(() => {
          this.router.navigate(['dashboard'])
      })
    }
    async getGptHelp(){
      let retData=await this.gptServ.generateHelp(this.data.description,this.data.report)
      this.gpthelp=this.stringToBulletPoints(retData)
    }
    stringToBulletPoints(text: string): string {
      const points = text.split(/\d+\./); // Split text into points based on the numbering
      if (points.length <= 1) {
          return ''; // Return empty string if no points are found
      }
  
      // Remove the empty string from the beginning of the array
      points.shift();
  
      // Generate HTML for bullet points
      const bulletPointsHTML = points.map(point => {
          return `
              <li class="list-disc ml-4">${point.trim()}</li>
          `;
      }).join('');
  
      // Wrap bullet points in an unordered list (ul) tag
      return `<ul class="list-inside">${bulletPointsHTML}</ul>`;
  }
}
