import Ember from 'ember';

export default Ember.Component.extend({
  /**
  * Define a bunch of default properties and values to be used by
  * the component.
  */
  tagName: 'canvas',
  classNames: ['CrosshairPreview-canvas'],
  center: null,
  crosshairLength: null,
  crosshairWidth: null,
  crosshairGap: null,
  ctx: null,
  interactivePreview: false,
  maxAlphaValue: 255,
  attributeBindings: ['width', 'height'],
  /**
  * Detects when the element is inserted into the DOM before executing
  * the methods below.
  */
  didInsertElement: function() {
    this.set('ctx', this.get('element').getContext('2d'));
    this.set('center', {'x': (this.get('width') / 2), 'y': (this.get('height') / 2)});
    this.bindEvents();
    this.clearCanvas();
    this.draw();
  },
  /**
  * Method for drawing the crosshair on the canvas.
  */
  draw: function() {
    this.clearCanvas();
    this.calculateSize();
    var ctx = this.get('ctx');

    ctx.imageSmoothingEnabled = false;
    var crosshairColor = '#' + this.convertToHex(this.get('data.clCrosshaircolorR')) + '' + this.convertToHex(this.get('data.clCrosshaircolorG')) +'' + this.convertToHex(this.get('data.clCrosshaircolorB'));
    ctx.fillStyle = crosshairColor;
    ctx.globalAlpha = this.get('data.clCrosshairalpha') / this.get('maxAlphaValue');

    var translate = 0;
    translate = (this.get('crosshairWidth') % 2) / 2;
    ctx.translate(translate, translate);

    var center = this.get('center');
    var crosshairWidth = this.get('crosshairWidth');
    var crosshairLength = this.get('crosshairLength');
    var crosshairGap = this.get('crosshairGap');
    var outlineThickness = this.get('data.clCrosshairOutlinethickness');
    var strokeTranslate = (crosshairWidth / 2) - (Math.floor(crosshairWidth / 2));

    if (this.get('data.clCrosshairDrawoutline')) {
      ctx.fillStyle = '#000000';
      ctx.lineWidth = this.get('data.clCrosshairOutlinethickness');

      ctx.translate(-translate, -translate);
      ctx.translate(strokeTranslate, strokeTranslate);

      ctx.fillRect((center.x + ((crosshairWidth / 2) + crosshairGap)) - outlineThickness, (center.y - (crosshairWidth / 2)) - outlineThickness, crosshairLength + (outlineThickness * 2), crosshairWidth + (outlineThickness * 2));
      ctx.fillRect((center.x - ((crosshairLength + (crosshairWidth / 2)) + crosshairGap)) - outlineThickness, (center.y - (crosshairWidth / 2)) - outlineThickness, crosshairLength + (outlineThickness * 2), crosshairWidth + (outlineThickness * 2));
      ctx.fillRect((center.x - (crosshairWidth / 2)) - outlineThickness, (center.y - ((crosshairLength + (crosshairWidth / 2) + crosshairGap))) - outlineThickness, crosshairWidth + (outlineThickness * 2), crosshairLength + (outlineThickness * 2));
      ctx.fillRect((center.x - (crosshairWidth / 2)) - outlineThickness, (center.y + ((crosshairWidth / 2) + crosshairGap)) - outlineThickness, crosshairWidth + (outlineThickness * 2), crosshairLength + (outlineThickness * 2));

      ctx.translate(-strokeTranslate, -strokeTranslate);
      ctx.translate(translate, translate);
    }

    ctx.fillStyle = crosshairColor;
    ctx.fillRect(center.x + ((crosshairWidth / 2) + crosshairGap), center.y - (crosshairWidth / 2), crosshairLength, crosshairWidth);
    ctx.fillRect(center.x - ((crosshairLength + (crosshairWidth / 2)) + crosshairGap), center.y - (crosshairWidth / 2), crosshairLength, crosshairWidth);
    ctx.fillRect(center.x - (crosshairWidth / 2), center.y - ((crosshairLength + (crosshairWidth / 2)) + crosshairGap), crosshairWidth, crosshairLength);
    ctx.fillRect(center.x - (crosshairWidth / 2), center.y + ((crosshairWidth / 2) + crosshairGap), crosshairWidth, crosshairLength);

    if (this.get('data.clCrosshairdot')) {
      var width = crosshairWidth; //2;
      var height = crosshairWidth; //2;

      if (this.get('data.clCrosshairDrawoutline')) {
        ctx.fillStyle = '#000000';
        ctx.translate(-translate, -translate);
        ctx.translate(strokeTranslate, strokeTranslate);
        ctx.fillRect( (center.x - (crosshairWidth / 2)) - outlineThickness, (center.y - (crosshairWidth / 2)) - outlineThickness, crosshairWidth + (outlineThickness * 2), crosshairWidth + (outlineThickness * 2));
        ctx.translate(-strokeTranslate, -strokeTranslate);
        ctx.translate(translate, translate);
      }

      ctx.fillStyle = crosshairColor;
      ctx.fillRect(center.x - (width / 2), center.y - (height / 2), width, height);
    }

    ctx.translate(-translate, -translate);

  }.observes('data.clCrosshaircolorR', 'data.clCrosshaircolorG', 'data.clCrosshaircolorB', 'data.clCrosshairalpha', 'data.clCrosshairthickness', 'data.clCrosshairDrawoutline',
             'data.clCrosshairOutlinethickness', 'data.clCrosshairsize', 'data.clCrosshairgap', 'data.clCrosshairdot'),
  /**
  * Converts the RGB number into HEX for setting the crosshair color.
  */
  convertToHex: function(value) {
    return ('0' + parseInt(value).toString(16)).slice(-2);
  },
  /**
  * Detects when the cursor is inside of the canvas and updates the
  * draw location of the crosshair.
  */
  updateCrosshairPosition: function(event) {
    var offset = Ember.$('canvas.crosshair-canvas').offset();
    var x = parseInt(event.pageX - offset.left + 0.5);
    var y = parseInt(event.pageY - offset.top + 0.5);
    this.set('center', {'x': x, 'y': y });
    this.draw();
  },
  /**
  * Method fo calculating the size of the crosshair.
  */
  calculateSize: function() {
    this.set('crosshairLength', parseInt(this.get('data.clCrosshairsize') * 2));
    this.set('crosshairWidth', parseInt(this.get('data.clCrosshairthickness') * 2));
    this.set('crosshairGap', Math.ceil(parseInt(this.get('data.clCrosshairgap')) + 4));

    if(parseInt(this.get('data.clCrosshairsize')) > 2) {
      this.set('crosshairLength', this.get('crosshairLength') + 1);
    }
  },
  /**
  * Method for clearing the canvas drawing. Called when the canvas is inserted into
  * the DOM and when the draw method is called. Ensures only one crosshair is drawn
  * at a time.
  */
  clearCanvas: function() {
    var ctx = this.get('ctx');
    return ctx.clearRect(0, 0, this.get('width'), this.get('height'));
  },
  /**
  * Method of toggling the interactive preview when clicking into the canvas.
  */
  toggleInteractivePreview: function() {
    this.interactivePreview = !this.interactivePreview;
    var $canvas = Ember.$('canvas.crosshair-canvas');
    if (this.get('interactivePreview')) {
      $canvas.on('mousemove', Ember.$.proxy(this.updateCrosshairPosition, this));
      $canvas.css( { 'cursor': 'none' } );
    } else {
      $canvas.off('mousemove');
      $canvas.css( { 'cursor': 'default' } );
    }
  },
  /**
  * Binds events that may happen on the page. Method is executed on didInsertElement.
  */
  bindEvents: function() {
    Ember.$('canvas.crosshair-canvas').on('click', Ember.$.proxy(this.toggleInteractivePreview, this));
  }
});
