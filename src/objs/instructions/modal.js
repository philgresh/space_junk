require('./modal.scss');

export const closeModal = (modal, gameControls, stations) => {
  modal.classList.add('hidden');
  gameControls.classList.remove('hidden');
  Array.from(stations).forEach((station) => station.classList.remove('hidden'));
};

export const openModal = (modal, gameControls) => {
  modal.classList.remove('hidden');
  gameControls.classList.add('hidden');
};

const hideOtherPages = (totalPages, newPage) => {
  for (let i = 1; i < totalPages + 1; i += 1) {
    if (i !== newPage)
      document
        .querySelector(`[data-story-page="${i}"]`)
        .classList.add('hidden');
  }

  document
    .querySelector(`[data-story-page="${newPage}"]`)
    .classList.remove('hidden');
};

const storyInitialState = (story, actions) => {
  const totalPages = Number.parseInt(story.dataset.totalPages, 10);

  hideOtherPages(totalPages, 1);
  const next = actions.getElementsByClassName('next')[0];
  // const prev = actions.getElementsByClassName('previous')[0];
  const play = actions.getElementsByClassName('play')[0];

  next.classList.remove('hidden');
  next.disabled = false;
  play.classList.add('hidden');
};

const nextPage = (next, play, story) => {
  const currPage = Number.parseInt(story.dataset.currentPage, 10);
  const totalPages = Number.parseInt(story.dataset.totalPages, 10);
  const newPage = 1 + currPage;
  if (currPage < totalPages) {
    hideOtherPages(totalPages, newPage);
    story.dataset.currentPage = newPage;
  }

  if (story.dataset.currentPage === story.dataset.totalPages) {
    next.disabled = true;
    next.classList.add('hidden');
    play.classList.remove('hidden');
  } else {
    next.disabled = false;
  }
};
const prevPage = (prev, story) => {
  const currPage = Number.parseInt(story.dataset.currentPage, 10);
  const newPage = currPage - 1;
  if (currPage > 1) {
    hideOtherPages(story.dataset.totalPages, newPage);
    story.dataset.currentPage = newPage;
    prev.disabled = false;
  } else {
    prev.disabled = true;
  }
};

export const setUpNextPreviousButtons = (actions, story, closeM) => {
  const next = actions.getElementsByClassName('next')[0];
  // const prev = actions.getElementsByClassName('previous')[0];
  const play = actions.getElementsByClassName('play')[0];

  next.addEventListener('click', () => nextPage(next, play, story));
  // prev.addEventListener('click', () => prevPage(prev, story));
  play.addEventListener('click', closeM);
};

export const setupModalListeners = () => {
  const modal = document.getElementById('modal');
  const modalBackground = modal.children[0];
  const modalChild = modalBackground.children[0];
  const container = modalChild.getElementsByClassName('container')[0];
  const closeButton = modalChild.getElementsByClassName('close')[0];
  const instructionsButton = document.getElementById('instructions');
  const gameControls = document.getElementById('game-controls');
  const stations = document.getElementsByClassName('station');
  const actions = container.getElementsByClassName('actions')[0];
  const story = container.getElementsByClassName('story')[0];

  modalChild.addEventListener('click', (e) => e.stopPropagation());

  const closeM = () => closeModal(modal, gameControls, stations);

  modalBackground.addEventListener('click', closeM);
  closeButton.addEventListener('click', closeM);
  instructionsButton.addEventListener('click', () => {
    story.dataset.currentPage = 1;
    hideOtherPages(story.dataset.totalPages, 1);
    storyInitialState(story, actions);
    openModal(modal, gameControls);
  });
  setUpNextPreviousButtons(actions, story, closeM);
};
