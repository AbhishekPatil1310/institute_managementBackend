export const me = async (req, res) => {
  console.log('hit me: ',req.user)
  res.json({
    id: req.user.id,
    role: req.user.role,
    forcePasswordChange: req.user.forcePasswordChange,
  });
};
