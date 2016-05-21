/*global define*/
define([
	'underscore',
	'backbone'
], function (_, Backbone) {
	'use strict';

	var Todo = Backbone.Model.extend({
	  url: '',
	  
		// Default attributes for the todo
		// and ensure that each todo created has `title` and `completed` keys.
		defaults: {
      'id' : '',// '8091296008',
      'actor_username' : '',// 'alana.gleason',
      'actor_description' : '',// 'Organized full-range internet solution',
      'actor_name' : '',// 'Ken Kozey',
      'actor_avator' : '',// 'https://robohash.org/alana.gleason.png?size=300x300\u0026set=set1',
      'actor_url' : '',// 'https://twitter.com/alana.gleason',
      'provider' : '',// 'twitter',
      'activity_url' : '',// 'https://twitter.com/alana.gleason/8091296008',
      'activity_latitude' : null,
      'activity_longitude' : null,
      'activity_date' : '',// '2016-05-18',
      'activity_message' : '',// 'Nesciunt ulterius decimus animi debilito animus tergo curvus cito apud audentia.',
      'activity_likes' : '',// 83,
      'activity_shares' : '',// 16,
      'activity_comments' : '',// 4,
      'activity_attachment' : null,
      'activity_attachment_type' : null,
      'activity_sentiment' : '',// 0
			'title': '',
			'completed': false,
			'isUrlContent': false
		},
		
		// Toggle the `completed` state of this todo item.
		toggle: function () {
			this.save({
				completed: !this.get('completed')
			});
		},
		
		parse: function (response) {
		  var exp = /https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,}/;
      var regex = new RegExp(exp);
      response.isUrlContent = response.activity_message.match(regex);
      response.title = response.provider + ' - ' + response.actor_description.substr(0, 25) + '...';
      return response;
		},
		
		preFormat: function() {
		  var exp = /https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,}/;
      var regex = new RegExp(exp);
      this.set('isUrlContent', this.get('activity_message').match(regex));
      this.set('title', this.get('provider') + ' - ' + this.get('actor_description').substr(0, 25) + '...');
		}
	});

	return Todo;
});
