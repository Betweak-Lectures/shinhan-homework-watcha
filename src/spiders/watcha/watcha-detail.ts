import path from 'path';
import service, { WATCHA_BASE_URL } from './watcha-service';
import { type MovieDetailItem, type MovieArray, type MovieItem } from './watcha';
import MovieFS from './movie-fs';

async function fetchMovieDetail(movie: MovieItem): Promise<MovieDetailItem> {
  const referer = `${WATCHA_BASE_URL}/ko-KR/contents/${movie.code}`;
  const response = await service.get(`/api/contents/${movie.code}`, {
    headers: {
      //   ...DEFAULT_HEADERS,
      Accept: 'application/vnd.frograms+json;version=20',
      Referer: referer,
    },
  });
  return response.data.result;
}

if (import.meta.filename === path.resolve(process.argv[1])) {
  (async () => {
    const movieArray: MovieArray = MovieFS.loadList();
    for (const movie of movieArray) {
      let movieDetail: MovieDetailItem = await fetchMovieDetail(movie);
      movieDetail = {
        ...movie,
        ...movieDetail,
      };
      MovieFS.saveDetail(movieDetail);
      console.log(`${movie.code} 저장 완료`);
    }
  })();
}
