export default class Post {
  constructor(data) {
    this.data = data;
    this.created = new Date(data.received).toLocaleString();
  }

  init() {
    this.bindToDOM();
  }

  template(data, created) {
    const date = this.dateFormatted(created);
    return `
      <div class="post" data-id="${data.id}" data-time="${date}" data-author="${data.from}">
          <div class="posts__author">${data.from}, </div>
          <div class="post__content">${data.body}</div>
          <div class="posts__datetime">${date}</div>  
      </div>
      `;
  }

  dateFormatted(data) {
    const date = new Date(data.received).toLocaleString().split(',').reverse();
    return `${date[0]}, ${date[1]}`;
  }

  bindToDOM() {
    const panel = document.querySelector('.tickets');

    const post = this.addPost(this.data, this.created);

    panel.prepend(post);
  }

  addPost() {
    if (this.data) {
      this.getFormattedText(this.data);

      const result = this.template(this.data, this.created);

      return result;
    }
    return false;
  }

  getFormattedText(data) {
    const text = data.body.split('');
    if (text.length <= 15) {
      return;
    }
    const result = text.splice(0, 15);
    data.body = result.toString().replaceAll(',', '').concat('...');
  }
}
