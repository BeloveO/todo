import mongoose from "mongoose";

//task schema
const taskSchema = new mongoose.Schema({
    title: {type: 'string', required: true},
    description: {type: 'string'},
    completed: {type: 'boolean', default: false, required: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date},
    dueDate: {type: Date},
    priority: {type: 'number', default: 0},
    assignedTo: {type: mongoose.Schema.Types.ObjectId},
    userId: {type: mongoose.Schema.Types.ObjectId}
});


export default mongoose.model('Task', taskSchema);

