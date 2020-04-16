var app = {};
app.elementBeingDeleted = null;
app.limitList = 3;

app.renderList = function(list){
  for (var i = 0; i < list.length; i++) {
    app.addCoverImage(list[i]);
  }
}

app.loadData = function() {
  $.get({
    url: '/api/admin/site/cover_images',
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

app.deleteCoverImage = function(elm) {
  app.elementBeingDeleted = elm.closest('.root-coverImage-card');
  $('#delete_image').attr('src', $(app.elementBeingDeleted).find('img').attr('src'));
  app.deleteModal.open();
}

app.confirmDeleteModal = function(){
  app.deleteModal.close();
  $(app.elementBeingDeleted).remove();
  M.toast({html: 'Image Deleted'});
  $.ajax({
      url: '/api/admin/site/cover_images',
      type: 'DELETE',
      data: {id: $(app.elementBeingDeleted).find('.id').val()}
  });
  app.showNothingMessage();
  app.renderListLength();

  if($('#list > div').length <= app.limitList) {
    $('.new-btn').removeClass('disabled');
  }
}

app.addCoverImage = function(coverImage) {
  var listCount = $('#list > div').length;
  if(listCount >= app.limitList) {
    M.toast({html: 'Cannot Add New'});
    return;
  }
  var template = $('#template > div').clone();

  if(coverImage) {
    $(template).find('.id').val(coverImage._id);
    $(template).find('img').attr('src', '/uploads/' + coverImage.filename);
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
  if($('#list > div').length >= app.limitList) {
    $('.new-btn').addClass('disabled');
  }
  $('.modal').modal();
  app.loadData();
  // app.showNothingMessage();
  // app.renderListLength();
  app.deleteModal = M.Modal.getInstance($('#delete-coverImage-modal')[0]);

})
