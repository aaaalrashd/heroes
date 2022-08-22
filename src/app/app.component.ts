import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent  implements OnInit {
  isMobile = false;

  constructor(private router: Router) {

  }

  ngOnInit() {
    if (window.screen.width < 1000) { // 768px portrait
      this.isMobile = true;
    }
  }
}
