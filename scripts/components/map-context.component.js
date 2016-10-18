export default class {

  onCreated() {
    this.el = document.querySelector('.c-basemap-options');
    this.contextualLayerList = this.el.querySelector('.js-layer-contextual');
    this.switchers  = this.contextualLayerList.querySelectorAll('.c-switcher');

    this.switchers.forEach(switcher => {
      switcher.addEventListener('click', (e) => this._onToggleSwitcher(e));
    });
  }

  selectContextualLayers(layers) {
    if (layers.length) {
      this._setActiveContextualLayers(layers);
    }
  }

  _setActiveContextualLayers(layers) {
    layers.forEach((layerSlug) => {
      this.switchers.forEach((switcher) => {
        if (switcher.getAttribute('data-layer-slug') !== layerSlug) return;
        switcher.closest('.layer-item').classList.add('-selected');
        switcher.classList.add('-enabled');
      });
    });
  }

  _onToggleSwitcher(e) {
    var switcher = e && e.currentTarget;
    if (!switcher) return;

    switcher.closest('.layer-item').classList.toggle('-selected');
    switcher.classList.toggle('-enabled');

    const layers = this._getActivelayers();
    this.callbacks.onContextualLayerSelected(layers);
  }

  _getActivelayers() {
    const activeLayers = [];

    this.switchers.forEach((switcher) => {
      if(!switcher.classList.contains('-enabled')) return;

      const layerSlug = switcher.getAttribute('data-layer-slug');
      activeLayers.push(layerSlug);
    });

    return activeLayers;
  }
}
