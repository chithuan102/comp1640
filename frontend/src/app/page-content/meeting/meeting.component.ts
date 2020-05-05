import { Component, OnInit, ViewChild } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { AppCoreService } from '@app/app.service';
import { PaginationInstance } from 'ngx-pagination';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MeetingObject, UserDetail, Meeting } from '@app/app.models';
import { UserService } from '@app/user.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker/public_api';

import * as moment from 'moment';

import { Subscription, Subject, of, Observable, concat } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';
import { NotifyService } from '@app/core/services/notify.service';
import { async } from '@angular/core/testing';
@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.scss']
})
export class MeetingComponent implements OnInit {

  sources: any[] = [];
  objectDetail = new MeetingObject();

  form = new FormGroup({});
  bsConfig: Partial<BsDatepickerConfig> = {
    dateInputFormat: 'DD/MM/YYYY',

  };

  currentShowOption = 'SHOW_AS_TABLE';

  showOptions = [
    {
      label: 'Show as Table',
      value: 'SHOW_AS_TABLE'
    },
    {
      label: 'Show as Calendar',
      value: 'SHOW_AS_CALENDAR'
    },
  ];

  modalObject: any = {
    id: 'modalId',
    class: 'modal-custom-super-sm modal-dialog-top  modal-custom-sm',
    title: '',
    headerClass: 'myClass',
    textCancel: 'Cancel',
    textConfirm: 'Submit',
    hideFooter: false,
    ignoreBackdropClick: true,
    confirm: async () => {

      if (this.form.invalid) {
        this.coreService.error('Please fill full information');
        return;
      }
      let body: Meeting = this.form.getRawValue();
      body = {
        ...body,
        time: new Date(body.time).getTime(),
        start: JSON.stringify(body.start),
        end: JSON.stringify(body.end),
        creater: { id: body.creater.id },
        inviter: { id: body.inviter.id },
        status: true,
      };
      if (!body.inviter) {
        this.coreService.error('Missing inviter');
        return;
      }
      console.log(body);
      let response;
      if (body.id) {
        const sendMailBody = {
          email: body.inviter,
          text: `${body.creater.email} has update the meeting. Check it out at ${window.location.href}`
        };
        this.coreService.sendMail(sendMailBody);
        response = await this.coreService.updateMeeting(body);
      } else {
        const sendMailBody = {
          email: body.inviter,
          text: `${body.creater.email} has invite you in a meeting. Check it out at ${window.location.href}`
        };
        this.coreService.sendMail(sendMailBody);
        response = await this.coreService.createMeeting(body);
      }
      console.log(response);
      if (response.status === 200) {
        this.coreService.success('Save meeting successfully');
        this.modalObject.hide();
        this.getMeetingByUser();
      } else {
        this.coreService.error('Save meeting failure');
      }


    },
    cancel: () => {
      this.modalObject.hide();
    },
  };

  listMeeting: any[] = [];
  listUsers$: Observable<any>;
  userInput$ = new Subject<string>();
  isFetchingUser = false;
  selectedUser: UserDetail;

  public maxSize = 100;
  public directionLinks = true;
  public autoHide = false;
  public responsive = false;
  public config: PaginationInstance = {
    id: 'advanced',
    itemsPerPage: 10,
    currentPage: 1
  };


  params = {
    page: 1,
    pageSize: 10,
    role: 'STUDENT'
  };

  public labels: any = {
    previousLabel: 'Previous',
    nextLabel: 'Next',
    screenReaderPaginationLabel: 'Pagination',
    screenReaderPageLabel: 'page',
    screenReaderCurrentLabel: `You're on page`
  };


  calendarPlugins = [dayGridPlugin,
    timeGridPlugin, interactionPlugin];
  calendarEvents;

  currentUser = new UserDetail();
  constructor(
    private coreService: AppCoreService,
    private fb: FormBuilder,
    private userService: UserService,
    private notifyService: NotifyService,
  ) {
    this.currentUser = this.userService.currentUser;
    this.getMeetingByUser();
    this.onCreateFormBuilder();
    this.listUsers$ = concat(
      of([]), // default items
      this.userInput$.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => {
          this.isFetchingUser = true;
        }),
        switchMap(term =>
          this.coreService.getUserByEmail(term)
            .then(res => res.data.result)
            .finally(() => {
              this.isFetchingUser = false;
            })
        )));
  }



  ngOnInit(): void {
  }


  handleDateClick(event) { // handler method
    console.log(event);


  }

  eventClick(event) {
    console.log(event.event.id);
    this.getMeetingById(event.event.id);
    //GET EVENT INFO
  }


  onCreate() {
    this.modalObject.hideFooter = false;
    this.objectDetail = new MeetingObject();
    this.onCreateFormBuilder();
    this.modalObject.show();
  }

  onView(item) {
    this.objectDetail = {
      ...item,
      start: JSON.parse(item.start),
      end: JSON.parse(item.end)
    };
    if (this.currentUser.email === item.creater.email) {
      this.modalObject.hideFooter = false;
    } else {
      this.modalObject.hideFooter = true;
    }

    this.onCreateFormBuilder();
    this.modalObject.show();
  }

  onDelete(item) {
    this.notifyService.comfirm().then(async (confirm) => {
      if (confirm.value) {
        const body = {
          ...item,
          status: false,
        };
        const response = await this.coreService.deleteMeeting(body.id);
        if (response.status === 200) {
          const sendMailBody = {
            email: body.inviter,
            text: `${body.creater.fullName} - ${body.creater.email} has deleted a meeting. Check it out at ${window.location.href}`
          };
          this.coreService.sendMail(sendMailBody);
          this.coreService.success('Delete meeting successfully');
          this.getMeetingByUser();
        } else {
          this.coreService.error('Delete meeting failure');
        }
      }
    });
  }

  onPageChange(item) {

  }

  onChangeShowOption(label) {
    console.log(label);
    console.log(this.currentShowOption);

  }
  onCreateFormBuilder() {
    this.form = this.fb.group(
      {
        id: new FormControl({ value: this.objectDetail.id, disabled: true }),
        creater: new FormControl(this.currentUser, [Validators.required]),
        end: new FormControl(this.objectDetail.end),
        inviter: new FormControl(this.objectDetail.inviter, [Validators.required]),
        notes: new FormControl(this.objectDetail.notes, [Validators.required]),
        place: new FormControl(this.objectDetail.place, [Validators.required]),
        start: new FormControl(this.objectDetail.start, [Validators.required]),
        time: new FormControl(this.objectDetail.time ? new Date(this.objectDetail.time) : null, [Validators.required]),
        topic: new FormControl(this.objectDetail.topic, [Validators.required]),
        type: new FormControl(this.objectDetail.type),
      }
    );
    if (this.currentUser.role === 'STUDENT') {
      this.form.patchValue({ inviters: [this.currentUser.tutor] });
    }
  }

  async getMeetingByUser() {
    const response = await this.coreService.getMeetings(this.currentUser.id);
    this.listMeeting = response.data.result;
    this.calendarEvents = this.listMeeting.map((meeting) => ({
      id: meeting.id,
      title: meeting.topic,
      start: moment(meeting.time).format('YYYY-MM-DD'),
    }));
    console.log(this.calendarEvents);

  }

  async getMeetingById(id) {
    const response = await this.coreService.getMeeting(id);
    console.log(response);
    this.objectDetail = {
      ...response.data,
      start: JSON.parse(response.data.start),
      end: JSON.parse(response.data.end)
    };
    this.onCreateFormBuilder();
    this.modalObject.show();
  }



}
