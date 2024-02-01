import MovieFS from './movie-fs';
import fs from 'fs';

const movieArray = MovieFS.loadAll();

function createMongooseModel(data: any): any {
  if (Array.isArray(data)) {
    const schema = createMongooseModel(data[0]);
    if (schema === null) {
      return null;
    }
    return `[${schema}]`;
  } else if (data === null || data === undefined) {
    return null;
  } else if (typeof data === 'object' && !Array.isArray(data)) {
    let template = '{';
    for (const k in data) {
      const t = createMongooseModel(data[k]);
      if (t === null) {
        continue;
      }

      template = `${template} ${k}: ${t}, `;
    }
    template = `${template} }`;
    return template;
  } else {
    return Object.getPrototypeOf(data).constructor.name;
  }
}
const movieTemplate = createMongooseModel(movieArray[0]);

fs.writeFileSync('movieTemplate.txt', movieTemplate);
// console.log(movieTemplate);
