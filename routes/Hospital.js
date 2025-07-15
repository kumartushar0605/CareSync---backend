import express from "express"
import { deleteEquipment, deleteFacility, Hospitalregister } from "../Controllers/Hospital.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { HospitalLogin ,updateEquipment,updateFacilities,getAllHospitals,getHospitalById,addDepartment,addDoctor,deleteDepartment,deleteDoctor,getDoctorsByHospitalId,getDepartmentsByHospitalId,updateBedCount} from "../Controllers/Hospital.js";
const router = express.Router();

router.post("/Hospital/Register",Hospitalregister);
router.post("/Hospital/Login",HospitalLogin);

router.put('/hospitals/:id/departments/:department/equipment', updateEquipment);
router.put('/hospitals/:id/departments/:department/facilities', updateFacilities);
router.put('/hospitals/:id/departments', addDepartment);
router.put('/hospitals/:id/departments/:department/doctors', addDoctor);
router.get('/hospitals', getAllHospitals);
router.get('/hospitals/:id', getHospitalById);

router.delete('/hospitals/:id/departments/:department', deleteDepartment);
router.delete('/hospitals/:hospitalId/doctors/:doctorName/Department/:dept', deleteDoctor);
router.get('/hospitals/:id/doctors', getDoctorsByHospitalId);
router.get('/hospitals/:id/departments', getDepartmentsByHospitalId);
router.delete("/hospitals/:hospitalId/departments/:departmentName/equipment/:equipmentName",deleteEquipment)
router.delete("/hospitals/:hospitalId/departments/:departmentName/facilities/:facility",deleteFacility)


router.patch('/hospitals/:id/departments/:department', updateBedCount);
// const doctorRoutes = require('./routes/doctors');





export default router;