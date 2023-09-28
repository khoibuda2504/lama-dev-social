const router = require("express").Router();
const Conversation = require("../models/Conversation");

//new conversation
router.post('/', async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId]
  })
  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err)
  }
})

//get conversation of user
router.get('/:userId', async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] }
    })
    res.status(200).json(conversation)
  } catch (err) {
    res.status(500).json(err)
  }
})

//get conversation of online chat
router.get('/find/:senderId/:receiverId', async (req, res) => {
  try {
    console.log('[req.params.senderId,req.params.receiverId]', [req.params.senderId,req.params.receiverId])
    const conversation = await Conversation.find({
      members: { $all: [req.params.senderId,req.params.receiverId] }
    })
    res.status(200).json(conversation)
  } catch (err) {
    res.status(500).json(err)
  }
})
module.exports = router;
