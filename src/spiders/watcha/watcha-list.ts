import path from 'path';
import service from './watcha-service';
import { MovieArray } from './watcha';
import MovieFS from './movie-fs';

const WATCHA_POPULAR = 'api/staffmades/278/contents';

const MAX_MOVIE_SIZE = 30;

async function fetchWatchaMovieListingPage(page: number, size: number = MAX_MOVIE_SIZE): Promise<MovieArray> {
  try {
    const response = await service.get(WATCHA_POPULAR, {
      params: {
        page: page,
        size: size,
      },
    });
    const data = response.data;
    return data.result.result;
  } catch {
    return [];
  }
}
async function delay(ms: number): Promise<NodeJS.Timeout> {
  return await setTimeout(() => {}, ms);
}

async function fetchWatchaMovieListing(movieNum: number): Promise<MovieArray> {
  const pageMax = Math.ceil(movieNum / MAX_MOVIE_SIZE);
  const result: MovieArray = [];
  let curPage = 1;

  while (curPage <= pageMax) {
    console.log(`${curPage}페이지 시도`);
    const data = await fetchWatchaMovieListingPage(curPage, MAX_MOVIE_SIZE);
    if (data.length === 0) {
      await delay(3000);
      continue;
    }
    console.log(`성공`);
    result.push(...data);
    curPage++;
  }
  return result;
}
const DEFAULT_MOVIENUM = 50;

if (import.meta.filename === path.resolve(process.argv[1])) {
  const maxNum = process.argv[2] ? parseInt(process.argv[2]) : DEFAULT_MOVIENUM;

  fetchWatchaMovieListing(maxNum).then((result) => {
    MovieFS.saveList(result);
  });
}
