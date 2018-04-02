import {Component, OnInit} from '@angular/core';
import {ChatService} from "../../services/chat.service";
import {AuthService} from "../../services/auth.service";
import {FormBuilder,  Validators} from "@angular/forms";
import * as io from "socket.io-client";
import {Injectable, Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'searchfilter'
})

@Injectable()
export class SearchFilterPipe implements PipeTransform {
    transform(items: any[], field: string, value: string): any[] {
        console.log(items);
        if (!items) return [];
        if (!value) {
            for (var chat in items) {
                items[chat].searched = '';
                items[chat].searchId = '';
            }
            return items;
        } else {
            var num = 0;
            console.log(field, value);
            console.log(items[field]);
            var arr = items.filter(it => it[field].indexOf(value) !== -1);
            for (var key in items) {
                items[key].searched = '';
                items[key].searchId = '';
                for (var i in arr) {
                    if (items[key].updated_at === arr[i].updated_at) {
                        num++;
                        items[key].searched = ' searched';
                        items[key].searchId = 'id' + num;

                    }
                }
            }
            return items;
        }

    }
}


@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
    socket = io('http://localhost:8080/');
    id = null;
    users = [];
    addUsers = [];
    userRoom = 'Room1';
    kayup = {success: false, username: ''};
    form;
    messageClass = '';
    username;
    result;
    search = '';
    newChats = [];
    msgData = {
        id: '',
        room: '',
        username: '',
        message: '',
        updated_at: new Date(),
        messageClass: '',
        searched: '',
        searchId: '',
        img: ''
    };
    room;
    chats = [];
    userChatGroup = [];
    socketId;
    addclass = false;
    num = 0;
    maxNum = 0;
    searched = false;
    selectedFile = null;
    img;
    options;

    constructor(public chatService: ChatService,
                private formBuilder: FormBuilder,
                private authService: AuthService) {
        this.createForm();

    }

    createForm() {
        this.form = this.formBuilder.group({
            message: ['', Validators.required]
        })
    }

    scroolToBottom() {
        var scroller = document.getElementById("autoscroll");
        scroller.scrollTop = scroller.scrollHeight;
    }

    ngOnInit() {
        this.username = localStorage.getItem('user');

        this.allMessage(this.id);
        this.getAllUsers();
        this.getAllChatGroups(this.username);


        this.socket.on('new-message', this.myConnect.bind(this));
        this.socket.on('upKey', this.UserKeyUp.bind(this));
    }

    enter($event) {
        if ($event.keyCode === 13) {
            if (!$event.shiftKey) {
                document.getElementById('send').click();
            }
        }
    }

    addSearched() {
        this.num = 0;
        this.maxNum = 0;
        for (var i = 0; i < this.chats.length; i++) {
            if (this.chats[i].searchId !== '') {
                this.maxNum++;
            }
        }
        for(var i = 1; i <= this.maxNum; i++){
            document.getElementById('id' + i).style.backgroundColor = "";
        }
    };

    scroolUp() {
        this.num++;
        if(this.num <= this.maxNum){
            var newNum = this.num-1;
            document.getElementById('id'+this.num).scrollIntoView();
            document.getElementById('id'+this.num).style.backgroundColor = "orange";
            if(newNum !== 0){
                document.getElementById('id'+ newNum).style.backgroundColor = "";
            }
        }else{
            this.num = 1;
            document.getElementById('id'+this.num).scrollIntoView();
            document.getElementById('id'+this.num).style.backgroundColor = "orange";
            if(this.num !== this.maxNum){
                document.getElementById('id'+ this.maxNum).style.backgroundColor = "";
            }

        }
    }
    scroolDown() {
            this.num--;
            if(this.num >= 1){
                console.log(this.num);
                var newNum = this.num+1;
                document.getElementById('id'+this.num).scrollIntoView();
                document.getElementById('id'+this.num).style.backgroundColor = "orange";
                document.getElementById('id'+ newNum).style.backgroundColor = "";
            }else{
                this.num = this.maxNum;
                document.getElementById('id'+this.num).scrollIntoView();
                document.getElementById('id'+this.num).style.backgroundColor = "orange";
                    if(this.maxNum !== 1){
                        document.getElementById('id1').style.backgroundColor = "";
                    }


            }
    }

    readChat() {
        for (var users in this.userChatGroup) {
            console.log(this.userChatGroup[users].roomId, this.id);
            if (this.userChatGroup[users].roomId == this.id) {
                this.chatService.readChat(this.userChatGroup[users].roomName, this.socketId)
                    .then(res => res);
            }
            if (this.userChatGroup[users].roomId == this.socketId) {
                if (this.id !== this.socketId) {
                    this.userChatGroup[users].noReadMessage++;
                }

            }
        }

    };

    keyUp() {
        this.socket.emit('keyUp', {success: true, username: this.username, id: this.id});

    }

    UserKeyUp = function (data) {
        if (this.id === data.id) {
            this.kayup = data;
            setTimeout(() => {
                this.kayup.success = false;
            }, 5000);
        }
        setTimeout(() => {
            this.scroolToBottom();
        }, 1);
    };
    myConnect = function (data) {
        if (data.messageClass === 'connected') {
            this.messageClass = "connected";
        } else {
            if (data.username === this.username) {
                this.messageClass = 'myMsg';
            } else {
                this.messageClass = 'usersMsg';
            }
        }
        this.socketId = data.id;
        if (this.id === data.id) {
            this.newChats.push({
                id: this.id,
                messages: {
                    username: data.username,
                    message: data.message,
                    updated_at: data.updated_at,
                    messageClass: this.messageClass,
                    img: data.img
                }
            });
        }

        this.userChatLoader();
        setTimeout(() => {
            this.scroolToBottom();
        }, 300);
    };

    closeAddUser() {
        this.addclass = false;
    }

    add() {
        this.addUsers = [];
        for (var key in this.userChatGroup) {
            if (this.userChatGroup[key].roomId === this.id) {
                for (var users = 0; users < this.userChatGroup[key].roomName.length; users++) {
                    for (var user in this.users) {
                        if (this.users[user].username !== this.userChatGroup[key].roomName[users]) {
                            this.addUsers.push(this.users[user].username);
                        }
                    }
                }
            }
        }
        this.addclass = true;
    }

    addUserToChat(username) {
        this.chatService.addUserToChat(username, this.id)
            .then(res => res);
        this.addclass = false;
    }

    getAllUsers() {
        this.authService.getAllUsers()
            .then(data => {
                for (var user in data.users) {
                    console.log(data.users[user].username, this.username);
                    if (data.users[user].username !== this.username) {
                        this.users.push(data.users[user]);
                    }
                }
            });
    }

    getAllChatGroups(username) {
        this.chatService.getAllChatGroups(username)
            .then(data => {
                console.log(data.chats);
                for (var key in data.chats) {
                    this.userChatGroup.push(data.chats[key]);
                }
            })
    }

    getGroupChats(id) {
        this.id = id;
        this.allMessage(id);
        this.addSearched();
        console.log('After All Messages!!!');
        // this.chatService.checkRead(id, this.username)
        //     .then(res => {
        //         console.log(res);
        //     });
        console.log('Server request!!!');
        for (var key in  this.userChatGroup) {
            if (this.userChatGroup[key].roomId === this.id) {
                this.userChatGroup[key].noReadMessage = 0;
            }
        }
    }

    addChat(data) {
        var postData = {myusername: this.username, yourusername: data};
        this.chatService.addChat(postData)
            .then(res => {
                console.log(res.chat.id);
                this.id = res.chat.id;
                this.allMessage(this.id);
            })
            .catch(err => err);
    }

    userChatLoader() {
        this.chats = [];
        for (var key in this.newChats) {
            if (this.newChats[key].id === this.id) {
                this.chats.push(this.newChats[key].messages);
            }
        }
    }


    allMessage(id) {
        this.newChats = [];
        if (!id) {
            this.chatService.getAllChatsByRoom(this.userRoom)
                .then(data => {
                    for (var key in data) {
                        if (data[key].username === this.username) {
                            this.messageClass = 'myMsg';
                        } else {
                            this.messageClass = 'usersMsg';
                        }
                        this.newChats.push({
                            id: id,
                            messages: {
                                username: data[key].username,
                                message: data[key].message,
                                updated_at: data[key].updated_at,
                                messageClass: this.messageClass,
                                img: data[key].imgPath
                            }
                        });
                    }
                    this.userChatLoader();
                })
                .catch(err => err);
        } else {
            this.chatService.getChatById(id)
                .then(data => {

                    for (var key in data.chat.usersgroup) {
                        if (data.chat.usersgroup[key].sender === this.username) {
                            this.messageClass = 'myMsg';
                        } else {
                            this.messageClass = 'usersMsg';
                        }
                        this.newChats.push({
                                id: id,
                                messages: {
                                    username: data.chat.usersgroup[key].sender,
                                    message: data.chat.usersgroup[key].message,
                                    updated_at: data.chat.usersgroup[key].updated_at,
                                    messageClass: this.messageClass,
                                    img: data.chat.usersgroup[key].imgPath
                                }
                            }
                        );
                    }
                    this.userChatLoader();
                })
        }
        setTimeout(() => {
            this.scroolToBottom();
        }, 300);
    }

    eventFile(event){
        this.selectedFile = event.target.files[0];
        let formData = new FormData();
        formData.append('file', this.selectedFile, this.selectedFile.name);

        this.chatService.uploadImage(formData)
            .then(data => {
                this.img = data.file.path;
                    this.sendMessage(this.id);
            })
            .catch(err => err);
    }

    sendMessage(id) {
        this.authService.createAuthHeaders();
        this.options = this.authService.options;
        this.kayup = {success: false, username: ''};
        if (id === null) {
            this.msgData.messageClass = '';
            this.msgData.message = this.form.get('message').value;
            this.msgData.username = this.username;
            this.msgData.updated_at = new Date();
            this.msgData.room = 'Room1';
            this.msgData.id = this.id;
            this.msgData.img = this.img;
            this.img = '';
            this.socket.emit('sendMessage', this.msgData);
            this.chatService.saveChat(this.msgData)
                .then(data => data)
                .catch(err => err);
            this.result = '';
        } else {
            this.msgData.messageClass = '';
            this.msgData.message = this.form.get('message').value;
            this.msgData.username = this.username;
            this.msgData.updated_at = new Date();
            this.msgData.id = id;
            this.msgData.img = this.img;
            this.img = '';
            this.socket.emit('sendMessage', this.msgData);
            this.chatService.saveChatById(this.msgData)
                .then(data => data);
            this.result = '';
        }
    }
}
