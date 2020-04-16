exports.getDashboard = (req, res) => {
  res.render('client_admin/dashboard', {
    title: 'Dashboard'
  });
};

exports.getGeneralInformation = (req, res) => {
  res.render('client_admin/general-information', {
    title: 'General Information'
  });
};

exports.getQuestionnaire = (req, res) => {
  res.render('client_admin/questionnaire', {
    title: 'Questionnaire'
  });
};

exports.getQuestionnaires = (req, res) => {
  res.render('client_admin/questionnaires', {
    title: 'Questionnaires'
  });
};

exports.getService = (req, res) => {
  res.render('client_admin/service', {
    title: 'Service'
  });
};

exports.getServices = (req, res) => {
  res.render('client_admin/services', {
    title: 'Services'
  });
};
