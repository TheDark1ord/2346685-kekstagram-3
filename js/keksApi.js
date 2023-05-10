export const FETCH_DATA_URL = 'https://27.javascript.pages.academy/kekstagram-simple/data';
export const SEND_DATA_URL = 'https://27.javascript.pages.academy/kekstagram-simple';

export function handleFetch(url, method, body=null) {
  fetch(url, {method, body})
    .then((response) => {
      if (!response.ok) {
        throw new Error(`${response.status} -- ${response.statusText}`);
      }
      return response.json();
    })
    .catch(() => {
      throw new Error('Failed to fetch data');
    });
}
