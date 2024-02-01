import axios from 'axios';

export const WATCHA_BASE_URL = 'https://pedia.watcha.com';

export default axios.create({
  baseURL: WATCHA_BASE_URL,
  timeout: 3000,
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'X-Frograms-Version': '2.1.0',
    'X-Frograms-App-Code': 'Galaxy',
    'X-Frograms-Client': 'Galaxy-Web-App',
    'X-Frograms-Client-Version': '2.1.0',
  },
});
