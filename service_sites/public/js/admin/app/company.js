var app = {};

app.saveCompanyInfo = function() {
  $.post({
    url: "/api/admin/app/company",
    data: {
      signupcode: $('#signupcode').val(),
      name: $('#company_name').val(),
      email: $('#company_email').val(),
      phone: $('#company_phone').val(),
      open_since_year: $('#company_open_year').val(),
      about: $('#company_about').val(),
      facebook_link: $('#company_facebook_link').val(),
      yelp_link: $('#company_yelp_link').val(),
      angies_list_link: $('#company_angies_list_link').val(),
      youtube_link: $('#company_youtube_link').val(),
      twitter_link: $('#company_twitter_link').val()
    },
    success: function(){
      M.toast({html: 'Company Info Save'});
    }
  });
}
