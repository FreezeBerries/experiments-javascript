var site = site || {};

site.downloadImages = function() {
  var list = $('.project-card');
  for (var i = 0; i < list.length; i++) {
    var id = $(list[i]).find('.id').val();
    var elm = list[i];
    site.processProjects(id, elm);
  }
}

site.processProjects = function(id, elm) {
  $.get({
    url: '/api/project_before_images',
    data: {
      id: id
    },
    success: function(result) {
      var photoList = result.data;
      for (var j = 0; j < photoList.length; j++) {
        $(elm).find('.before_images_header').show();
        console.log(elm);
        $(elm).find('.before_images').append(
          $('<img>').attr('src', '/uploads/' + photoList[j].filename)
        );
      }
    }
  })

  $.get({
    url: '/api/project_after_images',
    data: {
      id: id
    },
    success: function(result) {
      var photoList = result.data;
      for (var j = 0; j < photoList.length; j++) {
        $(elm).find('.after_images_header').show();
        $(elm).find('.after_images').append(
          $('<img>').attr('src', '/uploads/' + photoList[j].filename)
        );
      }
    }
  })

}

site.renderSingleImage = function(singleImageElement) {
  var id = $(singleImageElement).find('.id').val();

  $.get({
    url: '/api/project_preview_image',
    data: {id:id},
    success: function(result) {
      if (result.data && result.data.filename) {
        $(singleImageElement).html(
          $('<img>').attr('src', '/uploads/' + result.data.filename).attr('style', 'width: 100%; height: auto;')
        );
      } else {
        $(singleImageElement).find('text').html('No Image')
      }
    }
  })
};

site.getSingleImage = function() {
  var singleImageElements = $('.project-loader');

  for (var i = 0; i < singleImageElements.length; i++) {
    site.renderSingleImage(singleImageElements[i]);
  }
}

//for project single images
site.getSingleImage();

//for project show
site.downloadImages();
