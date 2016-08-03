(function() {

  Backbone.HomeView = Backbone.View.extend({
    className: 'home',
    template: _.template([
      '<h1>Amilia Passport</h1>',
      '<br/>',
      '<p class="lead">Account: Famille Drapeau</p>'
    ].join('\n')),
    render: function() {
      this.$el.html(this.template());
    	return this;
    }
  });

}.call(this));