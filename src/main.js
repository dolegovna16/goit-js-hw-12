import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
  getFirstCardHeight,
} from './js/render-functions';

const form = document.querySelector('.form');
const loadMoreBtn = document.querySelector('#load-more');

let query = '';
let page = 1;
const PER_PAGE = 15;
let totalHits = 0;

form.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(ev) {
  ev.preventDefault();
  const textValue = ev.target.elements['search-text'].value.trim();

  if (!textValue) {
    iziToast.error({ title: 'Please write a word!', position: 'topRight' });
    return;
  }

  // скидаємо стан для нового пошуку
  query = textValue;
  page = 1;
  totalHits = 0;
  clearGallery();
  hideLoadMoreButton();

  try {
    showLoader();

    const data = await getImagesByQuery(query, page);

    if (!data.hits || data.hits.length === 0) {
      iziToast.error({
        title: `Sorry, there are no images matching your search "${query}". Please try again!`,
        position: 'topRight',
      });
      return;
    }

    totalHits = data.totalHits ?? data.hits.length;
    createGallery(data.hits);

    if (page * PER_PAGE < totalHits) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }
  } catch (error) {
    iziToast.error({ title: 'Error', message: error.message, position: 'topRight' });
  } finally {
    hideLoader();
    form.reset();
  }
}

async function onLoadMore() {
  try {
    page += 1;
    showLoader();

    const data = await getImagesByQuery(query, page);

    if (!data.hits || data.hits.length === 0) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
      return;
    }

    const cardHeight = getFirstCardHeight();
    createGallery(data.hits);

    if (page * PER_PAGE >= totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }

    if (cardHeight) {
      window.scrollBy({ top: cardHeight * 2, behavior: 'smooth' });
    }
  } catch (error) {
    iziToast.error({ title: 'Error', message: error.message, position: 'topRight' });
  } finally {
    hideLoader();
  }
}