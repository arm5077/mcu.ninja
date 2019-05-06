import css from './FlipElement.scss';

class FlipElement extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['flipped'];
  }

  set flipped(val) {
    if (val) {
      this.shadowRoot.querySelector('.flip-container').classList.add('flipped');
    } else {
      this.shadowRoot.querySelector('.flip-container').classList.remove('flipped');
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'flipped') {
      if (newValue === 'false') {
        this.flipped = false;
      } else {
        this.flipped = true;
      }
    }
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style type="text/css">
        flip-element {
          width: 100%;
          height: 100%;
        }
        
        .flip-container.flipped .flipper {
          transform: rotateY(180deg);
        }
        
        .flip-container {
          width: 100%;
          height: 100%;
        }
  
        .flipper {
          width: 100%;
          height: 100%;
          transition: .25s;
          transform-style: preserve-3d;
          position: relative;
        }
        
        .front, .back {
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-perspective: 0;
          -webkit-backface-visibility: hidden;
          -webkit-transform: translate3d(0,0,0);
          position: absolute; 
          top: 0;
          left: 0;
        }

        .front {
          z-index: 2;
          transform: rotateY(0deg);
        }

        .back {
          transform: rotateY(180deg);
          z-index: 1;
        }
      </style>
      <div class="flip-container">
        <div class="flipper">
          <div class="front">
            <slot name="front-content"></slot>
          </div>
          <div class="back">
            <slot name="back-content"></slot>
          </div>
        </div>
      </div>
    `;
  }
}

window.customElements.define('flip-element', FlipElement);
