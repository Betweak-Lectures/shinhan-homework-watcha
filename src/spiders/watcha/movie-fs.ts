import fs from 'fs';
import path from 'path';
import { MovieArray, MovieDetailItem } from './watcha';
export const RESULT_DIRNAME = 'data/movies';

const MovieFS = {
  saveList: function (movieArray: MovieArray) {
    if (!fs.existsSync(RESULT_DIRNAME)) {
      fs.mkdirSync(RESULT_DIRNAME, { recursive: true });
    }

    fs.writeFileSync(path.join(RESULT_DIRNAME, 'movie-list.json'), JSON.stringify(movieArray, undefined, 2));
  },
  loadList: function (): MovieArray {
    return JSON.parse(fs.readFileSync(path.join(RESULT_DIRNAME, 'movie-list.json'), 'utf-8'));
  },
  saveDetail: function (movie: MovieDetailItem): void {
    const dirname = path.join(RESULT_DIRNAME, 'movies');
    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true });
    }
    const filename = path.join(dirname, `${movie?.code}.json`);

    return fs.writeFileSync(filename, JSON.stringify(movie, undefined, 2));
  },
  loadDetail: function (movieCode: string): MovieDetailItem {
    const filename = path.join(RESULT_DIRNAME, 'movies', `${movieCode}.json`);
    return JSON.parse(fs.readFileSync(filename, 'utf-8'));
  },

  loadMovies: function () {
    const movieArray = this.loadList();
    for (const idx in movieArray) {
      const detail = this.loadDetail(movieArray[idx].code);
      movieArray[idx] = {
        ...movieArray[idx],
        ...detail,
      };
    }
    return movieArray;
  },
  saveComments: function (movieCode: string, comments: Array<any>) {
    const dirname = path.join(RESULT_DIRNAME, 'comments');
    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true });
    }
    const filename = path.join(dirname, `${movieCode}.json`);
    return fs.writeFileSync(filename, JSON.stringify(comments, undefined, 2));
  },
  loadComment: function (movieCode: string) {
    const filename = path.join(RESULT_DIRNAME, 'comments', `${movieCode}.json`);
    return JSON.parse(fs.readFileSync(filename, 'utf-8'));
  },
  loadAll: function (): any {
    const movies = this.loadMovies();
    return movies.map((movie) => {
      return {
        ...movie,
        comments: this.loadComment(movie.code),
      };
    });
  },
};

export default MovieFS;
