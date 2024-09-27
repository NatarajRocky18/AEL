import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideNavbarComponent } from './component/app-layout/side-navbar/side-navbar.component';
import { DefaultLayoutComponent } from './component/app-layout/default-layout/default-layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,DefaultLayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'AEL';
}
