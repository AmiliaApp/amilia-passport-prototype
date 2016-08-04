(function() {

  Backbone.HomeView = Backbone.View.extend({
    className: 'home',
    template: _.template([
      '<div class="wrapper">',
      '  <div class="center">',
      '    <h1>Passeport Amilia</h1>',
      '    <br/>',
      '    <p class="lead">',
      '      <span class="account">Compte : Famille Drapeau</span>',
      '    </p>',
      '    <p>',
      '      <a href="#" class="change-account"><i class="fa fa-fw fa-arrow-circle-right"></i> Changer de compte</a>',
      '    </p>',
      '  </div>',
      '</div>'
    ].join('\n')),
    events: {
      'click a.change-account': 'onChangeAccount'
    },
    onChangeAccount: function(e) {
      e.preventDefault();
    },
    render: function() {
      this.$el.html(this.template());
    	return this;
    }
  });

}.call(this));