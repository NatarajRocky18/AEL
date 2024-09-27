import { Component } from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { SideNavbarComponent } from '../side-navbar/side-navbar.component';

@Component({
  selector: 'app-app-header',
  standalone: true,
  imports: [MatMenuModule, MatIconModule,MatButtonModule,RouterModule,SideNavbarComponent],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.css'
})
export class AppHeaderComponent {

}
