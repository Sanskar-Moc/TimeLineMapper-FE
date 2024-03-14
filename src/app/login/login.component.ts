declare var google:any;
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  private router=inject(Router);
  ngOnInit(): void {
    google.accounts.id.initialize({
      client_id:'321079046985-n58bc5s368661hfn8gfojfdckr9jtc82.apps.googleusercontent.com',// from google dev console
      callback:(resp:any)=>{
        this.handleLogin(resp)
      }
    });
    google.accounts.id.renderButton(document.getElementById("google-btn"),{
      theme:'filled_blue',
      size:'large',
      shape:'rectangle',
      width:'auto'
    })
  }
  private decode(token:string){
    return JSON.parse(atob(token.split('.')[1]))
  }
  handleLogin(response:any){
    if(response){
      //decode the token
      const payload=this.decode(response.credential);
      //store in session
      sessionStorage.setItem('LoggedInUser',JSON.stringify(payload))
      //navigate to dashboard
      this.router.navigate(['dashboard'])
    }
  }

}
