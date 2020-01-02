const defaultOptions = {
  elem: window,
  easing: t => t, // linear timing function
  onAnimationEnd: undefined,
  onAnimationCanceled: undefined,
  autoCancel: false, // cancel animation on pointer or wheel events
};

class AniScroll {
  constructor(opt) {
    const options = { ...defaultOptions, ...opt };

    this.elem = options.elem;
    this.easing = options.easing;
    this.onAnimationEndCb = options.onAnimationEnd;
    this.onAnimationCanceledCb = options.onAnimationCanceled;
    this.autoCancelOn = options.autoCancel;

    this.startScrollTop = undefined;
    this.startScrollLeft = undefined;
    this.startTime = undefined;

    this.cancelObject = null;
    this.isDestroyed = false;
  }

  scroll = (scrollLeft = null, scrollTop = null, duration = 500) => {
    if (this.isDestroyed) return;

    this.cancel();

    if ((scrollLeft === scrollTop) === null || duration <= 0) return;

    this.autoCancelOn && this._eventsOn();

    this.startScrollTop =
      this.elem === window ? window.pageYOffset : this.elem.scrollTop;
    this.startScrollLeft =
      this.elem === window ? window.pageXOffset : this.elem.scrollLeft;

    this.startTime = this._now();

    if ('requestAnimationFrame' in window === false) {
      scrollTop !== null && (this.elem.scrollTop = scrollTop);
      scrollLeft !== null && (this.elem.scrollLeft = scrollLeft);
      this._onAnimationEnd();

      return;
    }

    this._aniscroll(scrollLeft, scrollTop, duration);
  };

  cancel = () => {
    if (this.cancelObject) {
      this.cancelObject.canceled = true;
    }
  };

  isRunning = () => {
    return this.cancelObject !== null;
  };

  destroy = () => {
    this.cancel();
    this.isDestroyed = true;
    this.autoCancelOn && this._eventsOff();
  };

  _eventsOn = () => {
    if (!this.elem) return;

    ['mousedown', 'touchstart', 'wheel'].forEach(eventName => {
      this.elem.addEventListener(eventName, this._onCancelEvent);
    });
  };

  _eventsOff = () => {
    if (!this.elem) return;

    ['mousedown', 'touchstart', 'wheel'].forEach(eventName => {
      this.elem.removeEventListener(eventName, this._onCancelEvent);
    });
  };

  _onCancelEvent = () => {
    this._eventsOff();
    this.cancel();
  };

  _now = () => {
    return 'now' in window.performance
      ? window.performance.now()
      : new Date().getTime();
  };

  _aniscroll = (inScrollLeft = null, inScrollTop = null, inDuration) => {
    const now = this._now();
    const time = Math.min(1, (now - this.startTime) / inDuration);
    const easingTime = this.easing(time);

    let currentScrollLeft = this.startScrollLeft;
    if (inScrollLeft !== null) {
      currentScrollLeft = Math.ceil(
        easingTime * (inScrollLeft - this.startScrollLeft) +
          this.startScrollLeft
      );
    }

    let currentScrollTop = this.startScrollTop;
    if (inScrollTop !== null) {
      currentScrollTop = Math.ceil(
        easingTime * (inScrollTop - this.startScrollTop) + this.startScrollTop
      );
    }

    if (this.elem === window) {
      window.scroll(currentScrollLeft, currentScrollTop);
    } else {
      this.elem.scrollTop = currentScrollTop;
      this.elem.scrollLeft = currentScrollLeft;
    }

    if (
      ((inScrollTop === null || this.elem.scrollTop === inScrollTop) &&
        (inScrollLeft === null || this.elem.scrollLeft === inScrollLeft)) ||
      easingTime === 1
    ) {
      this._onAnimationEnd();
      return;
    }

    const cancelObject = { canceled: false };
    this.cancelObject = cancelObject;

    window.requestAnimationFrame(() => {
      if (!cancelObject.canceled) {
        this._aniscroll(inScrollLeft, inScrollTop, inDuration);
      } else {
        this._onAnimationCanceled();
      }
    });
  };

  _onAnimationEnd = () => {
    this.cancelObject = null;
    this.autoCancelOn && this._eventsOff();
    this.onAnimationEndCb && this.onAnimationEndCb();
  };

  _onAnimationCanceled = () => {
    this.cancelObject = null;
    this.onAnimationCanceledCb && this.onAnimationCanceledCb();
  };
}

export default AniScroll;
