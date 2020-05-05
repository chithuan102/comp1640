import { Component, Input, Output, EventEmitter, OnInit, forwardRef } from '@angular/core';
import { isNull } from 'lodash';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
@Component({
  selector: 'app-toggle-switch',
  styleUrls: ['./toggle-switch.component.scss'],
  templateUrl: './toggle-switch.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleSwitchComponent),
      multi: true
    }
  ]
})

export class ToggleSwitchComponent implements OnInit, ControlValueAccessor {
  @Input() name;
  @Input() model: any = false;
  @Input() disabled = false;
  @Output() modelChange = new EventEmitter();

  // The variables register functions from ControlValueAccessor
  protected propagateChange: any;

  constructor() { }

  ngOnInit(): void { }

  onChange = ($event) => {
    if (this.disabled) { return; }
    if (typeof this.model === 'boolean') {
      this.model = !this.model;
    } else if (this.model === 1) {
      this.model = 0;
    } else if (this.model === 0) {
      this.model = 1;
    } else if (this.model === null || isNull(this.model) || typeof (this.model) === 'undefined') {
      this.model = 1;
    }
    this.modelChange.emit(this.model);
    if (!this.propagateChange) { return; }
    this.propagateChange(this.model);
  }

  writeValue(obj: any): void {
    this.model = obj;
  }
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
