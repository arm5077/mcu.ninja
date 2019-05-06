import Hammer from 'hammerjs';
import images from '../data/images';

export default class CardStack {
  constructor(comparison, card, defenderCard) {
    this.movies = comparison.movies;
    this.pivot = comparison.pivot;
    this.comparison = comparison;
    this.card = card;
    this.defender = defenderCard;
    this.index = 0;

    this.formatCard();
    this.card.style.setProperty('transition', '.25s all');
    this.card.classList.remove('staged');
    this.formatDefender();

    this.Hammertime = new Hammer(card);
    this.Hammertime.on('swipe', (e) => {
      this.advanceCard(e);
    });
  }

  formatDefender() {
    const imageURL = images.find(d => d.title === this.pivot).path;
    if (this.defender.getAttribute('class').indexOf('flipped') !== -1) {
      this.defender.querySelector('.front .title').innerHTML = this.pivot;
      this.defender.querySelector('.front').style.setProperty('background-image', `url('assets/${imageURL}')`);
      this.defender.classList.remove('flipped');
    } else {
      this.defender.querySelector('.back .title').innerHTML = this.pivot;
      this.defender.querySelector('.back').style.setProperty('background-image', `url('assets/${imageURL}')`);
      this.defender.classList.add('flipped');
    }
  }

  formatCard() {
    const imageURL = images.find(d => d.title === this.movies[this.index]).path;
    this.card.querySelector('.title').innerHTML = this.movies[this.index];
    this.card.style.setProperty('background-image', `url('assets/${imageURL}')`);
  }

  get movie() {
    return this.movies[this.index];
  }

  advanceCard(e) {
    const { card } = this;
    card.style.setProperty('transition', '.25s all');
    card.parentNode.classList.remove('red', 'green');
    if (e.direction === 2) {
      this.comparison.reject(this.movie);
      card.parentNode.classList.add('red');
      card.classList.add('offscreen-left');
    } else {
      this.comparison.approve(this.movie);
      card.parentNode.classList.add('green');
      card.classList.add('offscreen-right');
    }

    setTimeout(() => {
      card.style.setProperty('transition', null);
      card.classList.remove('offscreen-left', 'offscreen-right');
      card.classList.add('staged');

      this.index += 1;
      console.log(this.index);
      if (this.index > this.movies.length - 1) {
        this.Hammertime.off('swipe');
        card.dispatchEvent(new Event('finished'));
        return;
      }
      this.formatCard();

      setTimeout(() => {
        card.style.setProperty('transition', '.25s all');
        card.classList.remove('staged');
      }, 10);
    }, 500);
  }
}
