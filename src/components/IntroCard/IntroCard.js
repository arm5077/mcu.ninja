import './IntroCard.scss';
import '../TapCard/TapCard';

class IntroCard extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <tap-card>
        <div class="content" slot="content">
          <div class="card show">
            <div class="title">
              Rank the Marvel Cinematic Universe
            </div>
            <p>Wouldn't you love to know the order of your favorite Marvel movies but <em>not</em> have to drag a bunch of titles around?</p>
            <button>Start</button>
          </div>
          <div class="card">
            <div class="notation">
              Your job:<br />Compare this movie...
              <div class="emoji">👇</div>
            </div>
            <img src="./assets/sample-screen.png" />
            <div class="notation">
              <div class="emoji">☝️</div>
              ...to <br />this one
            </div>
            <div class="tap-to-continue">
              Tap to continue
            </div>
          </div>
    
          <div class="card">
            <div class="notation">
              Swipe right if you think the bottom movie is better...
              <div class="emoji">👉</div>
            </div>
            <video muted autoplay loop playsinline src="./assets/sample-screen-animated.mp4"></video>
            <div class="notation">
              <div class="emoji">👈</div>
              ...or left if you<br />think it's worse
            </div>
            <div class="tap-to-continue">
              Tap to continue
            </div>
          </div>
          <div class="card">
            <div class="notation" style="max-width:90%">
              The top bar shows your progress to a full list
              <div class="emoji">👇</div>
            </div>
            <img src="./assets/sample-screen.png" />
            <div class="notation" style="max-width:90%">
              <div class="emoji">☝️</div>
                The bottom bar shows the movies left in this set
            </div>
            <div class="tap-to-continue">
              Tap to continue
            </div>
          </div>
          <div class="card">
            <div class="notation" style="margin-bottom: 22px">Ready to start?</div>
            <button>Begin</button>
          </div>
        </div>
      </tap-card>
    `;
  }
}

window.customElements.define('intro-card', IntroCard);
