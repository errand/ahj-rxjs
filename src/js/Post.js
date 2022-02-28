export default class Post {
  constructor(data) {
    this.data = data;
  }

  init() {
    this.bindToDOM();
  }

  template(data) {
    const div = document.createElement('div');
    div.classList.add('post');
    div.dataset.id = data.id;
    div.innerHTML = `<div class="author">${data.from}, </div>
          <div class="content">${data.body}</div>
          <div class="datetime">${data.received}</div> `;
    return div;
  }

  bindToDOM() {
    const panel = document.querySelector('.tickets');

    const post = this.addPost(this.data);

    panel.prepend(post);
    setTimeout(() => post.classList.add('show'), 0);
  }

  addPost() {
    if (this.data) {
      this.getFormattedText(this.data);

      const result = this.template(this.data);

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
