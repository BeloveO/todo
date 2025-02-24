import mongoose from "mongoose";

//task schema
const taskSchema = new mongoose.Schema({
    title: {type: 'string', required: true},
    description: {type: 'string'},
    completed: {type: 'boolean', default: false, required: true},
    dueDate: {type: 'string'},
    priority: {type: 'number', default: 0},
    userId: {type: mongoose.Schema.Types.ObjectId}
});


export default mongoose.model('Task', taskSchema);

