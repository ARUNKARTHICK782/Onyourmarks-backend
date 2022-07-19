//Required Packages
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//Required Modules
const studentModel = require('../models/studentmodel');
const teacherModel = require('../models/teachermodel');
const examModel = require('../models/exammodel');
const subjectModel = require('../models/subjectmodel');
const cocurricularactivity = require('../models/cocurricularactivity');
const { ObjectID } = require('mongodb');

//DB POST - API CALL 1
router.post("/Student/add",async (req, res)=>{
    const {error} = studentModel.validateStudent(req.body);
    if(error) return res.status(404).send(error.details[0].message);

    const student = new studentModel.Student(req.body);

    await student.save()
        .then((v) => {
            res.status(200).send(v);
        });
});

//DB POST - API CALL 2
router.post("/Teacher/add",async (req, res)=>{
    const {error} = teacherModel.validateTeacher(req.body);
    if(error) return res.status(404).send(error.details[0].message);

    const teacher = new teacherModel.Teacher(req.body);

    await teacher.save()
        .then((v) => {
            res.status(200).send(v);
        });
});

//DB GET - API CALL 3
router.get("/getAll", async (req,res) => {

});

//DB POST - API CALL 4
router.post("/Exam/add", async (req,res) => {
    const {error} = examModel.validateExam(req.body);
    if(error) return res.status(404).send(error.details[0].message);

    const exam = new examModel.Exam(req.body);

    await exam.save()
        .then((v) => {
            res.status(200).send(v);
        });   
})

//DB POST - API CALL 5
router.post("/Subject/add",async (req,res)=>{
    const {error} = subjectModel.validateSubject(req.body);
    if(error) return res.status(404).send(error.details[0].message);

    const subject = new subjectModel.Subject(req.body);

    const result = await subject.save()
        .then((v)=>{
            res.status(200).send(v);
        });
});

//DB DELETE - API CALL 5
router.delete("/Student/delete",async (req,res)=>{
    await studentModel.Student.deleteOne({
        roll_no : req.body.roll_no
    }).then((v)=>res.send("Successfully deleted"))
    .catch((err)=>res.send(err.message));
});

//Deleting subject
router.delete("/Subject/delete",async (req,res)=>{
    await subjectModel.Subject.deleteOne({
        _id: req.body.id
    }).then((v)=>res.send("Successfully deleted"))
        .catch((err)=>res.send(err));
})

//DB DELETE - API CALL 6
router.delete("/Teacher/delete",async (req,res)=>{
    await teacherModel.Teacher.deleteOne({
        _id: req.body.id
    }).then((v)=>res.send("Successfully deleted"))
        .catch((err)=>res.send(err));
})

//Delete Exam
router.delete("/Exam/delete",async (req,res)=>{
    await examModel.Exam.deleteOne({
        _id: req.body.id
    }).then((v)=>res.send("Successfully deleted"))
        .catch((err)=>res.send(err));
})
    
    //DB UPDATE - API CALL 7
router.put('/Teacher/update/:id', async (req,res) => {
    const teacherToBeUpdated = teacherModel.Teacher.find({
            _id: ObjectId(req.params.id)
    });

    res.send(teacherToBeUpdated);
});

// Getting Teacher details

router.get('/Teacher/:id',async (req,res)=>{
    try{
        const teacher = await teacherModel.Teacher.findById(req.params.id);
        if(!teacher) return res.status(404).send("Teacher not found");
        res.send(teacher);
    }
    catch(err){
        res.status(400).send("Invalid id");
    }
});

// Getting Student details

router.get('/Student/:roll_no',async (req,res)=>{
    try{
        const student = await studentModel.Student.findOne({
            roll_no : req.params.roll_no
        }).populate('marks.subject_id',['sub_name']);
        console.log(student);
        if(!student) return res.status(404).send("Student not found");
        res.send(student);
    }
    catch(err){
        console.log(err);
        res.status(400).send(err);
    }
});

// Getting Student's Co-Curricular Activities

router.get('/get-cca/:condition', async(req,res)=>{
    var condition = false;
    if(req.params.condition === "true"){
        condition = true;
    }
    const cca = await cocurricularactivity.coCurricularActivity
            .find({isVerified:condition})
            .populate('student_id',['roll_no','name']);
    res.send(cca);
})

module.exports = router;