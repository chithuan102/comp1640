import { Component, OnInit, Input } from '@angular/core';
import { AppCoreService } from '@app/app.service';
import { saveAs } from 'file-saver';
import { END_POINT } from '@app/app.path';
@Component({
  selector: 'app-export-button',
  templateUrl: './export-button.component.html',
  styleUrls: ['./export-button.component.scss']
})
export class ExportButtonComponent implements OnInit {
  @Input() role: string;
  staticPath = END_POINT.STATIC_PATH;

  constructor(private coreService: AppCoreService) { }

  ngOnInit(): void {
  }


  async exportData() {
    const response = await this.coreService.export({ role: this.role });
    console.log(response);
    saveAs(response.data.url);
  }

}
