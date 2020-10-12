import { Component, OnInit, OnDestroy } from '@angular/core';
import { WorldRecordService } from '../services/world-record.service';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pace-calculator-form',
  templateUrl: './pace-calculator-form.component.html',
  styleUrls: ['./pace-calculator-form.component.css'],
})
export class PaceCalculatorFormComponent implements OnInit, OnDestroy {
  paceForm: FormGroup;
  formSubscription: Subscription;
  dropdownSubscription: Subscription;
  isRaceSelected = '';
  isDistancefiledin = false;
  isTimefiledin = false;
  isPacefiledin = false;
  paceButtonEnabled = false;
  distanceButtonEnabled = false;

  ngOnInit() {
    this.initForm();
    this.handleRaceDropDown();
    this.onChange();
  }
  ngOnDestroy() {
    this.formSubscription.unsubscribe();
    this.dropdownSubscription.unsubscribe();
  }

  constructor(private worldRecordService: WorldRecordService) {}

  onSubmitForm() {}

  //form monitor
  onChange() {
    this.formSubscription = this.paceForm.valueChanges.subscribe((formdata) => {
      let kilometers = this.paceForm.value['kilometers'];
      let meters = this.paceForm.value['meters'];
      let hours = this.paceForm.value['hours'];
      let minutes = this.paceForm.value['minutes'];
      let seconds = this.paceForm.value['seconds'];
      let paceMinutes = this.paceForm.value['paceMinutes'];
      let paceSeconds = this.paceForm.value['paceSeconds'];

      this.distancefiledinCheck(kilometers, meters);
      this.timefiledinCheck(hours, minutes, seconds);
      this.pacefiledinCheck(paceMinutes, paceSeconds);
      //paceButton
      if (this.isDistancefiledin == true && this.isTimefiledin == true) {
        this.paceButtonEnabled = true;
      } else {
        this.paceButtonEnabled = false;
      }
      //DistanceButton
      if (this.isTimefiledin == true && this.isPacefiledin == true) {
        this.distanceButtonEnabled = true;
      } else {
        this.distanceButtonEnabled = false;
      }
    });
  }

  public distancefiledinCheck(kilometers, meters) {
    if (kilometers + meters > 0) {
      this.isDistancefiledin = true;
    } else {
      this.isDistancefiledin = false;
    }
  }
  public timefiledinCheck(hours, minutes, seconds) {
    if (hours + minutes + seconds > 0) {
      this.isTimefiledin = true;
    } else {
      this.isTimefiledin = false;
    }
  }
  public pacefiledinCheck(paceMinutes, paceSeconds) {
    if (paceMinutes + paceSeconds > 0) {
      this.isPacefiledin = true;
    } else {
      this.isPacefiledin = false;
    }
  }

  //resets

  public reset() {}

  public resetDistance() {}

  public resetTime() {
    this.paceForm.patchValue({ hours: 0 });
    this.paceForm.patchValue({ minutes: 0 });
    this.paceForm.patchValue({ seconds: 0 });
  }
  public resetPace() {
    this.paceForm.patchValue({ paceMinutes: 0 });
    this.paceForm.patchValue({ paceSeconds: 0 });
  }

  //------------------------------------------------------------------------

  // Km /Miles selection
  onTogglekmIsSelected() {}

  // Race dropdown menu

  handleRaceDropDown() {
    this.dropdownSubscription = this.paceForm
      .get('selectedRace')
      .valueChanges.subscribe((selectedRace) => {
        if (selectedRace != '') {
          this.isRaceSelected = 'selected';
        } else {
          this.isRaceSelected = '';
        }
        this.resetTime();
        this.resetPace();

        let kilometers = Math.floor(selectedRace);
        let meters = Math.floor((selectedRace - kilometers) * 1000);
        this.paceForm.patchValue({ kilometers: kilometers });
        this.paceForm.patchValue({ meters: meters });
      });
  }
  //------------------------------------------------------------------------

