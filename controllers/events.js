const models = require('../models')
var sentimentAnalysis = require('sentiment-analysis');
 
sentimentAnalysis('Dinosaurs are awesome!');
class EventsController {
    // Create User
    async analysis(data) {

        try {
            const {
                event_id,
            } = data;
            let message, response,arr=[]
            const matchVote = await models.Comment.findAll({ where: { EventId: event_id } });
            matchVote.map((data,index)=>
            {
                arr.push(data.comment)
            })
            arr=arr.toString()
            arr=arr.replace(",", " ")
            console.log("-------------",sentimentAnalysis(arr),arr)
            return Promise.resolve({ code: 200, response: matchVote });

        } catch (err) {
            global.log.error(err);
            console.log(err)
            return Promise.reject(err)
        }
    }
    add(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const {
                    userId,
                    name,
                    views,
                    district,
                    locality,
                    url,
                    cateogory,
                    state,
                    start_date,
                    image,
                    geoLocation,
                    description,
                } = data;

                models.Event.create({
                    UserId: userId,
                    name: name,
                    views:views,
                    description: description,
                    image: image,
                    cateogory: cateogory,
                    start_date: start_date,
                    geoLocation: geoLocation,
                    district: district,
                    locality: locality,
                    url: url,
                    state: state,
                }).then(response => {
                    console.log("event created:", response);
                    console.log("User", response['dataValues'].user)

                });
                resolve({ code: 200, msg: "Event Created Successfully" });

            } catch (err) {
                global.log.error(err);
                console.log(err)
                reject(err)
            }
        });
    }
    async vote(data) {

        try {
            const {
                user_id,
                event_id,
                vote_bool
            } = data;
            let message, response
            const matchVote = await models.Vote.findOne({ where: { UserId: user_id, EventId: event_id, voteBool: vote_bool } });
            if (matchVote) {
                matchVote.destroy()
                message = "DeVoted Succesfully"
                
            }
            else {
                let match = await models.Vote.findOne({ where: { UserId: user_id, EventId: event_id } })
                // Check if record exists in db
                if (match) {

                    response = await match.update({
                        voteBool: vote_bool
                    })
                    message = "Voted Updated Succesfully";
                }
                else {

                    response = await models.Vote.create({
                        UserId: user_id, EventId: event_id, voteBool: vote_bool
                    })
                    message = "Voted Successfully"
                }

            }
            return Promise.resolve({ code: 200, msg: message, response: response });

        } catch (err) {
            global.log.error(err);
            console.log(err)
            return Promise.reject(err)
        }
    }
    async deleteComment(data) {

        try {
            const {
                comment_id,
                event_id,
            } = data;
            let message, response
            const matchVote = await models.Comment.findOne({ where: { id: comment_id, EventId: event_id } });
            if (matchVote) {
                matchVote.destroy()
                message = "Comment Deleted Succesfully"
            }
            return Promise.resolve({ code: 200, msg: message, response: response });

        } catch (err) {
            global.log.error(err);
            console.log(err)
            return Promise.reject(err)
        }
    }
    async getAll() {

        try {
            let response
            response = await models.Event.findAll({
                include: [
                    {
                        model: models.User,
                        as: 'user',
                    },
                    {
                        model: models.Comment,
                        as: 'comments',
                    },
                ],
            })
            return Promise.resolve({ code: 200, msg: "Got all Events", response: response });

        } catch (err) {
            global.log.error(err);
            console.log(err)
            return Promise.reject(err)
        }
    }
    async comment(data) {

        try {
            const {
                user_id,
                event_id,
                comment
            } = data;
            let response = await models.Comment.create({
                UserId: user_id, EventId: event_id, comment: comment
            })

            return Promise.resolve({ code: 200, msg: "Comment Added" });

        } catch (err) {
            global.log.error(err);
            console.log(err)
            return Promise.reject(err)
        }
    }
    async getEventDetails(data) {
        const {
            event_id,
            user_id
        } = data;

        try {
            let comments, commentCount, upVote, downVote, vote_bool, eventDetails,views
            let arr=[]
            const analyze = await models.Comment.findAll({ where: { EventId: event_id } });
            analyze.map((data,index)=>
            {
                arr.push(data.comment)
            })
            arr=arr.toString()
            arr=arr.replace(",", " ")
            console.log("-------------",sentimentAnalysis(arr),arr)
            views=models.Event.increment('views', {  where: { id: event_id }});

            comments = await models.Comment.findAll({
                where: { EventId: event_id }, include: [
                    {
                        model: models.User,
                        as: 'user'
                    }
                ]
            })
            vote_bool = await models.Vote.findOne({
                where: { EventId: event_id, UserId: user_id }
            })
            if (vote_bool) {
                console.log(vote_bool)
                vote_bool = vote_bool.voteBool ? "liked" : "disliked"
                console.log(vote_bool)
            }
            commentCount = await models.Comment.count({ where: { EventId: event_id } });
            upVote = await models.Vote.count({ where: { EventId: event_id, voteBool: true } });
            downVote = await models.Vote.count({ where: { EventId: event_id, voteBool: false } });
            eventDetails = await models.Event.findOne({
                where: { id: event_id },
                include: [
                    {
                        model: models.User,
                        as: 'user',
                    },
                ],
            });
            return Promise.resolve({ code: 200, msg: "Got Event Details", eventDetails: eventDetails, upVote: upVote, downVote: downVote, comments: comments, commentCount: commentCount, voteBool: vote_bool,views:views,report:sentimentAnalysis(arr)});
        } catch (err) {
            global.log.error(err);
            console.log(err)
            return Promise.reject(err)
        }
    }

}
module.exports = () => {
    return new EventsController()
}
