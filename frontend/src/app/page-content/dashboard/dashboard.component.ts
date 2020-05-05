import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartDataSets, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { PaginationInstance } from 'ngx-pagination';
import { AppCoreService } from '@app/app.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { UserService } from '@app/user.service';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import * as moment from 'moment';
import { element } from 'protractor';
import { Observable, Subject, concat, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentOptionUnactive: any;
  totalMessageWithTutor;
  channels: any[] = [];
  statistics;
  listUsers$: Observable<any>;
  userInput$ = new Subject<string>();
  isFetchingTutor = false;
  selectedUser;


  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'left',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    },
  };
  public pieChartLabels: Label[] = ['Total Messages', 'Message Sended', 'Message Received'];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [pluginDataLabels];
  public pieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'],
    },
  ];

  // dynamic chart
  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    // scales: { xAxes: [{}], yAxes: [{}] },
  };
  // tslint:disable-next-line:max-line-length
  public barChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];
  public barChartData: ChartDataSets[] = [];
  public barChartColors = [];

  sources: any[] = [];

  studentNoTutorList: any[] = [];
  studentUnActive: any[] = [];
  studentUnActive7Days: any[] = [];
  studentUnActive28Days: any[] = [];




  public maxSize = 100;
  public directionLinks = true;
  public autoHide = false;
  public responsive = false;

  public studentNoTutorConfig: PaginationInstance = {
    id: 'advanced',
    itemsPerPage: 10,
    currentPage: 1
  };


  public studentUnactiveConfig: PaginationInstance = {
    id: 'advanced',
    itemsPerPage: 10,
    currentPage: 1
  };


  studentNoTutorParams = {
    page: 1,
    pageSize: 10,
    role: 'STUDENT'
  };


  studentNotActiveOptions = [

    {
      value: '7_DAYS',
      label: ' 7 DAYS',
    }, {
      value: '28_DAYS',
      label: ' 28 DAYS',
    },


  ]

  public labels: any = {
    previousLabel: 'Previous',
    nextLabel: 'Next',
    screenReaderPaginationLabel: 'Pagination',
    screenReaderPageLabel: 'page',
    screenReaderCurrentLabel: `You're on page`
  };
  currentUser;
  constructor(
    private coreService: AppCoreService,
    private userService: UserService,

    private db: AngularFireDatabase,
  ) {
    this.currentUser = userService.currentUser;
    this.getUserChannels(this.currentUser.id);
    this.getStudentNoTutor();
    this.getStudentUnActive();
  }

  ngOnInit(): void {
    this.listUsers$ = concat(
      of([]), // default items
      this.userInput$.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => {
          this.isFetchingTutor = true;
        }),
        switchMap(term =>
          this.coreService.getUserByEmail(term)
            // tslint:disable-next-line:max-line-length
            .then(res => res.data.result.filter(user => user.role !== 'ADMIN').map((user) => ({ ...user, displayName: `${user.fullName} - ${user.email}` })))
            .finally(() => {
              this.isFetchingTutor = false;
            })
        )));
  }

  async getStudentNoTutor() {
    const response = await this.coreService.getStudentNoTutor(this.studentNoTutorParams);
    console.log(response);
    this.studentNoTutorList = response.data.result;
    this.studentNoTutorConfig.totalItems = response.data.totalCount;
    this.currentOptionUnactive = this.studentNotActiveOptions[0].value;

  }

  async getStudentUnActive() {
    const studentUnactive = {
      page: 1,
      pageSize: 1000,
      role: 'STUDENT'

    }
    const response = await this.coreService.getStudentUnActive(studentUnactive);
    console.log(response);
    const listStudentOrigin = response.data.result;
    this.studentUnActive.forEach((user) => {
      const delta = (new Date().getTime() - user.lastDateActive) / 86400000;
      console.log(Math.round(delta));
    });
    this.studentUnActive7Days = listStudentOrigin.filter((user) => {
      const delta = Math.round((new Date().getTime() - user.lastDateActive) / 86400000) || 10;
      if (delta > 7 && delta < 28) {
        return true;
      } else {
        return false;
      }
    });
    console.log(this.studentUnActive7Days);

    this.studentUnActive28Days = listStudentOrigin.filter((user) => {
      const delta = Math.round((new Date().getTime() - user.lastDateActive) / 86400000) || 10;
      if (delta > 28) {
        return true;
      } else {
        return false;
      }
    });
    console.log(this.studentUnActive7Days);
    console.log(this.studentUnActive28Days);


    this.studentUnactiveConfig.totalItems = this.studentUnActive7Days.length;
    this.studentUnActive = this.studentUnActive7Days;
  }
  onPageChange(event) {

  }

  onPageStudentNoTutorChange(event) {

  }

  onChange(event) {

  }

  async getUserChannels(userId) {
    this.db.object(`/chat/users/user${userId}/userChannels`).valueChanges().subscribe(async (response) => {
      if (response) {
        console.log(response);

        const result = Object.keys(response).map((key) => {
          return { id: key, value: response[key] };
        });
        const promises = await result.map((object) => this.getChannelByKey(object.id));
        Promise.all(promises).then((responses) => {
          console.log(responses);

          const messages: any = responses.reduce((prev: any, current: any) => {
            console.log(current.messages);

            let currentMessage = [];
            if (!current.messages) {
              currentMessage = [];
            } else {
              currentMessage = current.messages;
            }
            console.log(currentMessage);

            return prev = [...prev, ...currentMessage];
          }, []);
          console.log(messages);

          console.log(this.channels);
          const totalMessages = messages.length;
          console.log('totalMessage', totalMessages);
          const sendByCurrentUser = messages.filter((message) => message.senderId === userId).length;
          console.log('sendByCurrentUser', sendByCurrentUser);
          const totalMessageBarChart = [];
          for (let index = 0; index < 12; index++) {
            totalMessageBarChart.push(0);

          }
          const messageSendedBarChart = [];
          for (let index = 0; index < 12; index++) {
            messageSendedBarChart.push(0);
          }
          const messageReceived = [];
          for (let index = 0; index < 12; index++) {
            messageReceived.push(0);
          }


          totalMessageBarChart.forEach((value, index) => {
            totalMessageBarChart[index] = messages.filter(element1 => moment(element1.date, 'DD/MM/YYYY').month() === index).length;

          });
          messageSendedBarChart.forEach((value, index) => {
            // tslint:disable-next-line:max-line-length
            messageSendedBarChart[index] = messages.filter((element2: any) =>
              moment(element2.date, 'DD/MM/YYYY').month() === index && element2.senderId === userId
            ).length;
          });

          messageReceived.forEach((value, index) => {
            // tslint:disable-next-line:max-line-length
            messageReceived[index] = totalMessageBarChart[index] - messageSendedBarChart[index];
          });

          this.pieChartData = [totalMessages, sendByCurrentUser, totalMessages - sendByCurrentUser];

          this.barChartData[0] = { data: totalMessageBarChart, label: 'Total Messages' };
          this.barChartData[1] = { data: messageSendedBarChart, label: 'Message Sended' };
          // tslint:disable-next-line:max-line-length
          this.barChartData[2] = { data: messageReceived, label: 'Message Received' };
          this.statistics = {
            totalMessages,
            sendByCurrentUser
          };
        });
        return;
      } else {
        this.pieChartData = [0, 0, 0];
        this.barChartData[0] = { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Total Messages' };
        this.barChartData[1] = { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Message Sended' };
        // tslint:disable-next-line:max-line-length
        this.barChartData[2] = { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Message Received' };
      }
    });


  }

  getChannelByKey(key) {
    return new Promise((resolve) => {
      this.db.object(`/chat/channels/${key}/`).valueChanges().subscribe((value) => {

        resolve(value);
      });
    });
  }


  async onSelectUser(user) {
    console.log(user);

    this.getUserChannels(user.id);

  }

  initChartColors() {
    this.barChartColors = [
      {
        backgroundColor: 'rgba(255,0,0,0.3)',
      },
      {
        backgroundColor: 'rgba(0,255,0,0.3)',
      },
      {
        backgroundColor: 'rgba(0,0,255,0.3)',
      },
    ];
    this.pieChartColors = [
      {
        backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'],
      },
    ];
  }


  onChangeShowStudenUnactive(option) {
    console.log(option);
    switch (option.value) {
      case '7_DAYS':
        this.studentUnactiveConfig.totalItems = this.studentUnActive7Days.length;
        this.studentUnActive = this.studentUnActive7Days;
        break;
      case '28_DAYS':
        this.studentUnactiveConfig.totalItems = this.studentUnActive28Days.length;
        this.studentUnActive = this.studentUnActive28Days;
        break;


      default:
        this.studentUnactiveConfig.totalItems = this.studentUnActive7Days.length;
        this.studentUnActive = this.studentUnActive7Days;
        break;
    }

  }
}
