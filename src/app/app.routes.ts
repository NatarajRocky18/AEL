import { Routes } from '@angular/router';
import { AppHeaderComponent } from './component/app-layout/app-header/app-header.component';
import { DefaultLayoutComponent } from './component/app-layout/default-layout/default-layout.component';

export const routes: Routes = [
    // {
    //     path: "",
    //     component: AppHeaderComponent,
    //   },
      {
        path:"",
        component:DefaultLayoutComponent
      }
];
