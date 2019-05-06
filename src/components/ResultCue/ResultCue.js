import './ResultCue.scss';

class ResultCue extends HTMLElement {
  /*
  constructor() {
    super();
  }
  */

  connectedCallback() {
    this.innerHTML = `
      <div class="message">
        <div class="emoji-cue"><div>
      </div>
    `;
  }

  static get observedAttributes() {
    return ['width'];
  }

  get approve() {
    return this.attribute.approve;
  }

  get reject() {
    return this.attribute.reject;
  }

  get width() {
    return this.attribute.width;
  }

  set width(val) {
    this.style.setProperty('width', `${val}px`);
    const message = this.querySelector('.message');
    if (val > 50) {
      const opacity = (val - 50) / 200;
      message.style.setProperty('opacity', opacity);
    } else {
      message.style.setProperty('opacity', 0);
    }
  }

  set approve(val) {
    const { movie } = this.parentNode.querySelector('movie-card');
    this.setAttribute('approve', true);
    this.removeAttribute('reject');
  }

  set reject(val) {
    const { movie } = this.parentNode.querySelector('movie-card');
    this.setAttribute('reject', true);
    this.removeAttribute('approve');
  }
}

window.customElements.define('result-cue', ResultCue);
