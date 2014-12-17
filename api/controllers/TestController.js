var TestController = {
  index: function(req, res) {
    res.send("index !");
  },
  test: function(req, res) {
    res.json({message: 'success !'});
  }
};

module.exports = TestController;
