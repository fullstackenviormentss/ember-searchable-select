import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent(
  'searchable-select',
  'Integration | Component | searchable select',
  { integration: true }
);

const TEDevents = Ember.A([
  {
    id: 1,
    title: 'TED2015',
    longTitle: 'TED2015: Truth and Dare',
    year: 2015,
    keywords: '',
    isTEDxEvent: false
  },
  {
    id: 2,
    title: 'TEDxNASA',
    year: 2015,
    keywords: '',
    isTEDxEvent: true
  },
  {
    id: 3,
    title: 'TED2014',
    year: 2014,
    keywords: '',
    isTEDxEvent: false
  },
  {
    id: 4,
    title: 'TEDGlobal 2014',
    year: 2014,
    keywords: '',
    isTEDxEvent: false
  },
  {
    id: 5,
    title: 'TEDxNewYork',
    year: 2014,
    keywords: 'NYC',
    isTEDxEvent: true
  },
  {
    id: 6,
    title: 'TEDGlobal 2013',
    year: 2013,
    keywords: '',
    isTEDxEvent: false
  },
  {
    id: 7,
    title: 'TED2013',
    year: 2013,
    keywords: '',
    isTEDxEvent: false
  }
]);

test('it renders a label with a default prompt', function(assert) {
  assert.expect(2);

  this.render(hbs`{{searchable-select}}`);

  assert.equal(this.$('.Searchable-select__label').length, 1);
  assert.equal(
    this.$('.Searchable-select__label').text().trim(),
    'Select an option');
});

test('can configure the label prompt with custom text', function(assert) {
  assert.expect(1);

  this.render(hbs`{{searchable-select prompt="custom text"}}`);
  assert.equal(
    this.$('.Searchable-select__label').text().trim(),
    'custom text');
});

test(
  'clicking the label opens a search input and list of all options',
  function(assert) {
    assert.expect(7);

    this.set('content', TEDevents);
    this.render(hbs`{{searchable-select content=content}}`);

    let $component = this.$();

    $component.find('.Searchable-select__label').click();
    let $searchInput = $component.find('.Searchable-select__input');
    let $options = $component.find('.Searchable-select__option');
    let $clear = $component.find('.Searchable-select__clear');

    assert.equal($component.find('.Searchable-select__menu').length, 1);
    assert.equal($searchInput.length, 1);
    assert.equal($options.length, 7);

    assert.equal($searchInput.attr('placeholder').trim(), 'Type to search',
      'the search input should have a default prompt message');

    assert.equal($clear.length, 0,
      'there should not be a clear button when nothing is selected yet');

    assert.equal($options.eq(0).text().trim(), 'TED2015',
      'item labels should default to "title" value');

    assert.equal($options.is('.Searchable-select__option--selected'), false,
      'no options should be selected by ault');
  }
);

test('can change the search prompt to a new string', function(assert) {
  assert.expect(1);
  this.set('searchPrompt', 'type to search events');

  this.render(hbs`{{searchable-select searchPrompt=searchPrompt}}`);

  let $component = this.$();
  $component.find('.Searchable-select__label').click();

  assert.equal(
    this.$('.Searchable-select__input').attr('placeholder').trim(),
    'type to search events');
});

test('can specify an alternate path for option label', function(assert) {
  assert.expect(1);
  this.set('content', TEDevents);
  this.set('optionLabelKey', 'longTitle');

  this.render(hbs`{{searchable-select
    content=content
    optionLabelKey=optionLabelKey}}`);

  let $component = this.$();
  $component.find('.Searchable-select__label').click();

  assert.equal(
    $component.find('.Searchable-select__option').eq(0).text().trim(),
    'TED2015: Truth and Dare');
});

test('can pass in an initial selection', function(assert) {
  assert.expect(2);
  this.set('content', TEDevents);
  this.set('selected', TEDevents.findBy('id', 3));

  this.render(hbs`{{searchable-select content=content selected=selected}}`);
  this.$('.Searchable-select__label').click();

  let $selected = this.$('.Searchable-select__option-label--selected');
  assert.equal($selected.text().trim(), 'TED2014');

  assert.equal(this.$('.Searchable-select__clear').length, 1,
    'should see a clear button when there is a selection');
});

test('can sort the options by a provided key', function(assert) {
  assert.expect(3);
  this.set('content', TEDevents);
  this.set('sortBy', 'title');

  this.render(hbs`{{searchable-select content=content sortBy=sortBy}}`);
  this.$('.Searchable-select__label').click();

  let $options = this.$('.Searchable-select__option');

  assert.equal($options.eq(0).text().trim(), 'TED2013');
  assert.equal($options.eq(1).text().trim(), 'TED2014');
  assert.equal($options.eq(2).text().trim(), 'TED2015');
});

test('can sort the options by a multiple provided keys', function(assert) {
  assert.expect(4);
  this.set('content', TEDevents);
  this.set('sortBy', 'year:desc,title');

  this.render(hbs`{{searchable-select content=content sortBy=sortBy}}`);
  this.$('.Searchable-select__label').click();

  let $options = this.$('.Searchable-select__option');
  assert.equal($options.eq(0).text().trim(), 'TED2015');
  assert.equal($options.eq(1).text().trim(), 'TEDxNASA');
  assert.equal($options.eq(2).text().trim(), 'TED2014');
  assert.equal($options.eq(3).text().trim(), 'TEDGlobal 2014');
});

test('can type to refine the list of options', function(assert) {
  assert.expect(3);
  this.set('content', TEDevents);

  this.render(hbs`{{searchable-select content=content}}`);
  this.$('.Searchable-select__label').click();
  this.$('.Searchable-select__input').val('2013').keyup();

  assert.equal(this.$('.Searchable-select__option').length, 2);
  assert.equal(
    this.$('.Searchable-select__matched-text').eq(0).text().trim(),
    '2013',
    'search string is highlighted');

  // if there are no results matching, i see a message
  this.$('.Searchable-select__input').val('zzz').keyup();
  assert.equal(
    this.$('.Searchable-select__info').text().trim(),
    'No matching results');
});

