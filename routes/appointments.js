const express = require('express')
const {getAppointments,getAppointment,addAppointment,updateAppointment,deleteAppointment}= require('../controller/appointments')


const router= express.Router({mergeParams:true}) //mergeParam รับ parma จาก parent ได้

const {protect, authorize}=require('../middleware/auth');

router.route('/').get(protect,getAppointments).post(protect,authorize('admin','user'),addAppointment)
router.route('/:id').get(protect,getAppointment).delete(protect,authorize('admin','user'),deleteAppointment).put(protect,authorize('admin','user'),updateAppointment)


module.exports=router;