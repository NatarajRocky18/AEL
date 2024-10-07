import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, Validators, FormsModule, ReactiveFormsModule, FormArray, FormGroup } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FloatLabelType, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { map } from 'rxjs/operators';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HelpsService } from '../../services/helps.service';
import { F } from '@angular/cdk/keycodes';
import { DataService } from '../../services/data.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-dynamic-question',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    CommonModule,
  ],
  providers: [DataService],
  templateUrl: './dynamic-question.component.html',
  styleUrls: ['./dynamic-question.component.css']
})
export class DynamicQuestionComponent implements OnInit {

  constructor(
    public formBuilder: FormBuilder,
    private helperServices: HelpsService,
    private dataService: DataService,
    private sharedService: SharedService
  ) {
    this.loadInit(this.item)
  }

  currentQuestionIndex = 0;
  @Input() item: any = '';

  @Output() SideNavStatus: EventEmitter<any> = new EventEmitter<any>();

  options!: FormGroup;
  questions: any = [];
  profileSummary: { [key: string]: any } = {};
  selectedCheckBox: string[] = [];
  profiledetails: any = []
  activeItem: string = "";
  // formName: string = ""; 
  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['item']) {
  //     console.log("Child Form Name: " + this.item);
  //     if (this.item != undefined) {

  //       this.loadInit(this.item)
  //     }
  //   }
  // }
  config: any = {}
  loadInit(formName: string) {
    console.log(this.item);

    const formStatuses = this.getFormStatus();
    this.SideNavStatus.emit(formStatuses)

    this.dataService.getjosn(formName).subscribe(
      (response: any) => {
        this.config = response
        this.currentQuestionIndex = 0
        this.options = new FormGroup({})
        this.questions = response['questiones'];
        this.profiledetails = []
        this.questions.forEach((fieldarr: any) => {
          fieldarr.fields.forEach((field: any) => {
            let value: any = {}
            value['key'] = field.name
            value['label'] = field.label
            value['value'] = ""
            this.profiledetails.push(value)
            if (field.type === 'checkbox') {
              const formArray = this.formBuilder.array(field.options.map(() => new FormControl(false)));
              this.options.addControl(field.name, formArray);
            } else if (field.type != "summary") {
              this.options.addControl(field.name, new FormControl())
            }
            if (field.required) {
              const control = this.options.get(field.name) as FormControl
              control.setValidators(Validators.required)
            }
          })
        })
        this.helperServices.setSidenavBehaviour(this.questions[this.currentQuestionIndex])

      },
      (error: any) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  ngOnInit(): void {

    // this.formName = "personal";

    this.sharedService.getemitItem().subscribe((val) => {

      console.log('Received item from side_nav:', val);
      if (val != undefined) {
        this.item = val;

        this.loadInit(this.item)
      }

      // this.loadInit(item)

    });
    this.options = this.formBuilder.group({});
    // this.loadInit("personal");
    this.patchFormFormStorage();

  }

  configloaded = true

  get isFormValid(): boolean {

    return this.options.valid;

  }



  addvalue(name: any, value: any) {
    this.options.get(name)?.setValue(value)
  }

  saveToLocalStorage(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value))
  }

  getFromLocalStorage(key: string) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null
  }


  patchFormFormStorage(): void {
    const savedData = this.getFromLocalStorage(this.item);
    if (savedData) {

      if (savedData.date_of_birth) {
        savedData.date_of_birth = new Date(savedData.date_of_birth);
      }
      this.options.patchValue(savedData);
    }

  }

  saveFormData() {

    console.log("profiledetails", this.profiledetails);

    var date_of_birth = this.options.get('date_of_birth')?.value;

    if (date_of_birth != null) {
      const selectedDate = new Date(date_of_birth);
      const utcDate = new Date(Date.UTC(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      ));
      const utcDateString = utcDate.toISOString().split('T')[0];
      this.options.get('date_of_birth')?.setValue(utcDateString);
    }

    const dataToSend = Object.fromEntries(
      Object.entries(this.options.value).filter(([key, value]) => value !== null && value !== '' && value !== undefined)
    );

    // localStorage.removeItem('formData');
    this.saveToLocalStorage(this.item, dataToSend);

    if (date_of_birth != null) {
      this.dataService.addData("entities/student_entrollment", dataToSend).subscribe((res: any) => {
        res.data.forEach((element: any) => {
          Object.keys(element).forEach(key => {
            let value = element[key];
            const control = this.options.get(key);
            if (control) {
              control.setValue(value);
            } else {
              console.warn(`Form control for key "${key}" not found.`);
            }
          });
        });

        this.options.get('_id')?.setValue(res.inserted_id);
        console.log('Inserted ID:', res.inserted_id);
      });
    }
    const id = this.options.get('_id')?.value;
    if (id) {
      console.log('Retrieved ID:', id);
    }
  }

  FormsList: string[] = [
    "personal",
    "disability",
    "veteran",
    "employment"
  ]

  completedForms: string[] = [];

  getFormStatus() {
    if (!this.completedForms.includes(this.item)) {
      this.completedForms.push(this.item);
    }
    return this.FormsList.map(formName => {
      return {
        key: formName,
        status: this.completedForms.includes(formName) ? 'pending' : 'pending',
      };
    });
  }



  nextQuestion(): void {

    const formStatuses = this.getFormStatus();
    this.SideNavStatus.emit(formStatuses)


    this.saveFormData()
    const currentQuestion = this.questions[this.currentQuestionIndex];

    const requiredFields = currentQuestion.fields.filter((field: any) => field.required);

    const isCurrentQuestionValid = requiredFields.every((field: any) => {
      return this.options.get(field.name)?.valid;
    });

    if (isCurrentQuestionValid) {
      this.currentQuestionIndex++;
      this.helperServices.setSidenavBehaviour(this.questions[this.currentQuestionIndex])
      let prevIndex = Number(this.currentQuestionIndex);
      --prevIndex
      this.questions[prevIndex].fields.forEach((element: any) => {
        let currentSummaryvalue = this.profiledetails.find((res: any) => res.key === element.name);

        if (currentSummaryvalue) {
          currentSummaryvalue['value'] = this.options.get(element.name)?.value || '';

          console.log("Question Name:", element.name);
          console.log("Question Details:", currentSummaryvalue);
        } else {
          console.warn(`No matching entry found for ${element.name} in profiledetails`);
        }
      });
      console.log("Summary Details ", this.profiledetails);

    } else {

    }

    const optionsArray: any = [];
    this.questions.forEach((questionData: any) => {
      const fieldsArray = questionData.fields.map((field: any) => {
        if (field.name && field.label) {
          return {
            key: field.name,
            label: field.label,
            value: this.options.get(field.name)?.value || 'Not provided2'
          };
        }
        return null;
      }).filter((field: any) => field !== null);

      optionsArray.push(...fieldsArray);
    });

    this.profileSummary = optionsArray;
  }

  prevQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.helperServices.setSidenavBehaviour(this.questions[this.currentQuestionIndex])

    }
  }

  isCurrentQuestionValid(): boolean {
    const currentQuestion = this.questions[this.currentQuestionIndex];
    const requiredFields = currentQuestion.fields.filter((field: any) => field.required);

    return requiredFields.every((field: any) => {
      return this.options.get(field.name)?.valid;
    });
  }


  formatValue(key: string, value: any = "notgiven"): string {
    if (value == "notgiven") {
      return 'Not provided';
    }
    if (key === 'race') {
      return this.selectedCheckBox.join(', ') || 'None selected';
    }
    if (key === 'disability_describes') {
      return this.selectedCheckBox.join(', ') || 'None selected';
    }
    if (key === 'work_phone_number') {
      return this.selectedCheckBox.join(', ') || 'None selected';
    }
    if (key === 'date_of_birth' && value) {
      return new Date(value).toLocaleDateString();
    }

    return value !== null && value !== undefined ? String(value) : 'Not provided1';
  }

  updateCheckBox(option: string, isChecked: boolean) {
    if (isChecked) {
      this.selectedCheckBox.push(option);
    } else {
      const index = this.selectedCheckBox.indexOf(option);
      if (index > -1) {
        this.selectedCheckBox.splice(index, 1);
      }
    }
  }

  isLastQuestion(): boolean {
    return this.currentQuestionIndex === this.questions.length - 1;
  }
  FormGroupNames: string[] = []

  confirm() {

    this.FormGroupNames
    this.sharedService.emitItem(this.config['nextformName'])

  }

  cancel() {

    this.sharedService.emitItem(this.config['cancelForm'])

  }

}
