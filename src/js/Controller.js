import { ajax } from 'rxjs/ajax';
import { interval, of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';

import Post from './Post';

export default class Controller {
  constructor(ui) {
    this.ui = ui;
    this.messages = new Set();
    this.URL = 'https://errand-ahj-rxjs.herokuapp.com/messages/unread';
  }

  init() {
    this.ui.drawUi();
    this.subscribeStream();
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
            // eslint-disable-next-line no-unused-expressions
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
}
