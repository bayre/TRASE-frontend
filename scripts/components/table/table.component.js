import TableTemplate from 'ejs!templates/table/table.ejs';
// import TableTopTemplate from 'ejs!templates/table/tableTop.ejs';
import 'whatwg-fetch';

import 'styles/components/factsheets/area-table.scss';

export default class {
  constructor(value) {
    this.data = null;
    this.getData()
      .then(response => response.json())
      .then((json) => {
        this.data = json;
        this.render(value);
      });
  }

  getData() {
    return fetch('factsheets/table.json');
  }

  render() {
    var areamunicipalities = document.querySelector('.js-municipalities-table');
    const template = TableTemplate({actors: this.data});
    areamunicipalities.innerHTML = template;
  }
}
