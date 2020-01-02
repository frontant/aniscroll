# Animated scrolling

### Install

```bash
> yarn add @frontant/aniscroll
```

### Quick start

Minimal call

```javascript
import AniScroll from "@frontant/aniscroll";

var aniscroll = new AniScroll();
aniscroll.scroll(0, 500); // scroll down 500px
```

Scroll down 300px inside an element with the id `id`. Set the easing function to `easeCubic` from the module **d3-ease**.

```javascript
import * as d3Ease from 'd3-ease';
import AniScroll from '@frontant/aniscroll';

var elem = document.querySelector('#id');
var aniscroll = new AniScroll({
  elem: elem, // apply aniscroll to this element
  easing: d3Ease.easeCubic, // set the easing function
};
aniscroll.scroll(0, 300); // scroll down 300px
```

### Options

```javascript
var aniscroll = new AniScroll(options);
```

**options.elem**  
AniScroll will applied to this element.

Default: `window`

**options.easing**  
Sets the easing function. You can use easing functions offered by the module **d3-ease**.

**options.onAnimationEnd**  
This option defines the callback function invoked after the animation has finished.

**options.onAnimationCanceled**  
This option defines the callback function invoked when the animation was canceled by the **cancel()** function.

**options.autoCancel**  
If is set to `true`, the user will be able to cancel the animation with a click, a touch gesture or with the mouse wheel.

Default: `false`

### Functions

**scroll(x, y)**  
**scroll(x, y, duration)**  
**x** and **y** represent the horizontal and vertical axis. **duration** is the animation speed (the default value is 500ms).

**cancel()**  
Cancels the animation.

**isRunning()**  
This function returns `true` if the animation is running otherwise it returns `false`.
