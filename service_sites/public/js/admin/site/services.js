var app = {};
app.elementBeingDeleted = null;
app.limitList = 50;

app.saveServices = function() {
  var $listElements = $('#list > div');
  var list = [];

  for (var i = 0; i < $listElements.length; i++) {
    var id = $($listElements[i]).find('.id').val();
    list.push({
      id:  id === "" ? undefined : id,
      name: $($listElements[i]).find('.name').val() || "",
      message: $($listElements[i]).find('.message').val() || ""
    });
  }

  $.post({
    url: '/api/admin/site/services',
    data: {list: list},
    success: function(){
      M.toast({html: 'Services Saved'});
    }
  });
}

app.renderList = function(list){
  for (var i = 0; i < list.length; i++) {
    app.addService(list[i]);
  }
}

app.loadData = function() {
  $.get({
    url: '/api/admin/site/services',
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

app.deleteService = function(elm) {
  app.elementBeingDeleted = elm.closest('.root-service-card');
  $('#delete_name').html($(app.elementBeingDeleted).find('.name').val());
  $('#delete_service').html($(app.elementBeingDeleted).find('.message').val());
  app.deleteModal.open();
}

app.confirmDeleteModal = function(){
  app.deleteModal.close();
  $(app.elementBeingDeleted).remove();
  M.toast({html: 'Service Deleted'});
  $.ajax({
      url: '/api/admin/site/service',
      type: 'DELETE',
      data: {id: $(app.elementBeingDeleted).find('.id').val()}
  });
  app.showNothingMessage();
  app.renderListLength();
}

app.addService = function(service) {
  var listCount = $('#list > div').length;
  if(listCount >= app.limitList) {
    M.toast({html: 'Cannot Add New'});
    return;
  }
  var template = $('#template > div').clone();

  if(service) {
    $(template).find('.id').val(service._id);
    $(template).find('.name').val(service.name);
    $(template).find('.message').val(service.message);
  }

  $('#list').prepend(template);
  $('#nothingHereMessage').hide();
  app.renderListLength();
};

app.renderListLength = function() {
  $('#listLength').html($('#list > div').length);
}

$(function(){
  $('.modal').modal();
  app.loadData();
  // app.showNothingMessage();
  // app.renderListLength();
  app.deleteModal = M.Modal.getInstance($('#delete-service-modal')[0]);

})
