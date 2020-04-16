var app = {};
app.elementBeingDeleted = null;
app.limitList = 10;

app.saveTestimonials = function() {
  var $listElements = $('#list > div');
  var list = [];

  for (var i = 0; i < $listElements.length; i++) {
    var id = $($listElements[i]).find('.id').val();
    list.push({
      id:  id === "" ? undefined : id,
      name: $($listElements[i]).find('.name').val() || "",
      testimony: $($listElements[i]).find('.testimony').val() || ""
    });
  }

  $.post({
    url: '/api/admin/site/testimonials',
    data: {list: list},
    success: function(){
      M.toast({html: 'Testimonials Saved'});
    }
  });
}

app.renderList = function(list){
  for (var i = 0; i < list.length; i++) {
    app.addTestimony(list[i]);
  }
}

app.loadData = function() {
  $.get({
    url: '/api/admin/site/testimonials',
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

app.deleteTestimony = function(elm) {
  app.elementBeingDeleted = elm.closest('.root-testimony-card');
  $('#delete_name').html($(app.elementBeingDeleted).find('.name').val());
  $('#delete_testimony').html($(app.elementBeingDeleted).find('.testimony').val());
  app.deleteModal.open();
}

app.confirmDeleteModal = function(){
  app.deleteModal.close();
  $(app.elementBeingDeleted).remove();
  M.toast({html: 'Testimony Deleted'});
  $.ajax({
      url: '/api/admin/site/testimony',
      type: 'DELETE',
      data: {id: $(app.elementBeingDeleted).find('.id').val()}
  });
  app.showNothingMessage();
  app.renderListLength();
}

app.addTestimony = function(testimony) {
  var listCount = $('#list > div').length;

  $('#list').show();
  if(listCount >= app.limitList) {
    M.toast({html: 'Cannot Add New'});
    return;
  }
  var template = $('#template > div').clone();
  if(testimony) {
    $(template).find('.id').val(testimony._id);
    $(template).find('.name').val(testimony.name);
    $(template).find('.testimony').val(testimony.testimony);
  }


  $('#list').prepend(template);
  $('#nothingHereMessage').hide();
  app.renderListLength();
  M.updateTextFields();
};

app.renderListLength = function() {
  $('#listLength').html($('#list > div').length);
}

$(function(){
  $('.modal').modal();
  app.loadData();
  app.deleteModal = M.Modal.getInstance($('#delete-testimony-modal')[0]);

})
