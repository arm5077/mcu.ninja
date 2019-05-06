import MovieList from '../../utils/MovieList';
import './AppCard.scss';
import '../ResultCue/ResultCue';
import '../MovieCard/MovieCard';
import '../ControlCard/ControlCard';
import '../ProgressIndicator/ProgressIndicator';
import '../IntroCard/IntroCard';
import UndoIcon from '../../assets/undo-alt-solid.svg';
import movies from '../../data/movies';

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

class AppCard extends HTMLElement {
  constructor() {
    super();
    this.MovieList = new MovieList(movies);
    this.history = [];
  }

  connectedCallback() {
    this.innerHTML = `
      <intro-card></intro-card>
      <flip-element>
        <div slot="front-content">    
          <div class="content">
            <div class="progress"></div>
            <div class="top">
              <control-card></control-card>
            </div>
            <div class="bottom">
              <movie-card></movie-card>
              <result-cue></result-cue>
              <div class="footer">
                <progress-indicator total=0 completed=0></progress-indicator>
                <img src="${UndoIcon}" id="undo" />
              </div>
            </div>
          </div>
        </div>
        <div slot="back-content" id="results">
          <div class="result-title-wrapper">
            <div class="result-title">Assemble!</div>
          </div>
          <ol></ol>
          <a class="button" target="blank" href="#" id="twitter" style="margin-bottom: 10px">Tweet your list</a>
          <a class="button" href="#" id="sms">Text to a friend</a>
        </div>
      </flip-element>
    `;

    // Set up undo
    this.querySelector('#undo').addEventListener('click', () => {
      const historyObj = this.history.pop();
      this.comparison.pivot = historyObj.comparison.pivot;
      this.comparison.approvees = historyObj.comparison.approvees;
      this.comparison.rejectees = historyObj.comparison.rejectees;
      this.comparison.movies = historyObj.comparison.movies;
      this.comparison.start = historyObj.comparison.start;
      this.MovieList.MovieBlobs = historyObj.MovieBlobs;
      const movie = this.comparison.getMovie();
      this.makeControlCard();
      this.makeMovieCard(movie);
    });

    this.movieCard = this.querySelector('movie-card');
    this.movieCard.addEventListener('decision', (e) => {
      // Add current state to history first
      this.history.push({
        comparison: clone(this.comparison),
        MovieBlobs: clone(this.MovieList.MovieBlobs),
      });
      if (this.movieCard.decision === 'approve') {
        this.comparison.approve(this.movieCard.movie);
      } else {
        this.comparison.reject(this.movieCard.movie);
      }
      const movie = this.comparison.getMovie();
      if (!movie) {
        this.MovieList.finishComparison();
        this.makeNewComparison();
        this.querySelector('control-card').progress = 0;
      } else {
        this.makeMovieCard(movie);
      }
    });
    this.makeNewComparison();
  }

  makeNewComparison() {
    // Check to make sure we're not done
    if (this.MovieList.finished) {
      this.showResults();
      return;
    }
    this.comparison = this.MovieList.getComparison('rotten_tomatoes');
    this.movies = this.comparison.movies;
    const movie = this.comparison.getMovie();
    this.makeControlCard();
    this.makeMovieCard(movie);
  }

  showResults() {
    const resultsCard = this.querySelector('#results');
    let resultsText = '';
    this.MovieList.Movies.forEach((movie, i) => {
      const movieItem = document.createElement('li');
      movieItem.innerHTML = movie.title;
      resultsCard.querySelector('ol').appendChild(movieItem);
      resultsText += `${i + 1}. ${movie.title}%0a`;
    });
    this.querySelector('#twitter').setAttribute('href', `https://twitter.com/intent/tweet?text=The best Marvel movies:%0A${resultsText}http://www.mcu.ninja`);
    this.querySelector('#sms').setAttribute('href', `sms:?&body=The best Marvel movies:%0A${resultsText}`);
    this.querySelector('flip-element').setAttribute('flipped', true);
  }

  makeControlCard() {
    // Update progress
    this.updateProgress();
    const progressIndicator = this.querySelector('progress-indicator');
    const totalMovies = this.comparison.movies.length
      + this.comparison.approvees.length
      + this.comparison.rejectees.length;
    progressIndicator.setAttribute('total', totalMovies);
    progressIndicator.setAttribute('completed', 0);
    const controlCard = this.querySelector('control-card');
    controlCard.title = this.comparison.pivot.title;
    controlCard.image = `./assets/${this.comparison.pivot.path}`;
  }

  makeMovieCard(movie) {
    // Update progress
    const moviesRated = this.comparison.approvees.length + this.comparison.rejectees.length;
    this.querySelector('progress-indicator').setAttribute('completed', moviesRated);
    this.movieCard.movie = movie;
    setTimeout(() => {
      const resultCue = this.querySelector('result-cue .message').setAttribute('title', this.movieCard.movie.title);
    }, 250);
  }

  updateProgress() {
    const movieSlotsCompleted = this.MovieList.MovieBlobs.filter(
      MovieBlob => MovieBlob.movies.length === 1,
    ).length;
    const totalMovies = this.MovieList.Movies.length;
    const percentage = `${Math.round(movieSlotsCompleted / totalMovies * 100)}%`;
    this.querySelector('.progress').style.width = percentage;
  }
}

window.customElements.define('app-card', AppCard);
