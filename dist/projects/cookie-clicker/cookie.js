let num = 0;
function cookieClick() {
  const level = Math.min(4, Math.floor(num / 25));
  num += [1, 2, 10, 100, 1000][level];
  document.getElementById('numbers').textContent = num.toLocaleString();
  document.getElementById('upgradeLevel').textContent = `${level + 1} · ${[1,2,10,100,1000][level]} cookies per click`;
  const image = document.querySelector('#cookie img');
  image.src = num >= 1000 ? 'imgs/cracked-cookie-2.png' : num >= 100 ? 'imgs/cracked-cookie.png' : 'imgs/cookie.png';
}
