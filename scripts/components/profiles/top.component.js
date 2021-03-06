
import _ from 'lodash';
import formatValue from 'utils/formatValue';

import TopTemplate from 'ejs!templates/profiles/top.ejs';

import 'styles/components/profiles/top.scss';

export default class {

  constructor(settings) {
    this.el = settings.el;
    this.data = settings.data;
    this.title = settings.title;
    this.targetLink = settings.targetLink;
    this.unit = settings.unit;

    this._parseData();
    this._render();
  }

  _parseData() {
    const baseUrlLink = this.targetLink ?
      `/profile-${this.targetLink}.html?nodeId=` : null;

    this.data.forEach(d => {
      // this verification shouldn't exist. All list must have same data format.
      // Though this is a temporal patch.
      d.value = _.isArray(d.values) ? formatValue(d.values[0] * 100, 'percentage') : formatValue(d.value * 100, 'percentage');
      d.link = baseUrlLink && !d.is_domestic_consumption ? `${baseUrlLink}${d.id}` : null;
    });
  }

  _render() {
    this.el.innerHTML = TopTemplate({
      list: this.data,
      title: this.title,
      unit: this.unit
    });
  }
}
