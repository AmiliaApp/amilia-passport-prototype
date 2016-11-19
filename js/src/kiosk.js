(function() {

  var membershipPlaceholder = {
    PersonId: undefined,
    From: undefined,
    To: undefined,
    Name: '???',
    FirstName: '???',
    LastName: '???',
    ProfilePictureUrl: 'img/person-placeholder.jpg',
    OrganizationId: 101,
    OrganizationLogoUrl: 'img/tennis-montreal.png',
    OrganizationName: "Tennis Montréal",
    OrganizationAddress: "285, rue Gary-Carter, bur. 202, Montréal, QC, H2R 2W1, CA",
    OrganizationPhone: "(514) 872-7177",
    OrganizationEmail: "info@tennismontreal.qc.ca",
    OrganizationWebsite: "www.tennismontreal.qc.ca"
  };

  Backbone.KioskModel = Backbone.Model.extend({
    defaults: {
      input: undefined,
      membership: membershipPlaceholder
    }
  });

  Backbone.KioskView = Backbone.View.extend({
    template: undefined,
    className: 'kiosk',
    events: {
      'keydown input.live-input': 'onInputKeydown',
      'click button.continue': 'onContinue'
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
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));

      var membership = new Backbone.MembershipModel(this.model.get("membership")),
          personId = membership.get('PersonId')
          html = personId ? new Backbone.MembershipView({model: membership}).render().$el : $('<div class="card unknown">?</div>');
      this.$('.card').replaceWith(html);

      this.$('.actions button').hide();

      this.$input = this.$('input.live-input');
      this.$message = this.$('.message');
      this.$messageSmall = this.$('.message-small');
      this.$card = this.$('.card');
      this.$continue = this.$('button.continue');

      var input = this.model.get('input'),
          state = personId ? 'pass' : input === undefined ? 'disabled' : 'fail';
      if (moment(membership.get('To')).isBefore(moment())) state = 'expired';

      switch (state) {
        case 'pass':
          this.$input.hide();
          this.$continue.show();
          this.$message.html('<i class="fa fa-fw fa-check"></i> Passage enregistré');
          this.$messageSmall.empty();
          break;
        case 'expired':
          this.$input.hide();
          this.$continue.show();
          this.$message.html('<i class="fa fa-fw fa-warning"></i> Abonnement expiré');
          this.$messageSmall.html('Allez voir le préposé pour le renouveler');
          break;
        case 'fail':
          this.$message.html('<i class="fa fa-fw fa-times"></i> Numéro invalide');
          this.$messageSmall.html('Essayez à nouveau');
          break;
        default:
          this.$card.addClass('disabled');
      }

      return this;
    },
    onInputKeydown: function(e) {
      if (e.keyCode != 13) return;

      var input = this.$input.val(),
          personId = parseInt(input, 10),
          membership = this.collection.findWhere({PersonId: personId});
      
      this.model.set({
        input: !_.isNaN(personId) ? personId : input.length ? input : undefined,
        membership: membership ? membership.toJSON() : membershipPlaceholder
      });
      this.render();
    },
    onContinue: function(e) {
      this.model.set({
        input: undefined,
        membership: membershipPlaceholder
      });
      this.render();
    }
  });
  $('document').ready(function() {
    Backbone.KioskView.prototype.template = _.template($('#kiosk-template').html());
  });

}.call(this));