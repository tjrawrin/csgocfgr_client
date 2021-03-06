import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('crosshair-options', 'Integration | Component | crosshair options', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{crosshair-options}}`);

  assert.equal(this.$('button.Category-title').text().trim(), 'Crosshair');
});
