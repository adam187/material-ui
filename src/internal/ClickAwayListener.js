import {Component} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import events from '../utils/events';

const isDescendant = (el, target) => {
  if (target !== null) {
    return el === target || isDescendant(el, target.parentNode);
  }
  return false;
};

class ClickAwayListener extends Component {
  static propTypes = {
    children: PropTypes.element,
    onClickAway: PropTypes.func,
  };

  componentDidMount() {
    this.isCurrentlyMounted = true;
    events.on(document, 'mouseup', this.handleMouseUp);
    events.on(document, 'touchstart', this.handleTouchStart);
    events.on(document, 'touchmove', this.handleTouchMove);
    events.on(document, 'touchend', this.handleTouchEnd);
  }

  componentWillUnmount() {
    this.isCurrentlyMounted = false;
    events.off(document, 'mouseup', this.handleMouseUp);
    events.off(document, 'touchstart', this.handleTouchStart);
    events.off(document, 'touchmove', this.handleTouchMove);
    events.off(document, 'touchend', this.handleTouchEnd);
  }

  handleMouseUp = (event) => {
    this.handleClickAway(event);
  }

  handleTouchStart = () => {
    this.touchMoved = false;
  }

  handleTouchMove = () => {
    this.touchMoved = true;
  }

  handleTouchEnd = (event) => {
    if (this.touchMoved) {
      return;
    }

    this.handleClickAway(event);
  }

  handleClickAway = (event) => {
    if (event.defaultPrevented) {
      return;
    }

    // IE11 support, which trigger the handleClickAway even after the unbind
    if (this.isCurrentlyMounted) {
      const el = ReactDOM.findDOMNode(this);

      if (document.documentElement.contains(event.target) && !isDescendant(el, event.target)) {
        this.props.onClickAway(event);
      }
    }
  };

  render() {
    return this.props.children;
  }
}

export default ClickAwayListener;
