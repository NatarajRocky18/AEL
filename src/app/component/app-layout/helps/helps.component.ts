import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { HelpsService } from '../../../services/helps.service';

@Component({
  selector: 'app-helps',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './helps.component.html',
  styleUrl: './helps.component.css'
})
export class HelpsComponent implements OnInit {
  @Input() item: any = '';
  questions: any = {}

  constructor(private http: HttpClient, private helperServices: HelpsService) {

  }


  ngOnInit(): void {
    this.helperServices.getSidenavBehaviour().subscribe((res: any) => {
      this.questions = res
    })
  }
}
