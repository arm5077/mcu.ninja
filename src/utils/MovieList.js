module.exports = class MovieList {
  constructor(movies) {
    this.MovieBlobs = [
      {
        start: 0,
        movies,
      },
    ];
    this.approvees = [];
    this.rejectees = [];
  }

  _collapseMovieBlobs() {
    return this.MovieBlobs.reduce(
      (accumulator, MovieBlob) => accumulator.concat(MovieBlob.movies),
      [],
    );
  }

  getComparison(weight) {
    // Pick first MovieBlob among unresolved Blobs
    const unfinishedMovieBlobs = this.MovieBlobs.filter(MovieBlob => MovieBlob.movies.length > 1);
    const MovieBlob = unfinishedMovieBlobs[
      Math.round(Math.random() * (unfinishedMovieBlobs.length - 1))
    ];

    // If we have a weight, let's order by it
    if (weight) {
      MovieBlob.movies.sort((a, b) => b[weight] - a[weight]);
    }
    // Pick a random movie to be the pivot
    const pivot = MovieBlob.movies[Math.round(MovieBlob.movies.length / 2)];

    // Build comparison object
    this.comparison = {
      pivot,
      movies: MovieBlob.movies.filter(movie => movie !== pivot),
      start: MovieBlob.start,
      approvees: [],
      rejectees: [],
      approve: (movie) => {
        this.comparison.movies.pop();
        this.comparison.approvees.push(movie);
      },
      reject: (movie) => {
        this.comparison.movies.pop();
        this.comparison.rejectees.push(movie);
      },
      getMovie: () => this.comparison.movies[this.comparison.movies.length - 1],
    };

    return this.comparison;
  }

  finishComparison() {
    const newMovieBlobs = [];
    console.log(this.comparison);
    if (this.comparison.approvees.length === 0) {
      // If everything is worse than the pivot movie:
      newMovieBlobs.push({
        start: this.comparison.start,
        movies: [this.comparison.pivot],
      });
      newMovieBlobs.push({
        start: this.comparison.start + 1,
        movies: this.comparison.rejectees,
      });
    } else if (this.comparison.rejectees.length === 0) {
      // If everything is better than the pivot movie:
      newMovieBlobs.push({
        start: this.comparison.start,
        movies: this.comparison.approvees,
      });
      newMovieBlobs.push({
        start: this.comparison.start + this.comparison.approvees.length,
        movies: [this.comparison.pivot],
      });
    } else {
      // If some movies are better than pivot, and some are worse
      newMovieBlobs.push({
        start: this.comparison.start,
        movies: this.comparison.approvees,
      });
      newMovieBlobs.push({
        start: this.comparison.start + this.comparison.approvees.length,
        movies: [this.comparison.pivot],
      });
      newMovieBlobs.push({
        start: this.comparison.start + this.comparison.approvees.length + 1,
        movies: this.comparison.rejectees,
      });
    }

    // Remove original MovieBlob
    const origMovieBlob = this.MovieBlobs.find(movie => movie.start === this.comparison.start);
    const index = this.MovieBlobs.indexOf(origMovieBlob);
    this.MovieBlobs.splice(index, 1);

    // Add new collection of movieblobs
    this.MovieBlobs = this.MovieBlobs.concat(newMovieBlobs);
    this.MovieBlobs.sort((a, b) => a.start - b.start);
  }

  get finished() {
    if (this.MovieBlobs.filter(MovieBlob => MovieBlob.movies.length > 1).length === 0) {
      return true;
    }
    return false;
  }

  get Movies() {
    return this._collapseMovieBlobs();
  }
};
