//Put Model file
const Appointment = require('../models/Appointment');
const Hospital= require('../models/Hospital');

//@desc Get all hospitals
//@route GET /api/v1/hospitals
//@access Public
exports .getHospitals=async (req,res,next)=>{
    try{
        let query;
        // console.log(req.query) //ไม่แน่ใจเหมือนกันทำไปเพื่ออะไร
        const reqQuery= {...req.query} //แตก query เป็นส่วนๆ { select: 'province,address', address: { gte: 'C' } }
        // console.log(reqQuery)

        //ลบ Field ออก เพราะ จะทำ เพื่อ search ก่อน
        const removeFields=['select','sort']

        //Loop เพื่อ remove select sort
        removeFields.forEach(param=> delete reqQuery[param])
        // console.log(reqQuery) //เหลืออะไรบ้าง

        let queryStr=JSON.stringify(req.query);
        queryStr=queryStr.replace(/\b(gt|gte|lt|lte|e)\b/g,match=>`$${match}`); // ใส่ $ ให้ถูกต้องตาม syntax no sql
        query = Hospital.find(JSON.parse(queryStr)).populate('appointments');//db

        //Select Field
        if(req.query.select){
            const fields=req.query.select.split(',').join(' ')
            query=query.select(fields)
        }

        //Sort Feilds
        // console.log(req.query)
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            query=query.sort(sortBy);
            // console.log(sortBy) //name address
        }else{ //ไม่มีการ sort เรียงตาม createdAt
            query=query.sort('-createdAt');
        }

        //Pagination เปลี่ยนหน้าใน frontend
        const page=parseInt(req.query.page,10) ||1; // 10 นี้คือเลขฐาน 10
        const limit=parseInt(req.query.limit,10)||25; //หน้าละ 25 ตัว ถ้าไม่ระบุมา

        const startIndex=(page-1)*limit
        const endIndex=(page-1)*limit
        
        try{
            const total= await Hospital.countDocuments();
            query=query.skip(startIndex).limit(limit); //off set ไปเริ่มที่ startIndex และ เอามา limit ตัว
            const hospital= await query;

            //Pagination result
            const pagination={};

            if(endIndex<total){
                pagination.next={
                    page:page+1,
                    limit
                }
            }
            if(startIndex>0){
                pagination.prev={
                    page:page-1,
                    limit
                }
            }
            res.status(200).json({success:true,pagination,count:hospital.length,data:hospital})
        }
        catch(err){
            res.status(400).json({success:false})
        }
    }
    catch(err){
        res.status(400).json({success:false})
    }
}
//@desc Get hospital
//@route GET /api/v1/hospitals/:id
//@access Public
exports .getHospital=async (req,res,next)=>{
    try{
        const hospital= await Hospital.findById(req.params.id);
        if(!hospital){ //กรณีหาไม่เจอ
            return  res.status(400).json({success:false})
        }
        res.status(200).json({success:true,data:hospital})
    }
    catch{
        res.status(400).json({success:false})
    }
}
//@desc Post hospital
//@route POST /api/v1/hospitals
//@access Private
exports .postHospital= async (req,res,next)=>{
    // console.log(req.body)
    try{
        const hospital = await Hospital.create(req.body)
        res.status(201).json({success:true,data:hospital})
    }catch{
        res.status(400).json({success:false,text:"created failed"})
    }
}
//@desc Update hospital
//@route PUT /api/v1/hospitals/:id
//@access Private
exports .putHospital= async (req,res,next)=>{
    try{
        const hospital = await Hospital.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        })
        if(!hospital){
            return res.status(400).json({success:false})
        }
        res.status(200).json({success:true, data:hospital})
    }catch{
        res.status(400).json({success:false})
    }
}
//@desc Delete hospital
//@route DELETE /api/v1/hospitals/:id
//@access Private
exports .deleteHospital=async (req,res,next)=>{
    try{
        const hospital = await Hospital.findById(req.params.id) //หา ก่อน
        console.log(hospital) //Print โรงพยาบาลที่ลบ
        if(!hospital){ //กรณีไม่เจอก็ Handler  400 
            console.log("Not found")
            return res.status(400).json({success:false})
        }
        await Appointment.deleteMany({hospital:req.params.id}); //ลบ appointment  ทั้งหมดที่เกี่ยวกับ รพ. นี้
        await Hospital.deleteOne({_id:req.params.id}) //แล้วจึงลบ รพ.
        res.status(200).json({success:true,data:{}})
    }catch{
        res.status(400).json({success:false})
    }
}
