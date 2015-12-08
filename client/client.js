Tasks = new Mongo.Collection('tasks');

if (Meteor.isClient) {
  const HIDE_COMPLETED = 'hideCompleted';

  Meteor.subscribe('tasks');

  Template.body.helpers({
    tasks: () => {
      var hideCompleted = Session.get(HIDE_COMPLETED);
      var options = {};
      if (hideCompleted) {
        options.checked = {$ne: true};
      }

      return Tasks.find(options, {
        sort: {
          createdAt: -1
        }
      })
    },
    hideCompleted:  () => Session.get(HIDE_COMPLETED),
    incompleteCount:() => Tasks.find({checked: {$ne: true}}).count()

  });

  Template.body.events({
    'submit .new-task': (event) => {
      event.preventDefault();
      var $text = event.target.text;

      Meteor.call('addTask', $text.value);

      $text.value = '';
    },

    'change .hide-completed input': (event) => {
      "use strict";
      Session.set(HIDE_COMPLETED, event.target.checked);
    }
  });

  Template.task.helpers({
    isOwner: function() {
      return this.owner === Meteor.userId();
    }
  });

  Template.task.events({
    'change .toggle-checked': function() {
      Meteor.call('setChecked', this._id, !this.checked)
    },
    'click .delete': function() {
      Meteor.call('deleteTask', this._id);
    },
    'click .toggle-private': function() {
      Meteor.call('setPrivate', this._id, !this.private);
    }
  });

  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY'
  });

}
