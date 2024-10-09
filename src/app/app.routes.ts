import { Routes } from '@angular/router';
import { AppHeaderComponent } from './component/app-layout/app-header/app-header.component';
import { DefaultLayoutComponent } from './component/app-layout/default-layout/default-layout.component';
import { DynamicQuestionComponent } from './component/dynamic-question/dynamic-question.component';

export const routes: Routes = [
  // {
  //   path: "",
  //   redirectTo: "/enrollment/personal",
  //   pathMatch: 'full',
  // },
  {
    path: "enrollment",
    component: DefaultLayoutComponent,
    children: [
      {
        path: ":formName",
        component: DynamicQuestionComponent 
      },
      // {
      //   path: ":formName/:id",
      //   component: DynamicQuestionComponent 
      // }
    ]
  }
];
