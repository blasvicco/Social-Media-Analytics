/*global define*/
define(['jquery', 'underscore', 'backbone', 'collections/todos', 'views/todos',
		'text!templates/stats.html', 'common'], function($, _, Backbone, Todos,
		TodoView, statsTemplate, Common) {
	'use strict';

	// Our overall **AppView** is the top-level piece of UI.
	var AppView = Backbone.View.extend({

		page : 0,

		step : 10,

		searchBy : null,

		// Instead of generating a new element, bind to the existing skeleton of
		// the App already present in the HTML.
		el : '#myApp',

		// Compile our stats template
		template : _.template(statsTemplate),

		// Delegated events for creating new items, and clearing completed ones.
		events : {
			'keypress #top-filter' : 'search',
			'click #clear-completed' : 'clearCompleted',
			'click #toggle-all' : 'toggleAllComplete',
			'click #next-items' : 'loadPage'
		},

		// At initialization we bind to the relevant events on the `Todos`
		// collection, when items are added or changed. Kick things off by
		// loading any preexisting todos that might be saved in *localStorage*.
		initialize : function() {
			this.allCheckbox = this.$('#toggle-all')[0];
			this.$input = this.$('#top-filter');
			this.$footer = this.$('#footer');
			this.$main = this.$('#main');
			this.$todoList = this.$('#todo-list');

			this.listenTo(Todos, 'change:completed', this.filterOne);
			this.listenTo(Todos, 'filter', this.filterAll);
			this.listenTo(Todos, 'all', _.debounce(this.render, 0));
			this.listenTo(Todos, 'refresh', this.refresh);

			Todos.fetch({
				reset : true
			});
			this.loadPage();
		},

		loadMore : function() {
			Todos.refreshFromServer({
			  dataType: 'jsonp',
				success : function(freshData) {
					Todos.reset(freshData);
					Todos.each(function(model) {
						model.preFormat();
						model.save();
					});
					Todos.trigger('refresh');
				}
			});
		},

		// Re-rendering the App just means refreshing the statistics -- the rest
		// of the app doesn't change.
		render : function() {
			var completed = Todos.completed().length;
			var remaining = Todos.remaining().length;

			if (Todos.length) {
				this.$main.show();
				this.$footer.show();

				this.$footer.html(this.template({
					completed : completed,
					remaining : remaining,
					loadedItems : this.page * this.step
				}));

				this.$('#filters li a').removeClass('selected').filter(
						'[href="#/' + (Common.TodoFilter || '') + '"]')
						.addClass('selected');
			} else {
				this.$main.hide();
				this.$footer.hide();
			}

			this.allCheckbox.checked = !remaining;
		},

		// Add a single todo item to the list by creating a view for it, and
		// appending its element to the `<ul>`.
		addOne : function(todo) {
			var view = new TodoView({
				model : todo
			});
			this.$todoList.append(view.render().el);
		},

		// Add all items in the **Todos** collection at once.
		addAll : function() {
			this.$todoList.empty();
			Todos.each(this.addOne, this);
		},

		refresh : function() {
			if (this.page == 0) {
				this.loadPage();
			}
		},

		loadPage : function() {
			var collection = Todos;
			if (this.searchBy) {
				var q = this.searchBy;
				collection = Todos.filter(function(model) {
					return _.some([model.get('provider'),
							model.get('actor_name'),
							model.get('actor_username'),
							model.get('actor_description'),
              model.get('title'),
							model.get('activity_date')], function(value) {
					  var exp = q+'.*';
			      var regex = new RegExp(exp);
						return value.match(regex);
					});
				});
				if (collection.length == 0)
					return;
			}
			var items = collection.slice(this.page * this.step, (this.page + 1)
					* this.step);
			if (items.length == 0) {
				this.loadMore();
				return;
			}
			for (var i = 0; i < items.length; i++) {
				this.addOne(items[i]);
			}
			if (items.length < this.step)
				this.loadMore();
			this.page++;
			this.$('#loaded-items').html(this.page * this.step);
		},

		filterOne : function(todo) {
			todo.trigger('visible');
		},

		filterAll : function() {
			Todos.each(this.filterOne, this);
		},

		search : function(e) {
			if (e.which !== Common.ENTER_KEY) {
				return;
			}

			// Set the current filter to be used
			this.searchBy = this.$input.val() || '';
			this.clearList();
			this.page = 0;
			this.loadPage();
		},

		clearList : function() {
			this.$todoList.html('');
		},

		// Clear all completed todo items, destroying their models.
		clearCompleted : function() {
			_.invoke(Todos.completed(), 'destroy');
			this.clearList();
			this.page = 0;
			this.loadPage();
			return false;
		},

		toggleAllComplete : function() {
			var completed = this.allCheckbox.checked;

			Todos.each(function(todo) {
				todo.save({
					completed : completed
				});
			});
		}
	});

	return AppView;
});
