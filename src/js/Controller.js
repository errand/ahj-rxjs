import { ajax } from 'rxjs/ajax';
import { from, interval, of } from 'rxjs';
import {
  filter, map, mergeMap, catchError,
} from 'rxjs/operators';

import Post from './Post';

export default class Controller {
  constructor(ui) {
    this.ui = ui;
    this.messages = new Set();
    this.URL = 'http://localhost:7070/?method=allTickets';
  }

  init() {
    this.ui.drawUi();
    this.subscribeStream();
    this.btn = document.querySelector('.btn');
    this.btn.addEventListener('click', this.unSubscribe.bind(this));
  }

  subscribeStream() {
    this.messagesStream$ = interval(2000)
      .pipe(
        mergeMap(() => ajax.getJSON(this.URL).pipe(
          map((response) => {
            const newMsgs = response.messages.filter(
              (message) => !this.messages.has(message.id),
            );

            newMsgs.forEach((message) => this.messages.add(message.id));
            return newMsgs;
          }),
          catchError((err) => {
            err.response === null
              ? this.messagesStream$.unsubscribe()
              : of([]);
          }),
        )),
      )

      .subscribe((response) => {
        this.getValue(response);
      });
  }

  getValue(obj) {
    if (!obj.length) {
      return;
    }
    obj.forEach((elem) => {
      const message = new Post(elem);
      message.init();
    });
  }

  unSubscribe(e) {
    if (!e.target.classList.contains('btn')) {
      return;
    }
    e.preventDefault();
    this.messagesStream$.unsubscribe();
  }
}
