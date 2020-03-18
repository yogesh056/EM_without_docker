const models = require('../models')
class ForumController {
    // Create User
    async add(data) {
            try {
                const {
                    userId,
                    cateogory,
                    image,
                    description,
                } = data;

                let response=await models.Questions.create({
                    UserId: userId,
                    description: description,
                    image: image,
                    cateogory: cateogory,
                })
                return Promise.resolve({ code: 200, msg: "Question Created Successfully" });

            } catch (err) {
                global.log.error(err);
                console.log(err)
                return Promise.reject()
            }
    }
    async vote(data) {

        try {
            const {
                user_id,
                answer_id,
                vote_bool
            } = data;
            let message, response,
            matchVote = await models.AnswerVote.findOne({ where: { UserId: user_id, AnswerId: answer_id, voteBool: vote_bool } });
            if (matchVote) {
                matchVote.destroy()
                message = "DeVoted Succesfully"
                this.voteCalc(!vote_bool, answer_id)
            }
            else {
                let match = await models.AnswerVote.findOne({ where: { UserId: user_id, AnswerId: answer_id } })
                // Check if record exists in db
                if (match) {
                    response = await match.update({
                        voteBool: vote_bool
                    })
                    message = "Voted Updated Succesfully";
                    this.voteCalc(vote_bool, answer_id)

                }
                else {

                    response = await models.AnswerVote.create({
                        UserId: user_id, AnswerId: answer_id, voteBool: vote_bool
                    })
                    message = "Voted Successfully"
                    this.voteCalc(vote_bool, answer_id)

                }

            }
            return Promise.resolve({ code: 200, msg: message, response: response });

        } catch (err) {
            global.log.error(err);
            console.log(err)
            return Promise.reject(err)
        }
    }
    async voteCalc(voteBool, answer_id) {
        try{
        let vote;
        if (voteBool) { 
            vote = await models.Answers.increment('vote', { where: { id: answer_id } }); 
            console.log("UPPP--------",vote)
        }
        else {
            vote = await models.Answers.decrement('vote', { where: { id: answer_id } });
            console.log("Dwom--------",vote)
        }
    }
    catch(e)
    {
        console.log(e)
        global.log.error(err);
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
            response = await models.Questions.findAll({
                include: [
                    {
                        model: models.User,
                        as: 'user',
                    },
                    // {
                    //     model: models.Comment,
                    //     as: 'comments',
                    // },
                ],
            })
            return Promise.resolve({ code: 200, msg: "Got all Questions", response: response });

        } catch (err) {
            global.log.error(err);
            console.log(err)
            return Promise.reject(err)
        }
    }
    async answer(data) {

        try {
            const {
                user_id,
                question_id,
                answer,
            } = data;
            let response = await models.Answers.create({
                UserId: user_id, QuestionId: question_id, description:answer, vote: 0
            })

            return Promise.resolve({ code: 200, msg: "Answer Added" });

        } catch (err) {
            global.log.error(err);
            console.log(err)
            return Promise.reject(err)
        }
    }
    async getQuestionDetails(data) {
        const {
            question_id,
            user_id
        } = data;

        try {
            let answers, answersCount, questionDetails
            answers = await models.Answers.findAll({
                where: { QuestionId: question_id }, include: [
                    {
                        model: models.User,
                        as: 'user'
                    }
                ]
            })
            console.log(answers)
            answersCount = await models.Answers.count({ where: { QuestionId: question_id } });
            // upVote = await models.AnswerVote.count({ where: { AnswerId: question_id, voteBool: true } });
            // downVote = await models.AnswerVote.count({ where: { AnswerId: question_id, voteBool: false } });
            questionDetails = await models.Questions.findOne({
                where: { id: question_id },
                include: [
                    {
                        model: models.User,
                        as: 'user',
                    },
                ],
            });
            return Promise.resolve({ code: 200, msg: "Got Question Details", questionDetails: [questionDetails], answers: answers, answersCount: answersCount });
        } catch (err) {
            global.log.error(err);
            console.log(err)
            return Promise.reject(err)
        }
    }

}
module.exports = () => {
    return new ForumController()
}
