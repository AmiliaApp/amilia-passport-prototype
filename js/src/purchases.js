(function() {

  Backbone.PurchaseModel = Backbone.Model.extend({
    idAttribute: 'Id'
  });

  Backbone.PurchaseCollection = Backbone.Collection.extend({
    model: Backbone.PurchaseModel
  });

  Backbone.PurchaseView = Backbone.View.extend({
    template: _.template([
      '<div class="col org"><img src="<%=OrganizationLogoUrl%>" /></div>',
      '<div class="col name"><strong><%=OrganizationName%></strong><br/><%=Name%></div>',
      '<div class="col person">',
      '  <img src="<%=ProfilePictureUrl%>" />',
      '  <div class="name"><%=FirstName%></div>',
      '</div>',
      '<div class="col invoice"><a href="#" class="receipt">Facture</a></div>'
    ].join('\n')),
    className: 'purchase',
    events: {
      'click a.receipt': 'onReceipt'
    },
    onReceipt: function(e) {
      e.preventDefault();
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.css({
        width: Math.min(Math.max(screen.width, screen.height), Backbone.SCREEN_MAX_WIDTH) - Backbone.SIDE_MENU_WIDTH
      });
      return this;
    }
  });

  Backbone.PurchasesView = Backbone.View.extend({
    className: 'purchases',
    initialize: function(options) {
      this.onResize = _.bind(_.debounce(this.onResize, 100), this);
      $(window).on('resize', this.onResize);
    },
    remove: function() {
      $(window).off('resize', this.onResize);
      return Backbone.View.prototype.remove.apply(this, arguments);
    },
    onResize: function() {
      this.render();
    },
    render: function() {
      this.purchases || (this.purchases = []);
      for (var i = 0; i < this.purchases.length; i++) this.purchases[i].remove();
      this.purchases = [];

      var self = this;
      this.collection.each(function(model) {
        var purchase = new Backbone.PurchaseView({
          model: model
        });
        self.$el.append(purchase.render().$el);
        self.purchases.push(purchase);
      });
      return this;
    }
  });

}.call(this));