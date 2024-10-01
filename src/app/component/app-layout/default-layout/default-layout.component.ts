import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SideNavbarComponent } from "../side-navbar/side-navbar.component";
import { AppHeaderComponent } from "../app-header/app-header.component";
import { AppFooterComponent } from "../app-footer/app-footer.component";
import { CommonModule } from '@angular/common';
import { HelpsComponent } from '../../helps/helps.component';
import { DynamicQuestionComponent } from '../../dynamic-question/dynamic-question.component';
// import { JwtHelperService } from '@auth0/angular-jwt';
// import { DataService } from 'src/app/services/data.service';
// import { HelperService } from 'src/app/services/helper.service';
import { HttpClientModule } from '@angular/common/http';
interface SideNavToggle {
  screenwidth: number
  collapsed: boolean
}
@Component({
  selector: 'app-default-layout',
  standalone: true,
  imports: [HttpClientModule, CommonModule, SideNavbarComponent, AppHeaderComponent, AppFooterComponent, RouterModule, HelpsComponent, DynamicQuestionComponent],
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.css']
})
export class DefaultLayoutComponent {

  @Input() collapsed = false
  @Input() screenwidth = 0

  formName!: string
  formHelp!:string

  sidenavedshow: boolean = false
  isSideNavCollapsed = false

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  onToggleSidenav(data: SideNavToggle) {
    this.screenwidth = data.screenwidth
    this.collapsed = data.collapsed
    let styleclass = ""
    if (this.collapsed && this.screenwidth > 768) {
      styleclass = 'body-trimmed'
    } else if (this.collapsed && this.screenwidth <= 768 && this.screenwidth > 0) {
      styleclass = 'body-md-screen'
    }
    return styleclass
  }

  addItem(newItem: string) {
    this.formName = newItem
    this.formHelp = newItem
  }

  class() {
    let styleclass = ""
    if (this.collapsed && this.screenwidth > 768) {
      styleclass = 'body-trimmed'
    } else if (this.collapsed && this.screenwidth <= 768 && this.screenwidth > 0) {
      styleclass = 'body-md-screen'
    }

    if (this.sidenavedshow == false) {
      styleclass = 'default'
    }

    return styleclass
  }
}
