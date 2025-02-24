import { useContext, useState, useEffect } from "react";
import UserContext from "./UserContext";
import { Link, Routes, Route } from "react-router-dom";
import axios from "axios";
import Logo from './images/Logo.jpg';
import Login from './Login';
import Register from './Register';
import Delete from './images/delete2.png';
import Edit from './images/edit2.png';

function Completed() {
    const userInfo = useContext(UserContext);
    const [inputValue, setInputValue] = useState('');
    const [descriptionValue, setDescriptionValue] = useState('');
    const [dueDateValue, setDueDateValue] = useState('');
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:4000/completed_tasks', {withCredentials: true})
           .then(response => {
                setTasks(response.data);
            })
           .catch(err => console.error(err));
    }, []);


    if (!userInfo.username) {
        return (
            <div>
                <div className="home">
                <div className="landing">
                    <h1>Welcome to<br /> MABCE'S QUEST</h1>
                    <h2>Click below to login securely</h2>
                    <nav>
                        <Link to="/login">
                            <button>Login</button>
                        </Link>
                    </nav>
                    <p>Don't have an account? <Link to="/register">Register</Link></p>
                </div>
                <div className="background">
                    <img src={Logo} alt="Logo"/>
                </div>
            </div>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
            </div>
        );
    }

    // TODO: Implement CRUD operations for tasks
    function addTask(e) {
        e.preventDefault();
        // Add task to the database
        axios.put('http://localhost:4000/tasks', {title:inputValue, description: descriptionValue, dueDate: dueDateValue}, {withCredentials:true})
            .then(response => {
                setTasks([...tasks, response.data]);
                setInputValue('');
                setDescriptionValue('');
                setDueDateValue('');
            })
    }

    function completeTask(task) {
        // Mark task as completed in the database
        axios.post(`http://localhost:4000/tasks`, {id:task._id, completed:!task.completed}, {withCredentials: true})
           .then(() => {
                const updatedTasks = tasks.map(t => {
                    if (t._id === task._id) {
                        t.completed = !t.completed;
                    }
                    return t;
                });
                setTasks([...updatedTasks]);
            })
    }

    function deleteTask(task) {
        // Delete task from the database
        axios.delete(`http://localhost:4000/tasks/${task._id}`, {withCredentials: true})
           .then(() => {
                const updatedTasks = tasks.filter(t => t._id!== task._id);
                setTasks([...updatedTasks]);
            })
    }


    return (
        <div className="homepage">
            <div className="taskform">
                <form onSubmit={e => addTask(e)}>
                    <input placeholder="Add Task" value={inputValue} onChange={e => setInputValue(e.target.value)} />
                    <input placeholder="Description of task" value={descriptionValue} onChange={e => setDescriptionValue(e.target.value)}/>
                    <input type="date" value={dueDateValue} onChange={e => setDueDateValue(e.target.value)}/>
                    <button type="submit">Add</button>
                </form>
            </div>
            <div className="tasklist">
                <h2>Completed Tasks:</h2>
                <ul>
                    {tasks.map(task => (
                        <li>
                            <div className="task">
                                <input type="checkbox" 
                                    checked={task.completed}
                                    onClick={() => completeTask(task)} />
                                <div className="content">
                                    <h3>
                                        {task.completed ? 
                                        <del>
                                            {task.title}
                                        </del> : task.title}
                                    </h3>
                                    <p>
                                        {task.completed ? 
                                        <del>
                                            {task.description}
                                        </del> : task.description}
                                    </p>
                                    <p>
                                        {task.completed ?
                                        <del>
                                            {task.dueDate}
                                        </del> : task.dueDate}
                                    </p>                            
                                </div>
                            </div>
                            <div>
                                <img src={Delete} alt="Delete" height={20} width={20} onClick={() => deleteTask(task)} />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Completed;