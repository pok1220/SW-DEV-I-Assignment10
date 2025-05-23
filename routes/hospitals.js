const express = require('express')
const { getHospital,getHospitals,postHospital,putHospital,deleteHospital } = require('../controller/hospitals');

const router=express.Router()

const {protect,authorize} = require('../middleware/auth')
//Include other resource
const appointmentRouter= require('./appointments')

router.use('/:hospitalId/appointments/',appointmentRouter); //ใช้ use เพราะ เราไม่ได้ใช้ route ตรงๆ hospital GET PUT แบบนั้น
//อันข้างบนมันไว้ดู โรงพยาบาลนี้มีคนจองอันไหนไปบ้าง hospitalId ตอนนี้ไม่ทำอะไร

router.route('/').get(getHospitals).post(protect,authorize('admin'),postHospital) //protect ก่อนแล้ว authorize ตามต้องใส่ตามลำดับด้วย
router.route('/:id').get(getHospital).put(protect,authorize('admin'),putHospital).delete(protect,authorize('admin'),deleteHospital)
module.exports=router; //ให้ server.js เรียกใช้

/**
 * @swagger
 * components:
 *   schemas:
 *     Hospital:
 *       type: object
 *       required:
 *         - name
 *         - address
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the hospital
 *           example: d290f1ee-6c54-4b01-90e6-d701748f0851
 *         ลำดับ:
 *           type: string
 *           description: Ordinal number
 *         name:
 *           type: string
 *           description: Hospital name
 *         address:
 *           type: string
 *           description: House No., Street, Road
 *         district:
 *           type: string
 *           description: District
 *         province:
 *           type: string
 *           description: Province
 *         postalcode:
 *           type: string
 *           description: 5-digit postal code  
 *         tel:
 *           type: string
 *           description: Telephone number
 *         region:
 *           type: string
 *           description: Region
 *       example:
 *         id: "609bda561452242d88d36e37"
 *         ลำดับ: "121"
 *         name: "Happy Hospital"
 *         address: "121 ถ.สุขุมวิท"
 *         district: "บางนา"
 *         province: "กรุงเทพมหานคร"
 *         postalcode: "10110"
 *         tel: "02-2187000"
 *         region: "กรุงเทพมหานคร (Bangkok)"
 */

/**
 *  @swagger
 *  tags:
 *      name: Hospitals
 *      description: The hospitals managing API
 */

/**
 * @swagger
 * /hospitals: 
 *  get:
 *      summary: Returns the list of all the hospitals
 *      tags: [Hospitals]
 *      responses:
 *          200:
 *              description: The list of the hospitals
 *              content:
 *                  application/json:
 *                      schema:
 *                      type: array
 *                      items:
 *                         $ref: '#/components/schemas/Hospital'
 */

/**
 * @swagger
 * /hospitals/{id}:
 *  get:
 *      summary: Get the hospital by id
 *      tags: [Hospitals]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema: 
 *              type: string
 *            required: true
 *            description: The hospital id
 *      responses:
 *          200:
 *              description: The hospital description by id
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Hospital'
 *          404:
 *              description: The hospital was not found
 */

 

/**
 * @swagger
 * /hospitals:
 *   post:
 *     summary: Create a new hospital
 *     tags:
 *       - Hospitals
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Hospital'
 *     responses:
 *       201:
 *         description: The hospital was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hospital'
 *       500:
 *         description: Some server error
 */

/**
 *  @swagger
 * /hospitals/{id}:
 *  put:
 *      summary: Update the hospital by the id
 *      tags: [Hospitals]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The hospital id
 *      requestBody:
 *          required: true
 *          content:
 *           application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Hospitals'
 *      responses:
 *          200:
 *              description: The hospital was updated
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Hospital'
 *          404: 
 *              description: The hospital was not found
 *          500:
 *              description: Some error happened
 */

/**
 * @swagger
 * /hospitals/{id}:
 *   delete:
 *     summary: Remove the hospital by id
 *     tags: 
 *       - Hospitals
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The hospital id
 *     responses:
 *       200:
 *         description: The hospital was deleted
 *       404:
 *         description: The hospital was not found
 */
