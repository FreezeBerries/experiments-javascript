var app = app || {};
app.limitListAfter = 10;
app.limitListBefore = 10;

app.deleteProject = function() {
  $.ajax({
      url: '/api/admin/site/project',
      type: 'DELETE',
      data: {id: app.data._id},
      success: function(){
        location.href = "/admin/site/projects"
      }
  });
}

app.keyDownDelete = function(text) {
  if($(text).val() === app.data.name) {
    console.log('hit');
    $('#delete_project').removeClass('disabled');
  }
}

app.init = function() {
  // app.renderBeforeListLength();
  // app.renderAfterListLength();
  app.loadBeforeImages();
  app.loadAfterImages();
}
app.loadBeforeImages = function() {
  $.get({
    url: '/api/admin/site/project/before_images',
    data: {
      id: app.data._id
    },
    success: function(result) {
      var list = result.data;
      for (var i = 0; i < list.length; i++) {
        var template = $('#beforeTemplate > div').clone();

        $(template).find('.id').val(list[i]._id);
        $(template).find('img').attr('src', '/uploads/' + list[i].filename);

        $('#beforeList').prepend(template);
        $('#nothingHereMessageBefore').hide();
      }
      app.renderBeforeListLength();

      if($('#beforeList > div').length >= app.limitListAfter) {
        $('.new-btn-after').addClass('disabled');
      }
    }
  })
}

app.loadAfterImages = function() {
  $.get({
    url: '/api/admin/site/project/after_images',
    data: {
      id: app.data._id
    },
    success: function(result) {
      var list = result.data;
      for (var i = 0; i < list.length; i++) {
        var template = $('#afterTemplate > div').clone();

        $(template).find('.id').val(list[i]._id);
        $(template).find('img').attr('src', '/uploads/' + list[i].filename);

        $('#afterList').prepend(template);
        $('#nothingHereMessageAfter').hide();
      }
      app.renderAfterListLength();

      if($('#afterList > div').length >= app.limitListAfter) {
        $('.new-btn-before').addClass('disabled');
      }
    }
  });
}

app.deleteBeforeImage = function(elm) {
  app.elementBeingDeletedBefore = elm.closest('.root-before-card');
  $('#delete_image_before').attr('src', $(app.elementBeingDeletedBefore).find('img').attr('src'));
  M.Modal.getInstance($('#delete-before-modal')[0]).open();
}

app.confirmDeleteModalAfter = function(){
  M.Modal.getInstance($('#delete-after-modal')[0]).close();
  M.toast({html: 'Image Deleted'});

  $.ajax({
      url: '/api/admin/site/project/after_image',
      type: 'DELETE',
      data: {id: $(app.elementBeingDeletedAfter).find('.id').val()}
  });

  $(app.elementBeingDeletedAfter).remove();
  app.renderAfterListLength();
}

app.confirmDeleteModalBefore = function(){
  M.Modal.getInstance($('#delete-before-modal')[0]).close();
  M.toast({html: 'Image Deleted'});

  $.ajax({
      url: '/api/admin/site/project/before_image',
      type: 'DELETE',
      data: {id: $(app.elementBeingDeletedBefore).find('.id').val()}
  });

  $(app.elementBeingDeletedBefore).remove();
  app.renderBeforeListLength();
}

app.deleteAfterImage = function(elm) {
  app.elementBeingDeletedAfter = elm.closest('.root-after-card');
  $('#delete_image_after').attr('src', $(app.elementBeingDeletedAfter).find('img').attr('src'));
  M.Modal.getInstance($('#delete-after-modal')[0]).open();
}

app.renderBeforeListLength = function() {
  $('#listLengthBefore').html($('#beforeList > div').length);
}

app.renderAfterListLength = function() {
  $('#listLengthAfter').html($('#afterList > div').length);
}

app.openEdit = function(){
  $('#edit_name').val(app.data.name);
  $('#edit_description').val(app.data.description);

  var editModal = M.Modal.getInstance($('#edit-project')[0]);
  editModal.open();
}

app.saveEdit = function() {
  var editName = $('#edit_name').val();
  var editDescription = $('#edit_description').val();

  $.post({
    url: '/api/admin/site/project',
    data: {
      id: app.data._id,
      name: editName,
      description: editDescription
    },
    success: function() {
      $('#name').html(editName);
      $('#description').html(editDescription);

      var editModal = M.Modal.getInstance($('#edit-project')[0]);
      editModal.close();
      M.toast({html: 'Project Info Updated'});
    }
  });
}

$(function() {
  $('.modal').modal();
  app.init();
})
