import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card'
import Accordion from 'react-bootstrap/Accordion'
import "./questionsPage.css"
import axios from "axios";
import Answers from '../answers/answers';
import { Link, Redirect } from 'react-router-dom';
import AddAnswer from '../answers/addAnswer';
import SearchBar from "../search/search"


const QuestionsPage = (props) => {

    const [questions, setQuestions] = useState([]);
    const [dbQs, setDbQs] = useState([]);
    const [qId, setQId] = useState(0)
    const [redirect, setRedirect] = useState(false);
    const [questionForId, setQuestionForId] = useState()
    const [showForm, setShowForm] = useState(false);
    const [showButton, setShowButton] = useState(true);

    useEffect(() => {
        if (props.id === undefined) {
            setShowButton(false)
        }
        const fetchData = async () => {
            const { data } = await axios.get("https://askit-go-server.herokuapp.com/api/question");
            setQuestions(data);
            setDbQs(data);
        }
        fetchData();
        return () => {
            //
        }
    }, [])

    const addLike = (e) => {
        e.preventDefault()
        const id = e.target.id
        axios.post("https://askit-go-server.herokuapp.com/api/question/like",
            { id },
            {
                headers:
                    { "Context-Type": "application/x-www-form-urlencoded" },
            }
        ).then((res) => {
            const fetchData = async () => {
                const { data } = await axios.get("https://askit-go-server.herokuapp.com/api/question");
                setQuestions(data);
            }
            fetchData();
        })
    }

    const addDislike = (e) => {
        e.preventDefault()
        const id = e.target.id
        axios.post("https://askit-go-server.herokuapp.com/api/question/dislike",
            { id },
            {
                headers:
                    { "Context-Type": "application/x-www-form-urlencoded" },
            }
        ).then((res) => {
            const fetchData = async () => {
                const { data } = await axios.get("https://askit-go-server.herokuapp.com/api/question");
                setQuestions(data);
            }
            fetchData();
        })
    }

    const setRedirectTo = (e) => {

        e.preventDefault()
        setQId(e.target.id)
        axios.get("https://askit-go-server.herokuapp.com/api/question/id", { params: { id: e.target.id } })
            .then(res => {
                console.log(res, "ress")
                setQuestionForId(res.data)
            })
        setRedirect(true)
    }

    const addAnswer = (text, id) => {
        const userId = props.id
        console.log(text, id)
        axios.post("https://askit-go-server.herokuapp.com/api/answer",
            { text, id, userId },
            {
                headers:
                    { "Context-Type": "application/x-www-form-urlencoded" },
            }
        ).then((res) => {
            window.location.reload();
        })
    }

    const searchData = (pattern) => {
        if (!pattern) {
            console.log("nema nista", questions)
            setQuestions(dbQs);
            return;
        }
        const filteredItems = questions.filter((q) => q.Title.includes(pattern) || q.User.Name.includes(pattern) || q.User.Surname.includes(pattern));
        setQuestions(filteredItems)
        console.log(pattern)
    }

    if (redirect && questionForId !== undefined) {
        console.log(questionForId)
        return <Redirect to={{
            pathname: "/answersQ",
            state: { id: qId, qForId: questionForId, fromQsPage: true, loggedUser: props.id }
        }} />
    }


    return (
        <div className="okvir">
            <div className="d-flex justify-content-between srchTitle">
                <h3 className="qs"> &nbsp; &nbsp; &nbsp; All Questions</h3>
                <SearchBar
                    placeholder="Search by title or user"
                    onChange={(e) => searchData(e.target.value)}
                />
            </div>

            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
            <Accordion className="accordion">
                {
                    questions.map(q =>
                        <Card key={q.Id}>
                            <Accordion.Toggle as={Card.Header} eventKey={q.Id} >
                                <div className="d-flex w-100 justify-content-between">
                                    <p><b>{q.Title}</b></p>
                                    <small>{q.Date}</small>
                                </div>
                                <p>Description: {q.Text}</p>
                                <p>Posted by: {q.User.Name} {q.User.Surname}</p>
                                <button onClick={addLike} className="likeBtn"><i className="fa fa-thumbs-up fa-like" id={q.Id} aria-hidden="true"></i></button> {q.Like}
                                &nbsp; &nbsp;
                                <button onClick={addDislike} className="dislikeBtn"> <i className="fa fa-thumbs-down fa-dislike" id={q.Id}></i> </button> {q.Dislike}
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey={q.Id}>
                                <Card.Body>
                                    <Answers id={q.Id} />
                                    <div className="d-flex w-100 justify-content-between">
                                        {showButton && <button className="btn btn-secondary" onClick={() => setShowForm(!showForm)}>Add answer</button>}
                                        <button className="btn btn-secondary" id={q.Id} onClick={setRedirectTo}>View all answers</button>
                                    </div>
                                    <div>
                                        {showForm && <AddAnswer id={q.Id} onAdd={addAnswer} />}
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>

                    )
                }
            </Accordion>
        </div>
    )
}

export default QuestionsPage
