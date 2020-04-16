var app = app || {};
app.limitList = 10;

app.openCreateModal = function(){
  var listCount = app.data.length;

  if(listCount < app.limitList) {
    var modal = M.Modal.getInstance($('#new-project')[0]);
    modal.open();
  } else {
    M.toast({html: 'Cannot Create New Project' });
  }
}

app.createProject = function() {
  var name = $('#name').val();
  var description = $('#description').val();

  $.post({
    url: '/api/admin/site/project',
    data: {
      name: name,
      description: description
    },
    success: function(result) {
      location.href = '/admin/site/project?id=' + result.data._id;
      app.countList();
    }
  })
};

app.countList = function() {
  var num = app.data.length;

  $('#listLength').html(num);
}



$(function() {
    $('.modal').modal();
    app.countList();

    $("#jsGrid").jsGrid({
        height: "90%",
        width: "100%",
        data: app.data,
        // filtering: true,
        // editing: true,
        // sorting: true,
        // paging: true,
        autoload: true,

        pageSize: 15,
        pageButtonCount: 5,

        deleteConfirm: "Do you really want to delete the client?",

        // controller: db,

        fields: [
            { name: "name", type: "text", width: 150 },
            { name: "description", type: "text", width: 250 },
            { type: "control", width: 100, editButton: false, deleteButton: false,
                 itemTemplate: function(value, item) {
                    var $result = jsGrid.fields.control.prototype.itemTemplate.apply(this, arguments);

                    var $customEditButton = $("<button>").attr({class: "customGridEditbutton jsgrid-button jsgrid-edit-button"})
                      .click(function(e) {
                        location.href = "/admin/site/project?id=" + item._id;
                      });

                   // var $customDeleteButton = $("<button>").attr({class: "customGridDeletebutton jsgrid-button jsgrid-delete-button"})
                   //  .click(function(e) {
                   //    alert("Title: " + item.title);
                   //    e.stopPropagation();
                   //  });

                    return $("<div>").append($customEditButton)
                    // .append($customDeleteButton);
                    //return $result.add($customButton);
                },
              }
        ]
    });
});
