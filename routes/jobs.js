const express =require('express');
const router = express.Router();

const { getAllJob,getJob,createJob,updateJob,deleteJob} = require('../controllers/jobs');
const auth = require('../middleware/authentication');

router.route('/').post(auth,createJob).get(auth,getAllJob);
router.route('/:id').get(auth,getJob).delete(auth,deleteJob).patch(auth,updateJob);

module.exports=router;