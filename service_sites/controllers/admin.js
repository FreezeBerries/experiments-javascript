exports.getDashboard = (req, res) => {
  res.render('admin/dashboard', {
    title: 'Dashboard',
    sidebar: 'dashboard'
  });
};
