(function() {

  Backbone.MembershipModel = Backbone.Model.extend({
    idAttribute: 'Id'
  });

  Backbone.MembershipCollection = Backbone.Collection.extend({
    model: Backbone.MembershipModel
  });


  Backbone.MembershipView = Backbone.View.extend({
    template: _.template([
      '<div class="row">',
      '  <div class="org pull-left">',
      '    <div class="logo">',
      '      <img src="<%=OrganizationLogoUrl%>"/>',
      '    </div>',
      '    <div class="info">',
      '      <div class="name"><%=OrganizationName%></div>',
      '      <div class="website"><%=OrganizationWebsite%></div>',
      '      <div class="phone"><%=OrganizationPhone%></div>',
      '      <div class="email"><%=OrganizationEmail%></div>',
      '    </div>',
      '  </div>',
      '  <div class="pull-right">',
      '    <div class="picture">',
      '      <img src="<%=ProfilePictureUrl%>"/>',
      '    </div>',
      '  </div>',
      '</div>',
      '<div class="row">',
      '  <div class="person-info">',
      '    <div class="name"><%=FirstName%> <%=LastName%></div>',
      '    <canvas class="bar-code"></canvas>',
      '  </div>',
      '</div>'
    ].join('\n')),
    className: 'card',
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$barCode = this.$el.find('.bar-code');

      JsBarcode(this.$barCode[0], 'P' + this.model.get('Id'), {
        width: 3,
        height: 50
      });

      return this;
    }
  });

  Backbone.MembershipsView = Backbone.View.extend({
    className: 'cards',
    events: {
      "scroll": "onScroll",
      "mousedown": "onMousedown",
      "mouseup": "onMouseup",
      "touchstart": "onMousedown",
      "touchend": "onMouseup"
    },
    initialize: function(options) {
      this.maybeSnap = _.bind(_.debounce(this.maybeSnap, 250), this);
      this.onScroll = _.bind(_.debounce(this.onScroll, 100), this);
    },
    onScroll: function(e) {
      this.scroll = true;
      if (!this.touch) _.defer(this.maybeSnap);
    },
    onMousedown: function(e) {
      this.touch = true;
      this.$el.stop();
    },
    onMouseup: function(e) {
      this.touch = false;
      if (this.scroll) _.defer(this.maybeSnap);
      this.scroll = false;
    },
    maybeSnap: function() {
      var cards = this.$('.card');
      if (cards.length == 0 || this.touch) return this;

      var index = 0,
          dist = cards.first().position().top;

      cards.each(function(i) {
        if (Math.abs($(this).position().top) < Math.abs(dist)) {
          index = i;
          dist = $(this).position().top;
        }
      });

      if (dist && (Math.abs(dist) > 10 || _.now() > this.lastSnap + 1000)) {
        console.log('maybeSnap', dist);
        this.$el.animate({scrollTop: this.$el.scrollTop() + dist+'px'});
        this.lastSnap = _.now();
      }
    },
    render: function() {
      var deck = this;
      this.collection.each(function(model) {
        var card = new Backbone.MembershipView({
          model: model
        });
        deck.$el.append(card.render().$el);
      });
      return this;
    }
  });

}.call(this));