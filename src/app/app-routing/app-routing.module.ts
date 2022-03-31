import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaceCalculatorFormComponent } from '../pace-calculator-form/pace-calculator-form.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '', component: PaceCalculatorFormComponent
  }

];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes), CommonModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
