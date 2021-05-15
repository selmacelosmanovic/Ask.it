import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './answersForQuestion.css'
import swal from 'sweetalert'

const AnswersForQuestion = (props) => {
    const [answers, setAnswers] = useState([])
    const [qTitle, setQTitle] = useState('')
    const [qText, setQText] = useState('')
    const [qDate, setQDate] = useState('')
    const [qLike, setQLike] = useState(0)
    const [qDislike, setQDislike] = useState(0)
    const [noAnswers, setNoAnswers] = useState(0)

    useEffect(() => {
        console.log(props)
        axios.get("/api/question/answers", { params: { id: props.location.state.id } })
            .then(res => {
                setAnswers(res.data)

                if (answers.length === 0 && res.data.length !== 0) {
                    setQTitle(res.data[0].Question.Title)
                    setQText(res.data[0].Question.Text)
                    setQDate(res.data[0].Question.Date)
                    setQLike(res.data[0].Question.Like)
                    setQDislike(res.data[0].Question.Dislike)
                    setNoAnswers(res.data.length)
                    /*if(noAnswers === 0) {
                        swal("There are no answers for the selected question!")
                    }*/
                }
                else if (answers.length !== 0) {
                    setQTitle(answers[0].Question.Title)
                    setQText(answers[0].Question.Text)
                    setQDate(answers[0].Question.Date)
                    setQLike(answers[0].Question.Like)
                    setQDislike(answers[0].Question.Dislike)
                    setNoAnswers(answers.length)
                    /*if(noAnswers === 0) {
                        swal("There are no answers for the selected question!")
                    }*/
                }

                if (props.location.state.fromQsPage === true) {
                    setQTitle(props.location.state.qForId.Title)
                    setQText(props.location.state.qForId.Text)
                    setQDate(props.location.state.qForId.Date)
                    setQLike(props.location.state.qForId.Like)
                    setQDislike(props.location.state.qForId.Dislike)
                    //setNoAnswers(res.data.length)
                }

            });
        return () => {

        }
    }, [props.location.state.id])

    const addLike = (e) => {
        e.preventDefault()
        const id = e.target.id
        console.log(id)
        axios.post("/api/answer/like",
            { id },
            {
                headers:
                    { "Context-Type": "application/x-www-form-urlencoded" },
            }
        ).then((res) => {
            const fetchData = async () => {
                const { data } = await axios.get("/api/question/answers", { params: { id: props.location.state.id } });
                setAnswers(data);
            }
            fetchData();
        })
    }

    const addDislike = (e) => {
        e.preventDefault()
        const id = e.target.id
        console.log(id)

        axios.post("/api/answer/dislike",
            { id },
            {
                headers:
                    { "Context-Type": "application/x-www-form-urlencoded" },
            }
        ).then((res) => {
            const fetchData = async () => {
                const { data } = await axios.get("/api/question/answers", { params: { id: props.location.state.id } });
                setAnswers(data);
            }
            fetchData();
        }) 
    }

    return (
        <div>
            <div className="qDiv">
                <p className="qTitle"><b>Question title:</b> {qTitle}</p>
                <p><b>Question text:</b> {qText}</p>
                <p><b>Posted on:</b> {qDate}</p>
                <p><b>Likes:</b> {qLike}</p>
                <p><b>Dislikes:</b> {qDislike}</p>
                <p><b>Number of answers:</b> {noAnswers}</p>
            </div>

            <div className="list-group-my">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
                <br></br>
                <br></br>
                <h5 className="naslovh5"><b>Answers:</b></h5>
                {
                    answers.map(a =>
                        <div key={a.Id} className="list-group-item list-group-item-action flex-column align-items-start">
                            <div className="d-flex w-100 justify-content-between">
                                <p className="mb-2">{a.Text}</p>
                            </div>
                            <div className="d-flex w-100 justify-content-between">
                                <p className="mb-2"><b>Posted by:</b> {a.User.Name} {a.User.Surname}</p>
                                <small>{a.Date}</small>
                            </div>
                            <div className="alignLeft">
                                <button onClick={addLike} className="likeBtn"><i className="fa fa-thumbs-up fa-like" id={a.Id} aria-hidden="true"></i></button> {a.Like}
                                <button onClick={addDislike} className="dislikeBtn"> <i className="fa fa-thumbs-down fa-dislike" id={a.Id}></i> </button> {a.Dislike}
                            </div>

                        </div>
                    )
                }

            </div>
        </div>
    )
}

export default AnswersForQuestion
