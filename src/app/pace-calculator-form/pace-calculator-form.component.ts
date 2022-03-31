import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
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
  distanceSubscription: Subscription;
  dropdownSubscription: Subscription;
  isRaceSelected = '';
  isDistancefiledin = false;
  isTimefiledin = false;
  isPacefiledin = false;
  paceButtonEnabled = false;
  distanceButtonEnabled = false;
  timeButtonEnabled = false;
  selectedRaceDistance = 0;
  isMilesModeOn = false
  isMilesSelected;
  

  ngOnInit() {
    this.initForm();
    this.handleRaceDropDown();
    this.onChange();
   // List<Record> records 
  
  }
  ngOnDestroy() {
    this.formSubscription.unsubscribe();
    this.dropdownSubscription.unsubscribe();
  }

  constructor(private worldRecordService: WorldRecordService) { }

  onSubmitForm() { }



  //form monitor
  onChange() {
    this.formSubscription = this.paceForm.valueChanges
      .subscribe((formdata) => {
     
      let kilometers = this.paceForm.value['kilometers'];
      let meters = this.paceForm.value['meters'];
      let hours = this.paceForm.value['hours'];
      let minutes = this.paceForm.value['minutes'];
      let seconds = this.paceForm.value['seconds'];
      let paceMinutes = this.paceForm.value['paceMinutes'];
      let paceSeconds = this.paceForm.value['paceSeconds'];
      let isMilesSelected = this.paceForm.value['isMilesSelected'];


      this.distancefiledinCheck(kilometers, meters);
      this.timefiledinCheck(hours, minutes, seconds);
      this.pacefiledinCheck(paceMinutes, paceSeconds);
    
     

       //DistanceButton
        if (this.isTimefiledin && this.isPacefiledin) {
          if (!this.isRaceSelected) {
        this.distanceButtonEnabled = true;
          }
      } else {
        this.distanceButtonEnabled = false;
      }
      //TimeButton
      if (this.isDistancefiledin  && this.isPacefiledin ) {
        this.timeButtonEnabled = true;
      } else {
        this.timeButtonEnabled = false;
      }
      //paceButton
      if (this.isDistancefiledin && this.isTimefiledin ) {
        this.paceButtonEnabled = true;
      } else {
        this.paceButtonEnabled = false;
        }

       // milsesCheckbox
        if (isMilesSelected) {
          this.isMilesModeOn = true;
          console.log(this.isMilesModeOn)
        } else {
          this.isMilesModeOn = false;
          console.log(this.isMilesModeOn)}



      //if (this.selectedRaceDistance != this.paceForm.value['kilometers']) {
      //  console.log("differenece!")
      //} else {
      //  console.log("Same!")

      //}
    });

  }
  //onCheckboxChange(event: any) {
  ////  const selectedCountries = (this.paceForm.controls.selectedCountries as FormArray);
  //  if (event.target.checked) {
  //   // selectedCountries.push(new FormControl(event.target.value));
  //    console.log(event.target);
  //  } else {
  //    console.log(event.target.value);
  //  }
  //}
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

  public refresh() {
    window.location.reload();
  }

  public resetDistance() {
    this.paceForm.patchValue({ kilometers: null });
    this.paceForm.patchValue({ meters: null });
  }

  public resetTime() {
    this.paceForm.patchValue({ hours: null });
    this.paceForm.patchValue({ minutes: null });
    this.paceForm.patchValue({ seconds: null });
  }
  public resetPace() {
    this.paceForm.patchValue({ paceMinutes: null });
    this.paceForm.patchValue({ paceSeconds: null });
  }
  public resetDropdown() {
    this.paceForm
      .get('selectedRace').setValue('');
  }
  public compareFn() {
    return 
  }

  
  //------------------------------------------------------------------------

  // Km /Miles selection


  onTogglekmIsSelected() {}

  // Race dropdown menu

  handleRaceDropDown() {

  
    this.dropdownSubscription = this.paceForm
      .get('selectedRace')
      .valueChanges
      .subscribe((selectedRace) => {
        if (selectedRace != '') {
          this.isRaceSelected = 'selected';
          
        } else {
          this.isRaceSelected = '';
        }
        this.selectedRaceDistance = selectedRace;
        console.log(this.selectedRaceDistance)
       
        this.resetTime();
        this.resetPace()

        let kilometers = Math.floor(selectedRace);
        let meters = Math.floor((selectedRace - kilometers) * 1000);
        this.paceForm.patchValue({ kilometers: kilometers });
        this.paceForm.patchValue({ meters: meters });
          })

 
      
  }

  //------------------------------------------------------------------------

  // button WR Men
  WrTimeMenclicked() {
    if (this.isRaceSelected != '') {
      let record = this.worldRecordService.recordTimeforMen(
        this.paceForm.value['selectedRace']
      );
      const splitesRecordArray = new Array(record.split(":"));
      console.log("length: "+splitesRecordArray[0].length);
      console.log(splitesRecordArray);
      let hours = splitesRecordArray[0][0]
      let minutes = splitesRecordArray[0][1]
      let seconds = splitesRecordArray[0][2]
      console.log("hours: " + hours + "  minutes: " + minutes + "  seconds: " + seconds )

      console.log('record: ' + record);
      console.log('received string: ' + record);
      if (splitesRecordArray[0].length == 3) {
        this.paceForm.patchValue({ hours: record.split(":")[0] });
        this.paceForm.patchValue({ minutes: record.split(":")[1] });
        this.paceForm.patchValue({ seconds: record.split(":")[2] });
      } else if (splitesRecordArray[0].length == 2) {

        this.paceForm.patchValue({ hours: "00" });
        this.paceForm.patchValue({ minutes: splitesRecordArray[0][0] });
        this.paceForm.patchValue({ seconds: splitesRecordArray[0][1] });
      } else {
        this.paceForm.patchValue({ seconds: record.split(":")[0] });
      }


      this.calculatePace();
    } else {
      alert('Select a race');
    }
  }

  // button WR Women
  WrTimeWomenclicked() {
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
    console.log(" calculating pace: " + this.convertTimeToSeconds() + " / " +this.convertDistanceToKm())

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
    console.log("hours in form  " + this.paceForm.value['hours']);
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

  public initForm() {
    let selectedRace = '';
    let kilometers ;
    let meters ;
    let hours ;
    let minutes ;
    let seconds ;
    let paceMinutes ;
    let paceSeconds ;
    let placeholder = "0";
    let isMilesSelected=false;

    this.paceForm = new FormGroup({
      kilometers: new FormControl(kilometers, Validators.required),
      meters: new FormControl(meters, Validators.required),
      selectedRace: new FormControl(selectedRace, Validators.required),
      hours: new FormControl(hours, Validators.required),
      minutes: new FormControl(minutes, Validators.required),
      seconds: new FormControl(seconds, Validators.required),
      paceMinutes: new FormControl(paceMinutes, Validators.required),
      paceSeconds: new FormControl(paceSeconds, Validators.required),
      isMilesSelected: new FormControl(isMilesSelected),
      placeholder: new FormControl(placeholder)
    });

    //start following km and m
    //this.paceForm.get('kilometers').valueChanges
    //  .pipe(
    //  tap(val => {
    //    console.log("Tap " + val);
    //  }))
    //  .subscribe((val) => {
    //    console.log(val);
    //    if (val != Math.floor(this.selectedRaceDistance)) {
    //      console.log('diffe')
    //    }
        //reset drpdwn without affecting value

        //this.paceForm
        //  .get('selectedRace').setValue('');
        //this.paceForm
        //  .get('kilometers').setValue(x);

      //}
    //})
  //  this.paceForm.get('meters').valueChanges.subscribe((x) => {
  //    if (x != (Math.floor((this.selectedRaceDistance - Math.floor(this.selectedRaceDistance)) * 1000))) {
  //      //this.paceForm
  //      //  .get('selectedRace').setValue('');
  //      //this.paceForm
  //      //  .get('meters').setValue(x);

  //    } else {
  //      console.log('race and m and k same')
  //    }
  //  })
  }
}
//let km = Math.floor(totalDistanceInKm);
//let meters = Math.floor((totalDistanceInKm - km) * 1000);
