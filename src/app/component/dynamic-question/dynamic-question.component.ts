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
import { HttpClient } from '@angular/common/http';

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
    CommonModule
  ],

  templateUrl: './dynamic-question.component.html',
  styleUrls: ['./dynamic-question.component.css']
})
export class DynamicQuestionComponent implements OnInit {
  constructor(public formBuilder: FormBuilder, private http: HttpClient) { }
  currentQuestionIndex = 0;
  @Input() item: any = 'personal';
  options!: FormGroup;
  questions: any = [

  ]


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
      (res: any) => {

        this.questions = res;
      },
      (error: any) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  ngOnInit(): void {

    this.options = this.formBuilder.group({
    });
    this.options.valueChanges.subscribe((res) => {
      console.log(res);

    })

    this.questions.forEach((res: any) => {
      if (res.type == "checkbox") {
        this.options.addControl(res.name, this.formBuilder.array([]))
        const formarray = this.options.get(res.name) as FormArray
        res.options.forEach((element: any) => {
          formarray.push(new FormControl())
        });
      } else if (res.type == "input") {
        res.fields.forEach((element: any) => {
          this.options.addControl(element.name, new FormControl())
        });
      } else {
        this.options.addControl(res.name, new FormControl())
      }
    })
    this.loadInit("personal")

  }




  configloaded = true
  get isFormValid(): boolean {
    const currentQuestion = this.questions[this.currentQuestionIndex];

    if (currentQuestion.type === 'input' && currentQuestion.fields) {
      return currentQuestion.fields.every((field: any) =>
        this.options.get(field.name)?.valid ?? false
      );
    }

    const control = this.options.get(currentQuestion.name!);
    return control ? control.valid : false;
  }

  addvalue(name: any, value: any) {
    this.options.get(name)?.setValue(value)
  }
  nextQuestion(): void {
    console.log(this.options.value);

    if (this.isFormValid) {
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
      }
    } else {
      this.options.markAllAsTouched();
    }
  }

  prevQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }
}
