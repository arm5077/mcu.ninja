import './TapCard.scss';

class TapCard extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    this.index = 0;
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `    
      <style type="text/css">
        .content {
          width: 100%;
          height: 100%;
        }
        
      </style>
      </style>
      <div class="content">
        <slot name="content"></slot>
      </div>
    `;
    const cards = this.querySelectorAll('.card');
    cards.forEach((card) => {
      card.addEventListener('click', () => {
        this.index += 1;
        if (this.index >= cards.length) {
          console.log('bloop');
          this.classList.add('hide');
        }
        cards.forEach((otherCard, i) => {
          if (i === this.index) {
            otherCard.classList.add('show');
          } else {
            otherCard.classList.remove('show');
          }
        });
        console.log('clickered!');
      });
    });
  }
}

window.customElements.define('tap-card', TapCard);
