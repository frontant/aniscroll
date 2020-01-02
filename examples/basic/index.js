import Aniscroll from '@frontant/aniscroll';

window.onload = () => {
  const aniscroll = new Aniscroll({
    autoCancel: true,
  });

  document.querySelector('[data-btn="up"]').addEventListener('click', () => {
    aniscroll.scroll(0, 0, 1000);
  });

  document.querySelector('[data-btn="down"]').addEventListener('click', () => {
    aniscroll.scroll(0, 1200, 1000);
  });
};
