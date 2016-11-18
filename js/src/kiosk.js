(function() {

  Backbone.KioskModel = Backbone.Model.extend({
    defaults: {

      member: {
        PersonId: '????',
        From: '2015-09-01',
        To: '2016-08-31',
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
      }
    }
  });

  Backbone.KioskView = Backbone.View.extend({
    template: undefined,
    className: 'kiosk',
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

      this.$('.card').replaceWith(new Backbone.MembershipView({
        model: new Backbone.MembershipModel(this.model.get("member"))
      }).render().$el);

      return this;
    }
  });
  $('document').ready(function() {
    Backbone.KioskView.prototype.template = _.template($('#kiosk-template').html());
  });

}.call(this));