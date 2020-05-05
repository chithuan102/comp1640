import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as XLSX from 'xlsx';
import { AppCoreService } from '@app/app.service';
@Component({
  selector: 'app-import-button',
  templateUrl: './import-button.component.html',
  styleUrls: ['./import-button.component.scss']
})
export class ImportButtonComponent implements OnInit {

  @Input() role: string;
  @Output() importDone = new EventEmitter<any>();

  constructor(private coreService: AppCoreService) { }

  ngOnInit(): void {
  }


  // importData(event) {
  //   console.log(event);

  // }
  async importData(event) {
    const responseDepartment = await this.coreService.getDepartments();
    const departments = responseDepartment.data.result;
    const responseRoles = await this.coreService.getRoles();
    const roles = responseRoles.data.result;
    console.log(departments);
    console.log(roles);


    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      // const dataString = JSON.stringify(jsonData);
      const dataString = jsonData;
      const userRole = roles.find((role) => role.description === this.role);
      let body;

      body = dataString.Sheet1.map(object => ({
        ...object,
        // tslint:disable-next-line:max-line-length
        department: departments.find((department) => department.title === object.department) ? departments.find((department) => department.title === object.department) : departments.find((department) => department.title === 'Unknown'),
        groupPermission: userRole,
        role: this.role,
        status: true,
      }));
      console.log(body);
      const response: any = await this.coreService.import(body);
      if (response.status === 200 && !response.errorCode) {
        this.coreService.success('Import data successfully');
        this.importDone.emit({});
      } else {
        this.coreService.error(response.data);

      }


      // document.getElementById('output').innerHTML = dataString.slice(0, 300).concat("...");
      // this.setDownload(dataString);
    };
    reader.readAsBinaryString(event[0]);
  }

}
