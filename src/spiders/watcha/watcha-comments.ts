import path from 'path';
import service from './watcha-service';
import { MovieArray } from './watcha';
import MovieFS from './movie-fs';

//pedia.watcha.com/
const MAX_COMMENT_SIZE = 30;

async function fetchWatchaMovieComment(movie: any, page: number, size = MAX_COMMENT_SIZE): Promise<MovieArray> {
  try {
    const response = await service.get(`api/contents/${movie.code}/comments`, {
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

const MAX_COMMENT_NUM = 30;
async function fetchWatchaCommentListing(movieNum: number): Promise<MovieArray> {
  const pageMax = Math.ceil(movieNum / MAX_COMMENT_NUM);
  const result: MovieArray = [];
  let curPage = 1;

  while (curPage <= pageMax) {
    console.log(`${curPage}페이지 시도`);
    const data = await fetchWatchaMovieComment(curPage, MAX_COMMENT_SIZE);
    console.log(data);
    process.exit();
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
const DEFAULT_COMMENT_NUM = 50;

if (import.meta.filename === path.resolve(process.argv[1])) {
  (async () => {
    const maxNum = process.argv[2] ? parseInt(process.argv[2]) : DEFAULT_COMMENT_NUM;
    const movieArray: MovieArray = MovieFS.loadList();
    for (const movie of movieArray) {
      const movieCommentArray: any[] = await fetchWatchaCommentListing(maxNum);

      MovieFS.saveComments(movie.code, movieCommentArray);
      console.log(`${movie.code}-comments  저장 완료`);
    }
  })();
}
