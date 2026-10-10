const rates = {
RUB: { rate: 1, locale: 'ru-RU', currency: 'RUB' },
 USD: { rate: 1 / 90, locale: 'en-US', currency: 'USD' },
 IDR: { rate: 170, locale: 'id-ID', currency: 'IDR' },
 CNY: { rate: 1 / 12.5, locale: 'zh-CN', currency: 'CNY' },
 XOF: { rate: 1 / 6.8, locale: 'fr-FR', currency: 'XOF' },
 THB: { rate: 1 / 2.5, locale: 'th-TH', currency: 'THB' },
 ZAR: { rate: 1 / 4.8, locale: 'en-ZA', currency: 'ZAR' }
};

const languageCurrency = {
 en: 'USD', ru: 'RUB', id: 'IDR', zh: 'CNY', fr: 'XOF', th: 'THB',
 ar: 'XOF', sw: 'XOF', ig: 'XOF', zu: 'ZAR'
};

function formatPrice(rubles, currencyCode) {
 const config = rates[currencyCode];
 const amount = rubles * config.rate;
 const rounded = currencyCode === 'IDR' ? Math.round(amount / 1000) * 1000 : Math.round(amount);
 return new Intl.NumberFormat(config.locale, {
  style: 'currency',
  currency: config.currency,
  maximumFractionDigits: 0
 }).format(rounded);
}

function updatePrices(currencyCode) {
  document.querySelectorAll('.price').forEach((price) => {
    const min = Number(price.dataset.rubMin);
    const max = price.dataset.rubMax
      ? Number(price.dataset.rubMax)
      : null;

    price.textContent = max !== null
      ? `${formatPrice(min, currencyCode)}
       ${formatPrice(max, currencyCode)}`
      : formatPrice(min, currencyCode);
  });

  localStorage.setItem('merewebCurrency', currencyCode);
}

document.querySelectorAll('.service-card').forEach((card) => {
 card.addEventListener('click', () => card.classList.toggle('is-flipped'));
 card.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
   event.preventDefault();
   card.classList.toggle('is-flipped');
  }
 });
});

const currencySelect = document.getElementById('currency');
const languageSelect = document.getElementById('language');
const savedCurrency = localStorage.getItem('merewebCurrency') || 'RUB';
currencySelect.value = savedCurrency;
updatePrices(savedCurrency);

currencySelect.addEventListener('change', (event) => updatePrices(event.target.value));
languageSelect.addEventListener('change', (event) => {
 const currencyForLanguage = languageCurrency[event.target.value] || 'USD';
 currencySelect.value = currencyForLanguage;
 updatePrices(currencyForLanguage);
 document.documentElement.lang = event.target.value;
 document.documentElement.dir = event.target.value === 'ar' ? 'rtl' : 'ltr';
})