test(
  'can restrict the search to only search on word boundaries',
  function(assert) {
    assert.expect(1);
    this.set('content', TEDevents);

    this.render(hbs`{{searchable-select
      content=content
      limitSearchToWordBoundary=true}}`);
    this.$('.Searchable-select__label').click();
    this.$('.Searchable-select__input').val('2013').keyup();

    assert.equal(this.$('.Searchable-select__option').length, 1);
  }
);

test('selection gets passed out with the on-change action', function(assert) {
  assert.expect(1);
  this.set('content', TEDevents);

  let itemToSelect = TEDevents.findBy('title', 'TEDGlobal 2014');

  this.actions = {
    assertChanged(selection) {
      assert.deepEqual(selection, itemToSelect);
    }
  };

  this.render(hbs`{{searchable-select
    content=content
    on-change=(action "assertChanged")}}`);

  this.$('.Searchable-select__label').click();
  this.$('.Searchable-select__option:contains("TEDGlobal 2014")').click();
});

// TODO: get this test working properly, works in demo app,
// test('filtered list should reset after a selection is made', function(assert) {
//   assert.expect(1);

//   this.set('content', TEDevents);
//   this.actions = {selectionChanged: function(){}};

//   this.render(hbs`{{searchable-select content=content on-change=(action "selectionChanged")}}`);
//   var $component = this.$();

//   this.$('.Searchable-select__label').click();
//   this.$('.Searchable-select__input').val('Global').keyup();
//   this.$('.Searchable-select__option:contains("TEDGlobal 2014")').click();
//   $component.find('.Searchable-select__label').click();
//   assert.equal($component.find('.Searchable-select__option').length, 7);
// });

test('search text gets passed out with the on-search action', function(assert) {
  assert.expect(2);
  this.set('content', TEDevents);

  this.actions = {
    assertSearched(searchText) {
      assert.equal(searchText, 'global');
      assert.equal(
        this.$('.Searchable-select__option').length, 7,
        'filtering should be disabled when an on-search action is used');
    }
  };

  this.render(hbs`{{searchable-select
    content=content
    on-search=(action "assertSearched")}}`);
  this.$('.Searchable-select__label').click();
  this.$('.Searchable-select__input').val('global').keyup();
});

test('can toggle and customize a loading state', function(assert) {
  assert.expect(2);
  this.render(hbs`{{searchable-select
    isLoading=true
    loadingMessage="Loading..."}}`);

  this.$('.Searchable-select__label').click();
  assert.equal(this.$('.Searchable-select__loader').length, 1);
  assert.equal(
    this.$('.Searchable-select__loader-text').text().trim(),
    'Loading...');
});

test('can clear the selection with a clear button', function(assert) {
  assert.expect(1);
  this.set('content', TEDevents);
  this.set('selected', TEDevents.findBy('id', 3));

  this.actions = {
    assertChanged(selection) {
      assert.deepEqual(selection, null);
    }
  };

  this.render(hbs`{{searchable-select
    content=content
    selected=selected
    on-change=(action "assertChanged")}}`);
  this.$('.Searchable-select__label').click();
  this.$('.Searchable-select__clear').click();
});

test('can disable clear functionality', function(assert) {
  assert.expect(1);
  this.set('content', TEDevents);
  this.set('selected', TEDevents.findBy('id', 3));

  this.render(hbs`{{searchable-select
    content=content
    selected=selected
    isClearable=false}}`);
  this.$('.Searchable-select__label').click();

  assert.equal(this.$('.Searchable-select__clear').length, 0);
});

test(
  'can flag items as disabled by providing a boolean key to check against',
  function(assert) {
    assert.expect(1);
    this.set('content', TEDevents);
    this.actions = {
      assertChanged() {
        // this action should not fire
      }
    };

    this.render(hbs`{{searchable-select
      content=content
      optionDisabledKey="isTEDxEvent"
      on-change=(action "assertChanged")}}`);

    this.$('.Searchable-select__label').click();
    let disabledOptions = this.$('.Searchable-select__option--disabled');
    disabledOptions.eq(0).click();

    assert.equal(disabledOptions.length, 2);
  }
);

test(
  'can add a new item if it does not exist in the search results',
  function(assert) {
    assert.expect(3);

    let textToAdd = 'bananas';

    this.set('content', TEDevents);
    this.actions = {
      assertAdded(text) {
        assert.equal(text, textToAdd, 'an add action gets sent');
      }
    };

    this.render(hbs`{{searchable-select
      content=content
      addLabel="Add new event:"
      on-add=(action "assertAdded")}}`);

    this.$('.Searchable-select__label').click();
    this.$('.Searchable-select__input').val(textToAdd).keyup();

    let $addNew =  this.$('.Searchable-select__add-new');

    assert.equal($addNew.length, 1);
    assert.equal(this.$('.Searchable-select__add-new:contains("Add new event:")').length, 1);

    $addNew.click(); // trigger the add action
  }
);

test('can create a two way binding on the selection', function(assert) {
  assert.expect(1);

  this.set('content', TEDevents);
  this.set('selection', null);
  let itemToSelect = TEDevents.findBy('title', 'TED2015');

  this.render(hbs`{{searchable-select
    content=content
    on-change=(action (mut selection))}}`);

  this.$('.Searchable-select__label').click();
  this.$('.Searchable-select__option:contains("TED2015")').click();

  assert.equal(this.get('selection'), itemToSelect);

});
