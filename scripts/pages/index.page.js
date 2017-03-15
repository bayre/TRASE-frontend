import Nav from 'components/nav.component.js';
import Dropdown from 'scripts/components/dropdown.component';
import PostGridTemplate from 'ejs!templates/homepage/post-grid.ejs';
import 'styles/homepage.scss';

import { HOMEPAGE_COMMODITY_WHITELIST, HOMEPAGE_COUNTRY_WHITELIST }  from 'constants';

const defaults = {
  commodity: 'Soy',
  country: 'Brazil',
  postsPerColumn: 4
};

const _setMap = () => {
  const imagesItem = Array.prototype.slice.call(document.querySelectorAll('.map-gallery-item'), 0);
  const commodity = defaults.commodity.toLowerCase();
  const country = defaults.country.toLowerCase();
  const imageName = `${commodity}-${country}`;

  imagesItem.forEach((imageItem) => {
    imageItem.classList.toggle('is-hidden', imageItem.getAttribute('data-image-name') !== imageName);
  });
};

const _onSelectCommodity = function (value) {
  // updates dropdown's title with new value
  this.setTitle(value);
  // updates default values with incoming ones
  defaults[this.id] = value;

  // filters country options based on the commodity selected
  _filterCountries(value);
  _setButton();
};

const _filterCountries = function () {
  const countryDropdownView = defaults.countryDropdown;
  const countryDropdownElem = countryDropdownView.el;
  const dropdownItems = Array.prototype.slice.call(countryDropdownElem.querySelectorAll('.js-dropdown-item'), 0);
  const commodity = defaults.commodity.toLowerCase();

  // checks if the commodity belongs to the country
  dropdownItems.forEach((dropdownItem) => {
    let commodities = dropdownItem.getAttribute('data-commodity');
    commodities = commodities.split(',');

    dropdownItem.classList.toggle('is-hidden', !commodities.includes(commodity));
  });


  const availableItems = countryDropdownElem.querySelectorAll('.js-dropdown-item:not(.is-hidden)');

  // sets first item in the list if there's one available
  if (availableItems.length) {
    const value = availableItems[0].getAttribute('data-value');
    countryDropdownView.setTitle(value);
    _onSelectCountry.call(countryDropdownView, { value });
  } else {
    countryDropdownView.setTitle('-');
  }
};


const _setButton = () => {
  const findOutButton = document.querySelector('.js-find-out');

  const isValid = (HOMEPAGE_COMMODITY_WHITELIST.indexOf(defaults.commodity.toUpperCase()) !== -1) &&
  (HOMEPAGE_COUNTRY_WHITELIST.indexOf(defaults.country.toUpperCase()) !== -1);

  if (isValid) {
    findOutButton.innerHTML = 'FIND OUT HERE';
  } else {
    findOutButton.innerHTML = 'COMING SOON';
  }

  findOutButton.classList.toggle('-disabled', !isValid);
};

const _onSelectCountry = function (data) {
  // updates dropdown's title with new value
  this.setTitle(data.value);
  // updates default values with incoming ones
  defaults[this.id] = data.value;

  // change map image based on new values
  _setMap();
  _setButton();
};

const _getPosts = () => {
  const postList = document.querySelector('.js-posts-grid');

  fetch(API_CMS_URL + '/posts')
    .then(response => response.json())
    .then((data) => {
      let posts = data;
      const totalPosts = posts.length;
      let postsPerColumn = defaults.postsPerColumn;
      let isLeft = true;
      let rows;

      if (!totalPosts) {
        return;
      }

      const highlightPosts = posts.filter((post) => post.highlighted);

      // remove highlighted and graph posts from post array.
      highlightPosts.forEach((post) => {
        const index = posts.indexOf(post);
        posts.splice(index, 1);
      });

      // sorts posts by date
      posts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));

      rows = ((totalPosts - (highlightPosts.length * 5)) / 8 ) + highlightPosts.length;

      if (rows > Math.trunc(rows)) {
        rows = Math.trunc(rows) + 1;
      }

      for (let i = 0; i < rows; i++) {
        const highlightPost = highlightPosts[i];
        let leftSidePosts = [];
        let rightSidePosts = [];

        // left side
        // left side is only filled with posts if there's no highlighted post
        if (highlightPost === undefined) {

          leftSidePosts = posts.splice(0, postsPerColumn);

          // if the number of posts is lower than the minimum (postsPerColumn)
          // fills the rest of gaps with empty objects
          if (leftSidePosts.length !== postsPerColumn) {

            for (let i = leftSidePosts.length; i < postsPerColumn; i++) {
              leftSidePosts.push({});
            }
          }
        }

        // right side
        rightSidePosts = posts.splice(0, postsPerColumn);

        if (rightSidePosts.length !== postsPerColumn) {
          for (let i = rightSidePosts.length; i < postsPerColumn; i++) {
            rightSidePosts.push({});
          }
        }

        // alternates the position of the highlighted post in every row
        if (highlightPost !== undefined) {
          highlightPost.isLeft = isLeft;
          isLeft = !isLeft;
        }

        const postsPerRow = PostGridTemplate({
          highlightPost,
          posts: {
            left: leftSidePosts,
            right: rightSidePosts,
          }
        });

        postList.insertAdjacentHTML('beforeEnd', postsPerRow);
      }
    });
};

const _init = () => {

  const commodityDropdown = new Dropdown('commodity', _onSelectCommodity);
  const countryDropdown = new Dropdown('country', _onSelectCountry);

  Object.assign(defaults, {
    commodityDropdown,
    countryDropdown
  });

  commodityDropdown.setTitle(defaults.commodity);
  countryDropdown.setTitle(defaults.country);

  // set initial dropdown values
  _onSelectCommodity.call(commodityDropdown, defaults.commodity);
  _onSelectCountry.call(countryDropdown, { value: defaults.country });

  _setMap();
  _getPosts();

  const nav = new Nav();
  nav.onCreated();
};

_init();
