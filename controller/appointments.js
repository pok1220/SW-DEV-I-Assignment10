const Appointment = require('../models/Appointment')
const Hospital = require('../models/Hospital')
//@desc Get all appointments
//@route GET /api/v1/appointments
//@access Private


exports.getAppointments=async (req,res,next)=>{
    let query;
    //check user mี่เข้ามาเป็น admin ไหม ถ้า admin เห็นของทุกคน
    if(req.user.role!='admin'){
        query=Appointment.find({user:req.user.id}).populate({
            path:'hospital',
            select: 'name province tel'
        });
    }else{
        if(req.params.hospitalId){ //ถ้ามี hospitalID มา อันนี้สำหรับ admin
            console.log(req.params.hospitalId)
            query= Appointment.find({hospital:req.params.hospitalId}).populate({
                path:'hospital',
                select: 'name province tel'
            })
        }else{
            query=Appointment.find().populate({
                path:'hospital',
                select: 'name province tel'
            });
        }
    }
    
    try{
        const appointments=await query;
        res.status(200).json({
            success:true,
            count: appointments.length,
            data: appointments
        })
    }catch(err){
        console.log(err.stack);
        res.status(500).json({
            success:false,
            message: "Cannot find Appointment"
        })
    }
}
//@desc Get appointment
//@route GET /api/v1/appointment
//@access Public
exports.getAppointment= async (req,res,next)=>{
    try{
        const appointment= await Appointment.findById(req.params.id).populate({
            path:'hospital',
            select: 'name description tel'
        })
        if(!appointment){
            return res.status(404).json({success:false,message:`No appointment with id of ${req.params.id}`})
        }

        res.status(200).json({
            success:true,
            data: appointment
        })
    }catch(err){
        console.log(err.stack)
        return res.status(500).json({success:false,message:"Cannot find Appointment"})
    }
}
//@desc Get appointment
//@route GET /api/v1/appointment
//@access Private
exports.addAppointment= async (req,res,next)=>{
    try{
        req.body.hospital=req.params.hospitalId

        req.body.user=req.user.id //user คนที่ login เท่านั้นที่ add ได้
        const existedAppointment=await Appointment.find({user:req.user.id})
        if(existedAppointment.length>=3 && req.user.role!=='admin'){
            return res.status(400).json({success:false,message:`The user with id of ${req.user.id} has already made 3 appointment`})
        }

        console.log("length",existedAppointment.length)
        console.log('role',req.user.role)

        //Check if has hospital id
        // console.log(req.body)
        const hospital= await Hospital.findById(req.params.hospitalId)
        if(!hospital){
            return res.status(404).json({success:false,message:`No hospital with id of ${req.params.hospitalId}`})
        }


     
        const appointment=await Appointment.create(req.body);
        res.status(200).json({success:true,data:appointment})

    }catch(err){
        console.log(err.stack)
        return res.status(500).json({success:false,message:"Cannot create an appointment"})
    }

}

//@desc Delete appointment
//@route DELETE /api/v1/appointment/:id
//@access Private
exports.deleteAppointment=async (req,res,next)=>{
    try{
        const appointment= await Appointment.findById(req.params.id)
        
        //check if it has
        if(!appointment){
            return res.status(404).json({success:false,message:`No appoint with id of ${req.params.id}`})
        }

        //Make sure user is the appointment owner
        if(appointment.user.toString()!==req.user.id && req.user.role !=='admin'){
            return res.status(401).json({success:true,message:`The user with id of ${req.user.id} is not authorized to update this appointment`})
        }

        await appointment.deleteOne();
        res.status(200).json({
            success:true,
            data:{}
        })
    }catch(error){
        console.log(error.stack)
        return res.status(500).json({success:false,message:"Cannot delete appointment"})
    }
}

//@desc Update appointment
//@route UPDATE /api/v1/appointment/:id
//@access Private
exports.updateAppointment=async (req,res,next)=>{
    try{
        let appointment= await Appointment.findById(req.params.id)
        
        //check if it has
        if(!appointment){
            return res.status(404).json({success:false,message:`No hospital with id of ${req.params.id}`})
        }

        //Make sure user is the appointment owner
        if(appointment.user.toString()!=req.user.id && req.user.role !='admin'){
            return res.status(401).json({success:true,message:`The user with id of ${req.user.id} is not authorized to update this appointment`})
        }
        appointment =await Appointment.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });
        res.status(200).json({
            success:true,
            data: appointment
        })
    }catch(error){
        console.log(error.stack)
        return res.status(500).json({success:false,message:"Cannot update appointment"})
    }
}