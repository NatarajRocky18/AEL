import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, OnInit, SimpleChanges } from '@angular/core';
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
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HelpsService } from '../../services/helps.service';
import { F } from '@angular/cdk/keycodes';
import { DataService } from '../../services/data.service';

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
    HttpClientModule, 
  ],
  

  templateUrl: './dynamic-question.component.html',
  styleUrls: ['./dynamic-question.component.css']
})
export class DynamicQuestionComponent implements OnInit {

  constructor(
    public formBuilder: FormBuilder, 
    private http: HttpClient, 
    private helperServices: HelpsService,
    private dataService: DataService
  ) 
    { }

  apiUrl = 'http://localhost:3000/ael/add';
  currentQuestionIndex = 0;
  @Input() item: any = '';
  options!: FormGroup;
  questions: any = [];
  profileSummary: { [key: string]: any } = {};
  selectedRaces: string[] = [];
  profiledetails: any = []


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item']) {
      console.log("Child Form Name: " + this.item);
      if (this.item != undefined) {

        this.loadInit(this.item)
      }
    }
  }


  loadInit(formName: string) {
    this.http.get(`assets/json/${formName}.json`).subscribe(
      (response: any) => {
        this.currentQuestionIndex = 0
        this.options = new FormGroup({})
        this.questions = response;
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

    this.options = this.formBuilder.group({
    });
    this.loadInit("personal")
  }

  configloaded = true

  get isFormValid(): boolean {
    // return true;
    return this.options.valid;

  }



  addvalue(name: any, value: any) {
    this.options.get(name)?.setValue(value)
  }

  saveFormData() {
    console.log("profileSummary" ,this.profileSummary);
    console.log("profiledetails" ,this.profiledetails);
    console.log("this.options.value" ,this.options.value);
    
    this.http.post(this.apiUrl, this.options.value).subscribe((res: any) => {
      console.log(res)
    });
  }

  nextQuestion(): void {
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
          // Update the value if the element is found in profiledetails
          currentSummaryvalue['value'] = this.options.get(element.name)?.value || '';

          console.log("Question Name:", element.name);
          console.log("Question Details:", currentSummaryvalue);
        } else {
          // If no match is found, log it or handle it accordingly
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
      return this.selectedRaces.join(', ') || 'None selected';
    }
    if (key === 'disability_describes') {
      return this.selectedRaces.join(', ') || 'None selected';
    }
    if (key === 'work_phone_number') {
      return this.selectedRaces.join(', ') || 'None selected';
    }
    if (key === 'date_of_birth' && value) {
      return new Date(value).toLocaleDateString();
    }

    return value !== null && value !== undefined ? String(value) : 'Not provided1';
  }

  updateSelectedRaces(option: string, isChecked: boolean) {
    if (isChecked) {
      this.selectedRaces.push(option);
    } else {
      const index = this.selectedRaces.indexOf(option);
      if (index > -1) {
        this.selectedRaces.splice(index, 1);
      }
    }
  }

  isLastQuestion(): boolean {
    return this.currentQuestionIndex === this.questions.length - 1;
  }

}
