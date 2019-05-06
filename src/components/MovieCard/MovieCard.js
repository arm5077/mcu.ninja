import Hammer from 'hammerjs';
import './MovieCard.scss';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class MovieCard extends HTMLElement {
  constructor() {
    super();
    this.origin = 0;
  }

  static get observedAttributes() {
    return ['title', 'image'];
  }

  set title(val) {
    this.querySelector('.title').innerHTML = val;
  }

  set image(val) {
    this.style.setProperty('background-image', `url('${val}')`);
  }

  set movie(movie) {
    this.title = movie.title;
    this.image = `./assets/${movie.path}`;
    this.movieObj = movie;
    this.unstageCard();
  }

  get movie() {
    return this.movieObj;
  }

  pan() {
    const hammertime = new Hammer(this);
    hammertime.on('panmove', (ev) => {
      this.style.setProperty('left', `${ev.deltaX}px`);
      this.resultCue.width = Math.abs(ev.deltaX);
      if (ev.deltaX > 0) {
        this.resultCue.approve = 'true';
      } else {
        this.resultCue.reject = 'false';
      }
    });
    hammertime.on('panend', () => {
      this.classList.add('transition');
      this.resultCue.classList.add('transition');
      this.resultCue.width = 0;
      this.style.setProperty('left', '0px');
      setTimeout(() => {
        this.classList.remove('transition');
        this.resultCue.classList.remove('transition');
      }, 250);
    });
  }

  swipe() {
    const hammertime = new Hammer(this);
    hammertime.on('swipe', (ev) => {
      const decision = (ev.deltaX > 0) ? 'approve' : 'reject';
      this.makeDecision(decision);
    });
  }

  async makeDecision(decision) {
    this.decision = decision;
    const direction = (decision === 'approve') ? 'right' : 'left';
    await this.slideCard(direction);
    this.dispatchEvent(new Event('decision'));
  }

  async slideCard(direction) {
    this.resultCue.classList.add('transition');
    this.resultCue.width = window.innerWidth;
    this.style.removeProperty('left');
    this.style.removeProperty('right');
    this.classList.add(`exit-${direction}`);
    await sleep(250);

    this.classList.remove('transition');
    this.resultCue.classList.remove('transition');
    this.resultCue.classList.remove('transition');
    this.classList.add('staged');
    this.classList.remove('exit-right', 'exit-left');
    await sleep(350);
  }

  async unstageCard() {
    this.classList.add('transition');
    this.classList.remove('staged');
    await sleep(250);
    this.classList.remove('transition');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this[name] = newValue;
  }

  connectedCallback() {
    this.innerHTML = `
      <div class="content">
        <div class="title-wrapper">
          <div class="title"></div>
        </div>
      </div>
    `;
    this.resultCue = this.parentNode.querySelector('result-cue');
    this.pan();
    this.swipe();
  }
}

window.customElements.define('movie-card', MovieCard);
