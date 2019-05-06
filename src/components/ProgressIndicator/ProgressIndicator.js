import './ProgressIndicator.scss';

class ProgressIndicator extends HTMLElement {
  constructor() {
    super();
    this.total = this.getAttribute('total');
  }

  static get observedAttributes() {
    return ['total', 'completed'];
  }

  createCircles(value) {
    const content = this.querySelector('.content');
    content.innerHTML = '';
    for (let i = 1; i <= this.total; i += 1) {
      const circle = document.createElement('div');
      circle.classList.add('circle');
      this.querySelector('.content').appendChild(circle);
    }
  }

  updateCircles(value) {
    const circles = this.querySelectorAll('.circle');
    circles.forEach((circle, i) => {
      if (i < value) {
        circle.classList.add('filled');
      }
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'total') {
      this.total = newValue;
      if (oldValue) {
        this.createCircles(newValue);
      }
    } else if (name === 'completed') {
      this.updateCircles(newValue);
    }
  }

  connectedCallback() {
    this.innerHTML = `
      <div class="content"></div>
    `;
    this.createCircles();
  }
}

window.customElements.define('progress-indicator', ProgressIndicator);