  // button WR Men
  wrMen() {
    if (this.isRaceSelected != '') {
      let record = this.worldRecordService.recordTimeforMen(
        this.paceForm.value['selectedRace']
      );
      console.log('record: ' + record);
      this.paceForm.patchValue({ hours: record[0] });
      this.paceForm.patchValue({ minutes: record[1] });
      this.paceForm.patchValue({ seconds: record[2] });
      this.calculatePace();
    } else {
      alert('Select a race');
    }
  }

  // button WR Women
  wrWomen() {
    if (this.isRaceSelected != '') {
      let record = this.worldRecordService.recordTimeforWomen(
        this.paceForm.value['selectedRace']
      );
      console.log('record: ' + record);
      this.paceForm.patchValue({ hours: record[0] });
      this.paceForm.patchValue({ minutes: record[1] });
      this.paceForm.patchValue({ seconds: record[2] });
      this.calculatePace();
    } else {
      alert('Select a race');
    }
  }
  //------------------------------------------------------------------------

  // Time + Pace = Distance
  calculatePace() {
    //calculate pace
    let paceresultInSec =
      this.convertTimeToSeconds() / this.convertDistanceToKm();

    //populate pace variable
    let paceminutes = Math.floor(paceresultInSec / 60);
    let paceseconds = Math.round(paceresultInSec - paceminutes * 60);

    this.paceForm.patchValue({ paceMinutes: paceminutes });
    this.paceForm.patchValue({ paceSeconds: paceseconds });
  }

  // Time + Pace = Distance
  calculateDistance() {
    let totalDistanceInKm =
      this.convertTimeToSeconds() / this.convertPaceToSeconds();

    let km = Math.floor(totalDistanceInKm);
    let meters = Math.floor((totalDistanceInKm - km) * 1000);
    this.paceForm.patchValue({ kilometers: km });
    this.paceForm.patchValue({ meters: meters });
  }

  // Distance + Pace = Time
  calculateTime() {
    let totalTimeInSeconds =
      this.convertPaceToSeconds() * this.convertDistanceToKm();

    let hours = Math.floor(totalTimeInSeconds / 3600);
    let minutes = Math.floor(totalTimeInSeconds / 60 - hours * 60);
    let seconds = Math.floor(totalTimeInSeconds - hours * 3600 - minutes * 60);

    this.paceForm.patchValue({ hours: hours });
    this.paceForm.patchValue({ minutes: minutes });
    this.paceForm.patchValue({ seconds: seconds });
  }

  //converters
  //------------------------------------------------------------------------
  convertTimeToSeconds() {
    let timeHourInSeconds = this.paceForm.value['hours'] * 3600;
    let timeMinutesInSeconds = this.paceForm.value['minutes'] * 60;
    let timeSecondsInSeconds = this.paceForm.value['seconds'];
    return timeHourInSeconds + timeMinutesInSeconds + timeSecondsInSeconds;
  }
  convertDistanceToKm() {
    let distanceMetersInKm = this.paceForm.value['meters'] / 1000;
    let distanceKilometersInKm = this.paceForm.value['kilometers'];
    return distanceMetersInKm + distanceKilometersInKm;
  }
  convertPaceToSeconds() {
    let paceMinutesInSec = this.paceForm.value['paceMinutes'] * 60;
    let paceSecondsInSec = this.paceForm.value['paceSeconds'];
    return paceMinutesInSec + paceSecondsInSec;
  }

  //------------------------------------------------------------------------

  private initForm() {
    let kilometers = 0;
    let meters = 0;
    let selectedRace = '';
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    let paceMinutes = 0;
    let paceSeconds = 0;

    this.paceForm = new FormGroup({
      kilometers: new FormControl(kilometers, Validators.required),
      meters: new FormControl(meters, Validators.required),
      selectedRace: new FormControl(selectedRace, Validators.required),
      hours: new FormControl(hours, Validators.required),
      minutes: new FormControl(minutes, Validators.required),
      seconds: new FormControl(seconds, Validators.required),
      paceMinutes: new FormControl(paceMinutes, Validators.required),
      paceSeconds: new FormControl(paceSeconds, Validators.required),
    });
  }
}
