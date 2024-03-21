import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
const XLSX = require('xlsx');
const readlineSync = require('readline-sync');

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  @ViewChild('myModal') model: ElementRef | undefined;
  patientObj: Patient = new Patient();
  patientList: Patient[] = [];

  ngOnInit(): void {
    const localData = localStorage.getItem("angular17crud");
    if(localData != null) {
      this.patientList = JSON.parse(localData)
    }
  }

  openModel() {
    const model = document.getElementById("myModal");
    if (model != null) {
      model.style.display = 'block'
    }
  }

  closeModel() {
    this.patientObj = new Patient();
    if (this.model != null) {
      this.model.nativeElement.style.display = 'none';
    }
  }

  onDelete(item: Patient) {
    const isDelet = confirm("Are you sure want to Delete");
    if(isDelet) {
      const currentRecord =  this.patientList.findIndex(m=> m.id === this.patientObj.id);
      this.patientList.splice(currentRecord,1);
      localStorage.setItem('angular17crud', JSON.stringify(this.patientList));
    }
  }

  onEdit(item: Patient) {
    this.patientObj =  item;
    this.openModel();
  }

  updatePatient() {
    const currentRecord =  this.patientList.find(m=> m.id === this.patientObj.id);
    if(currentRecord != undefined) {
      currentRecord.name = this.patientObj.name;
      currentRecord.address =  this.patientObj.address;
      currentRecord.mobileNo =  this.patientObj.mobileNo;
    };
    localStorage.setItem('angular17crud', JSON.stringify(this.patientList));
    this.closeModel()
  }

  onSearchValue(): void {
    const workbook = XLSX.readFile('data01.xlsx');
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

/*     const userInput = readlineSync.question('Enter the value to search: ');
 */    const userInput = readlineSync.question(this.Sex);

    const data = XLSX.utils.sheet_to_json(worksheet);

    const result = data.find((row: any) => row['B'] === userInput);

    if (result) {
      console.log(`Value found: ${result['C']}`);
    } else {
        console.log('Value not found.');
    }
  }

  savePatient() {
    debugger;
    const isLocalPresent = localStorage.getItem("angular17crud");
    if (isLocalPresent != null) {
      
      const oldArray = JSON.parse(isLocalPresent);
      this.patientObj.id = oldArray.length + 1;
      oldArray.push(this.patientObj);
      this.patientList = oldArray;
      localStorage.setItem('angular17crud', JSON.stringify(oldArray));
    } else {
      const newArr = [];
      newArr.push(this.patientObj);
      this.patientObj.id = 1;
      this.patientList = newArr;
      localStorage.setItem('angular17crud', JSON.stringify(newArr));
    }
    this.closeModel()
  }
}

export class Patient {
  id: number;
  name: string;
  mobileNo: string;
  email: string;
  Sex: string;
  medicine: string;
  disease: string;
  address: string;

  constructor() {
    this.id = 0;
    this.address = '';
    this.Sex = '';
    this.email = '';
    this.mobileNo = '';
    this.name = '';
    this.medicine = '';
    this.disease = '';
  }

}
