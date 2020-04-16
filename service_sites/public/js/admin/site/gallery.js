var app = {};
app.elementBeingDeleted = null;
app.limitList = 50;

app.renderList = function(list){
  for (var i = 0; i < list.length; i++) {
    app.addGallery(list[i]);
  }
}

app.loadData = function() {
  $.get({
    url: '/api/admin/site/gallery',
    success: function(result){
      if(result.success) {
        $('#loader').hide();
        if(result.data.length > 0) {
          app.renderList(result.data);
        } else {
          app.showNothingMessage();
          app.renderListLength();
        }
      }
    }
  })
}
app.showNothingMessage = function(){
  var listLength = $('#list > div').length;

  if(listLength === 0) {
    $('#nothingHereMessage').show();
  } else {
    $('#nothingHereMessage').hide();
  }
}

app.deleteGallery = function(elm) {
  app.elementBeingDeleted = elm.closest('.root-gallery-card');
  $('#delete_image').attr('src', $(app.elementBeingDeleted).find('img').attr('src'));
  app.deleteModal.open();
}

app.confirmDeleteModal = function(){
  app.deleteModal.close();
  $(app.elementBeingDeleted).remove();
  M.toast({html: 'Image Deleted'});
  $.ajax({
      url: '/api/admin/site/gallery',
      type: 'DELETE',
      data: {id: $(app.elementBeingDeleted).find('.id').val()}
  });
  app.showNothingMessage();
  app.renderListLength();

  if($('#list > div').length <= app.limitList) {
    $('.new-btn').removeClass('disabled');
  }
}

app.addGallery = function(gallery) {
  var listCount = $('#list > div').length;
  if(listCount >= app.limitList) {
    M.toast({html: 'Cannot Add New'});
    return;
  }
  var template = $('#template > div').clone();

  if(gallery) {
    $(template).find('.id').val(gallery._id);
    $(template).find('img').attr('src', '/uploads/' + gallery.filename);
  }

  $('#list').prepend(template);
  $('#nothingHereMessage').hide();
  app.renderListLength();

  if($('#list > div').length >= app.limitList) {
    $('.new-btn').addClass('disabled');
  }
};

app.renderListLength = function() {
  $('#listLength').html($('#list > div').length);
}

$(function(){
  $('.modal').modal();
  app.loadData();
  // app.showNothingMessage();
  // app.renderListLength();
  app.deleteModal = M.Modal.getInstance($('#delete-gallery-modal')[0]);

});
