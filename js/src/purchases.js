(function() {

  Backbone.PurchaseModel = Backbone.Model.extend({
    idAttribute: 'Id'
  });

  Backbone.PurchaseCollection = Backbone.Collection.extend({
    model: Backbone.PurchaseModel
  });

  Backbone.ReceiptView = Backbone.View.extend({
    template: undefined,
    className: 'receipt-wrapper',
    events: {
      'click .close': 'onClose',
    },
    onClose: function(e) {
      e.preventDefault();
      var view = this;
      this.$el.fadeOut(function() {
        view.remove();
      });
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));

      this.$el.find('.receipt').css({
        width: Math.min(Math.max(screen.width, screen.height), Backbone.SCREEN_MAX_WIDTH) - Backbone.SIDE_MENU_WIDTH
      });

      this.$el.hide();

      return this;
    }
  });
  $('document').ready(function() {
    Backbone.ReceiptView.prototype.template = _.template($('#receipt-template').html());
  });

  Backbone.PurchaseView = Backbone.View.extend({
    template: undefined,
    className: 'purchase',
    events: {
      'click a.show-receipt': 'onReceipt'
    },
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
    onReceipt: function(e) {
      e.preventDefault();
      var receiptView = new Backbone.ReceiptView({
        model: this.model
      }).render();
      $('#purchases').append(receiptView.$el);
      receiptView.$el.fadeIn();
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.css({
        width: Math.min(Math.max(screen.width, screen.height), Backbone.SCREEN_MAX_WIDTH) - Backbone.SIDE_MENU_WIDTH
      });
      return this;
    }
  });
  $('document').ready(function() {
    Backbone.PurchaseView.prototype.template = _.template($('#purchase-template').html());
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