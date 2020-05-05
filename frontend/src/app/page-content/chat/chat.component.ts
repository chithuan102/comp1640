import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { UserService } from '@app/user.service';
import * as moment from '@lib/moment';
import { UserDetail } from '@app/app.models';
import * as _ from 'lodash';
import { NotifyService } from '@app/core/services/notify.service';
import { AppCoreService } from '@app/app.service';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  items;
  currentUser: UserDetail;
  selectedChannel: any;
  channels: any[] = [];
  channelTemp: any[] = [];
  message = '';
  selectedUsers: any[] = [];
  channelTitle;

  listUser: any[] = [];
  constructor(
    private db: AngularFireDatabase,
    private userService: UserService,
    private coreService: AppCoreService,
    private notifyService: NotifyService) {
    this.currentUser = this.userService.currentUser;

  }

  createChatModal: any = {
    id: 'modalId',
    class: 'modal-custom-super-sm modal-dialog-top  modal-custom-sm',
    title: 'Create channel',
    headerClass: 'myClass',
    textCancel: 'Cancel',
    textConfirm: 'OK',
    hideFooter: false,
    ignoreBackdropClick: true,
    confirm: async () => {
      if (!this.channelTitle) {
        this.coreService.error('Channel title is empty');
        return;
      }
      let isErrors = false;
      this.selectedUsers.forEach((item) => {
        if (!item) {
          isErrors = true;
          return;
        }
      });
      if (isErrors) {
        this.coreService.error('Please invite someone to group chat');
        return;
      }

      if (this.selectedUsers.length === 0 || this.selectedUsers === null) {
        this.coreService.error('Please invite someone to group chat');
        return;
      }

      this.db.list(`/chat/users/user${this.currentUser.id}/userChannels`).push(this.channelTitle);
      const response = await this.getNewUserChannels(this.currentUser.id);

      const result = Object.keys(response).map((key) => {
        return { id: key, value: response[key] };
      });
      this.channels = result;
      this.onCreateChatChannel(this.channels[this.channels.length - 1].id, this.channelTitle);
      // tslint:disable-next-line: max-line-length
      this.selectedUsers.forEach((user) => this.db.list(`/chat/users/user${user.id}/userChannels`).set(this.channels[this.channels.length - 1].id, this.channelTitle));
      this.channelTitle = '';
      this.createChatModal.hide();
    },
    cancel: () => {
      this.createChatModal.hide();
    },
  };

  getNewUserChannels(userId) {
    return new Promise((resolve) => {
      this.db.object(`/chat/users/user${userId}/userChannels`).valueChanges().subscribe((value) => {
        if (value) {

          resolve(value);
        }
      });
    });
  }

  async ngOnInit() {
    if (this.currentUser.role === 'STUDENT') {
      this.listUser.push(this.currentUser.tutor);
      this.selectedUsers.push(this.currentUser.tutor);
    } else {
      const params = {
        page: 1,
        pageSize: 1000,
        tutorId: this.currentUser.id
      };
      const response = await this.coreService.getStudentByTutor(params);
      this.listUser = response.data.result;
    }

    this.getUserChannels();
  }


  async getUserChannels() {
    this.db.object(`/chat/users/user${this.currentUser.id}/userChannels`).valueChanges().subscribe(async (response) => {
      if (response) {
        const result = Object.keys(response).map((key) => {
          return { id: key, value: response[key] };
        });
        const promises = await result.map((object) => this.getChannelByKey(object.id));
        Promise.all(promises).then((responses) => {
          this.channels = responses;
          this.channelTemp = [
            ...this.channels
          ];
          if (!this.selectedChannel) {

            this.onSelectedChannel(this.channels[0]);

          }
        });
      } else {
        this.channels.length = 0;
      }
    });
  }

  onCreateChatChannel(channelId, channelTitle) {
    this.db.object(`/chat/channels/${channelId}`).set(
      {
        id: channelId,
        channelId,
        title: channelTitle,
        userAdmin: this.currentUser.id,
        userJoined: this.selectedUsers.map((user) => user.id),
        messages: [],
      }
    );
  }

  onCreateUserChannel() {
    this.createChatModal.show();

  }



  async onSelectedChannel(item) {
    this.db.object(`/chat/channels/${item.id}/`).valueChanges().subscribe((value) => {
      this.selectedChannel = value;
      const element: any = document.getElementById('msg_history');
      element.scrollTop = element.scrollHeight;
    });

  }


  getChannelByKey(key) {
    return new Promise((resolve) => {
      this.db.object(`/chat/channels/${key}/`).valueChanges().subscribe((value) => {

        resolve(value);
      });
    });
  }

  onSendMessage() {
    if (this.message) {
      const newMessage = {
        senderId: this.currentUser.id,
        senderName: this.currentUser.fullName,
        message: this.message,
        date: moment(new Date()).format('DD/MM/YYYY'),
        time: `${new Date().getHours()}:${new Date().getMinutes()}`,
      };
      this.selectedChannel = {
        ...this.selectedChannel,
        messages: this.selectedChannel.messages ? this.selectedChannel.messages.concat(newMessage) : [newMessage]
      };
      this.db.object(`/chat/channels/${this.selectedChannel.channelId}`).set(this.selectedChannel).then(() => {
        // var element = document.getElementById('msg_history').scrollIntoView({ behavior: 'smooth', block: 'end' });
        const element: any = document.getElementById('msg_history');
        element.scrollTop = element.scrollHeight;
      });
      this.message = '';
    }
  }


  onSelectUsers(selectedUsers: any[]) {
    console.log(selectedUsers);

  }

  async onLeaveGroupChat(channel) {
    this.notifyService.comfirm().then(async confirm => {
      if (confirm.value) {
        const channelWillLeave: any = await this.getChannelByKey(channel.id);

        this.db.list(`/chat/users/user${this.currentUser.id}/userChannels`).remove(channelWillLeave.channelId);
        this.db.object(`/chat/channels/${channelWillLeave.channelId}`).update({
          ...channelWillLeave,
          userJoined: channelWillLeave.filter((id) => id !== this.currentUser.id)
        });
        if (channel.id === this.selectedChannel.channelId) {
          this.selectedChannel = null;
        }
      }
    });
  }

  /**
   * 
   * @param channel {id , value}
   * Lấy channel theo id sau đó base theo value channel mà xóa các user join
   */
  async onDeleteChannel(channel) {
    this.notifyService.comfirm().then(async confirm => {
      if (confirm.value) {
        const channelWillDelete: any = await this.getChannelByKey(channel.id);
        // tslint:disable-next-line:max-line-length
        if (channelWillDelete.userJoined && channelWillDelete.userJoined.length > 0) {
          channelWillDelete.userJoined.forEach((id) => this.db.list(`/chat/users/user${id}/userChannels`).remove(channel.id));
        }
        this.db.list(`/chat/users/user${this.currentUser.id}/userChannels`).remove(channel.id);
        this.db.list(`/chat/channels`).remove(channel.id);
        if (channel.id === this.selectedChannel.channelId) {
          this.selectedChannel = null;
        }
      }
    });
  }


  searchChannel(text) {
    this.channels = this.channelTemp.filter((channel) => channel.title.includes(text));
  }

}
