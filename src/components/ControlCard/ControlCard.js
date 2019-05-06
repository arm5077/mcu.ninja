import './ControlCard.scss';
import '../FlipElement/FlipElement';

class ControlCard extends HTMLElement {
  set title(val) {
    let flipped = this.querySelector('flip-element#title').getAttribute('flipped');
    if (flipped === null) {
      flipped = false;
    } else {
      flipped = (flipped === 'true');
    }
    if (flipped) {
      this.querySelector('div[slot="front-content"] .title').innerHTML = val;
    } else {
      this.querySelector('div[slot="back-content"] .title').innerHTML = val;
    }
    this.querySelector('flip-element#title').setAttribute('flipped', !flipped);
  }

  set image(val) {
    let flipped = this.querySelector('flip-element.image').getAttribute('flipped');
    if (flipped === null) {
      flipped = false;
    } else {
      flipped = (flipped === 'true');
    }
    if (flipped) {
      this.querySelector('div[slot="front-content"] img').setAttribute('src', val);
    } else {
      this.querySelector('div[slot="back-content"] img').setAttribute('src', val);
    }
    this.querySelector('flip-element.image').setAttribute('flipped', !flipped);
  }

  connectedCallback() {
    this.innerHTML = `
      <div class="content">
        <flip-element id="title">
          <div slot="front-content">
            <div>
              <div class="kicker">Compare</div>
              <div class="title"></div>
            </div>
          </div>
          <div slot="back-content">
            <div>
              <div class="kicker">Compare</div>
              <div class="title"></div>
            </div>
          </div>
        </flip-element>
        <flip-element class="image">
          <div slot="front-content">
            <img class="movie-poster" src=" " />
          </div>
          <div slot="back-content">
            <img class="movie-poster" src=" " />
          </div>
        </flip-element>
      </div>
    `;
  }
}

window.customElements.define('control-card', ControlCard);
