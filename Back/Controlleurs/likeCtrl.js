// Imports

const models = require('../models');
const jwtUtils = require('../Utils/jwtUtils');

// Routes

module.exports = {
    like: function (req, res) {
        let headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getUserId(headerAuth);
        
        let postId = req.params.id;

        if (postId <= 0) {
            return res.status(400).json({ error: "invalid parameters" });
        }
        models.Post.findOne({
            where: { id: postId }
        })
            .then(function (postFound) {
                if (postFound) {
                    models.User.findOne({
                        where: { id: userId }
                    })
                        .then(function (userFound) {
                            if (userFound) {
                                models.Like.findOne({
                                    where: {
                                        userId: userFound.id,
                                        postId: postId
                                    }
                                })
                                    .then(function (likeFound) {
                                        if (!likeFound) {
                                            models.Like.create({
                                                userId: userFound.id,
                                                postId: postId,
                                                onclick: "return false"
                                            })
                                            postFound.update({
                                                likesCount: postFound.likesCount + 1
                                            })
                                            return res.status(201).json({ succes: "you liked the post" });
                                            // postFound.addUser(userFound)
                                        } else {
                                            return res.status(409).json({ error: "post already liked" });
                                        }
                                    })
                                    .catch(function (error) {
                                        res.status(500).json({ error: "unable to find likes" });
                                    })
                            } else {
                                return res.status(403).json({ error: "invalid user" });
                            }
                        })
                        .catch(function (error) {
                            return res.status(500).json({ error: "unable to verify user" });
                        })
                } else {
                    return res.status(404).json({ error: "post not found" });
                }
            })
            .catch(function (error) {
                return res.status(500).json({ error: "unable to find post" });
            })
    },

    unlike: function (req, res) {
        let headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getUserId(headerAuth);
        let postId = req.params.id;

        if (postId <= 0) {
            return res.status(400).json({ error: "invalid parameters" });
        }

        models.Post.findOne({
            where: { id: postId }
        })
            .then(function (postFound) {
                if (postFound) {
                    models.User.findOne({
                        where: { id: userId }
                    })
                        .then(function (userFound) {
                            if (userFound) {
                                models.Like.findOne({
                                    where: {
                                        userId: userFound.id,
                                        postId: postId
                                    }
                                })
                                    .then(function (likeFound) {
                                        if (likeFound.dataValues.userId == userFound.id) {
                                            models.Like.destroy({
                                                where: { postId: postId }
                                            })
                                            postFound.update({
                                                likesCount: postFound.likesCount - 1
                                            })

                                            return res.status(200).json({ success: "you unliked the post" });
                                            // postFound.addUser(userFound)
                                        } else {
                                            return res.status(409).json({ error: "post not liked" });
                                        }
                                    })
                                    .catch(function (error) {
                                        res.status(500).json({ error: "unable to find likes" });
                                    })
                            } else {
                                return res.status(403).json({ error: "invalid user" });
                            }
                        })
                        .catch(function (error) {
                            return res.status(500).json({ error: "unable to verify user" });
                        })
                } else {
                    return res.status(404).json({ error: "post not found" });
                }
            })
            .catch(function (error) {
                return res.status(500).json({ error: "unable to find post" });
            })
    },


}