let handleHelloWorld = async (req, res) => {
  console.log("User Data:", req.user);
  return res.render("homepage", {
    user: req.user,
  });
};

module.exports = {
  handleHelloWorld: handleHelloWorld,
};
