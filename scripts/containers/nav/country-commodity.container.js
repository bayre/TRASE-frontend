import { connect } from 'preact-redux';
import { toggleDropdown } from 'actions/app.actions';
import { selectContext } from 'actions/flows.actions';
import CountryCommodity from 'react-components/nav/country-commodity.component.js';
import loadTooltips from 'react-components/nav/loadTooltips.js';

const mapStateToProps = (state) => {
  return {
    tooltips: state.app.tooltips,
    currentDropdown: state.app.currentDropdown,
    contexts: state.flows.contexts,
    selectedContextCountry: state.flows.selectedContext.countryName,
    selectedContextCommodity: state.flows.selectedContext.commodityName
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onToggle: (id) => {
      dispatch(toggleDropdown(id));
    },
    onSelected: (contextId) => {
      dispatch(selectContext(parseInt(contextId)));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(loadTooltips(CountryCommodity));