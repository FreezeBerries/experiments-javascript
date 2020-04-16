
exports.getCustomerMap = (req, res) => {
  res.render('admin/crm/reports/customer-map.pug', {
    title: 'Customer Map'
  });
};


exports.getCampaign = (req, res) => {
  res.render('admin/crm/campaign', {
    title: 'campaign'
  });
};

exports.getCampaigns = (req, res) => {
  res.render('admin/crm/campaigns', {
    title: 'campaigns'
  });
};


exports.getQuestionnaire = (req, res) => {
  res.render('admin/crm/questionnaire', {
    title: 'Questionnaire'
  });
};

exports.getQuestionnaires = (req, res) => {
  res.render('admin/crm/questionnaires', {
    title: 'Questionnaires'
  });
};

exports.getReports = (req, res) => {
  res.render('admin/crm/reports', {
    title: 'Reports'
  });
};
