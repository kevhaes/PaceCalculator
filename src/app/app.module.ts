import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { PaceCalculatorFormComponent } from './pace-calculator-form/pace-calculator-form.component';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from "./app-routing/app-routing.module";
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [AppComponent,PaceCalculatorFormComponent],
  imports: [BrowserModule,AppRoutingModule, FormsModule,ReactiveFormsModule,CommonModule ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
