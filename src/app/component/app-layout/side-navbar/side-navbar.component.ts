import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, NgZone, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
// import { DataService } from 'src/app/services/data.service';
// import { DialogService } from 'src/app/services/dialog.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// import { validate } from 'uuid';
// import { HelperService } from 'src/app/services/helper.service';
// import { environment } from 'src/environments/environment';
import { CommonModule, Location } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedService } from '../../../services/shared.service';
import { Subscription } from 'rxjs';
interface SideNavToggle {
  screenwidth: number
  collapsed: boolean
}

@Component({
  selector: 'app-side-navbar',
  standalone: true,
  imports: [MatMenuModule, MatIconModule, MatButtonModule, MatSidenavModule, CommonModule],
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.css']
})
export class SideNavbarComponent implements OnInit {
  activeItem: string = 'pending';

  @Input() parentData: String = '';
  @Output() onToggleSidenav: EventEmitter<SideNavToggle> = new EventEmitter
  @Output() newItemEvent = new EventEmitter<string>();
  navItems!: any[]

  sideNavStatus = [
    { key: 'personal', status: 'completed' },
    { key: 'disability', status: 'pending' },
    { key: 'veteran', status: 'pending' },
    { key: 'employment', status: 'pending' },
  ];

  constructor(
    private router: Router,
    private zone: NgZone,
    private sharedService: SharedService
  ) { }

  private sidebarSubscription: Subscription | null = null;

  screenId: any
  @Input('header') header: any
  routego: boolean = true;


  ngOnInit(): void {
    if (this.header) {
      this.navItems = this.header
      console.log(this.header);

      this.routego = false
      return
    }
    this.sidebarSubscription = this.sharedService.sidebarUpdate$.subscribe((section: string) => {
      this.updateSidebarStatus(section);
    });
  }

  ngOnDestroy() {
    if (this.sidebarSubscription) {
      this.sidebarSubscription.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.sideNavStatus);
  }
  goToDashboard(item: any) {
    // debugger
    this.sharedService.emitItem(item);

    console.log("parent Form Name :" + item);

    this.router.navigate(['enrollment', item]);

  }

  //status update icon change function
  updateSidebarStatus(section: string) {
    const completedIndex = this.sideNavStatus.findIndex((s) => s.key === section);
    if (completedIndex !== -1) {
      this.sideNavStatus[completedIndex].status = 'completed';
      if (completedIndex < this.sideNavStatus.length - 1) {
        this.sideNavStatus[completedIndex + 1].status = 'pending';
      }
    }
  }

  isDisabled(formKey: string): boolean {

    const formVass = this.sideNavStatus.find((statuszZ) => statuszZ.key === formKey);

    return formVass ? formVass.status === 'pending' : false;
  }

}
