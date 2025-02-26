import { useContext, useState, useEffect } from "react";
import UserContext from "./UserContext";
import { Link, Routes, Route } from "react-router-dom";
import axios from "axios";
import Logo from './images/Logo.jpg';
import Login from './Login';
import Register from './Register';
import Delete from './images/delete2.png';
import Edit from './images/edit2.png';

function Myday() {
    const userInfo = useContext(UserContext);
    const [inputValue, setInputValue] = useState('');
    const [descriptionValue, setDescriptionValue] = useState('');
    const [dueDateValue, setDueDateValue] = useState('');
    const [tasks, setTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null); 
    const [editTitle, setEditTitle] = useState(''); 
    const [editDescription, setEditDescription] = useState(''); 
    const [editDueDate, setEditDueDate] = useState(''); 


    useEffect(() => {
        axios.get('http://localhost:4000/todays_tasks', {withCredentials: true})
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

    function addTask(e) {
        e.preventDefault();
        axios.put('http://localhost:4000/tasks', {title:inputValue, description: descriptionValue, dueDate: dueDateValue}, {withCredentials:true})
            .then(response => {
                setTasks([...tasks, response.data]);
                setInputValue('');
                setDescriptionValue('');
                setDueDateValue('');
            })
    }

    function completeTask(task) {
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
        axios.delete(`http://localhost:4000/tasks/${task._id}`, {withCredentials: true})
           .then(() => {
                const updatedTasks = tasks.filter(t => t._id!== task._id);
                setTasks([...updatedTasks]);
            })
    }

    // Start editing a task
    function startEdit(task) {
        setEditingTask(task._id);
        setEditTitle(task.title);
        setEditDescription(task.description);
        setEditDueDate(task.dueDate);
    }

    // Save the edited task
    function saveEdit(task) {
        axios.put(`http://localhost:4000/tasks/${task._id}`, { title: editTitle, description: editDescription, dueDate: editDueDate }, { withCredentials: true })
            .then(() => {
                const updatedTasks = tasks.map(t => {
                    if (t._id === task._id) {
                        t.title = editTitle;
                        t.description = editDescription;
                        t.dueDate = editDueDate;
                    }
                    return t;
                });
                setTasks([...updatedTasks]);
                setEditingTask(null); // Exit edit mode
            });
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
                <h2>{new Date().toLocaleString('en-us', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'}
                )} Tasks:</h2>
                <ul>
                    {tasks.map(task => (
                        <li key={task._id}>
                            <div className="task">
                                <input type="checkbox" 
                                    checked={task.completed}
                                    onChange={() => completeTask(task)} /> 
                                <div className="content">
                                {editingTask === task._id ? (
                                        // Edit mode
                                        <div className="editmode">
                                            <div className="editinput">
                                                <input
                                                    value={editTitle}
                                                    onChange={e => setEditTitle(e.target.value)}
                                                />
                                                <input
                                                    value={editDescription}
                                                    onChange={e => setEditDescription(e.target.value)}
                                                />
                                                <input
                                                    type="date"
                                                    value={editDueDate}
                                                    onChange={e => setEditDueDate(e.target.value)}
                                                />
                                            </div>
                                            <div className="editbuttons">
                                                <button onClick={() => saveEdit(task)}>Save</button>
                                                <button onClick={() => setEditingTask(null)}>Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        // Display mode
                                        <div>
                                            <h3>
                                                {task.completed ?
                                                    <del>{task.title}</del> : task.title}
                                            </h3>
                                            <p>
                                                {task.completed ?
                                                    <del>{task.description}</del> : task.description}
                                            </p>
                                            <p>
                                                {task.completed ?
                                                    <del>{task.dueDate}</del> : task.dueDate}
                                            </p>
                                        </div>
                                    )}                      
                                </div>
                            </div>
                            <div className="icon">
                                {editingTask !== task._id && (
                                    <img src={Edit} alt="Edit" height={20} width={20} onClick={() => startEdit(task)} />
                                )}
                                <img src={Delete} alt="Delete" height={20} width={20} onClick={() => deleteTask(task)} />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Myday;