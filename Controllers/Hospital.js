import { HospitalSchema } from "../models/Hospital.js";
import { sendCookie } from "../utils/features.js";


export const Hospitalregister = async(req,res)=>{
    try {
        const { hospitalName, state, city, pincode, contactNumber, password } = req.body;

        // Check if hospital already exists
        const existingHospital = await HospitalSchema.findOne({ contactNumber });
      
        if (existingHospital) {
          return res.status(400).json({ message: "Hospital already registered!" });
        }
    
        // Hash password
       
    
        // Create new hospital
        const newHospital = new HospitalSchema({
          hospitalName,
          state,
          city,
          pincode,
          contactNumber,
          password
        });
   
        await newHospital.save();
        sendCookie(newHospital,res,"Registerd succesfully",201);
    
      
      } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
      }
};


// backend/controllers/hospitalController.js

export const HospitalLogin = async (req, res) => {
  try {
    const { contactNumber, password } = req.body;

    // Check if hospital exists
    const hospital = await HospitalSchema.findOne({ contactNumber });
    if (!hospital) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    if (password !== hospital.password) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    // Send cookie (assuming this function sets JWT cookie)
   
    sendCookie(hospital, res, "Login successfully", 201);

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all hospitals
export const getAllHospitals = async (req, res) => {
  try {
      const hospitals = await HospitalSchema.find();
      res.json(hospitals);
  } catch (error) {
      res.status(500).json({ message: 'Server Error', error });
  }
};

export const getHospitalById = async (req, res) => {
  try {
      const hospital = await HospitalSchema.findById(req.params.id);
      if (!hospital) {
          return res.status(404).json({ message: 'Hospital not found' });
      }
      res.status(200).json(hospital);
  } catch (error) {
      res.status(500).json({ message: 'Server Error', error });
  }
};


// Add a new department to a hospital
export const addDepartment = async (req, res) => {
  try {
      const hospital = await HospitalSchema.findById(req.params.id);
      if (!hospital) {
          return res.status(404).json({ message: 'Hospital not found' });
      }

      const {  totalBeds, availableBeds,name } = req.body;

      const newDepartment = {
        name,
          totalBeds,
          availableBeds,
          equipment:[],
          facilities:[],
          doctors: []
      };

      hospital.departments.push(newDepartment);
      await hospital.save();

      res.status(201).json({ message: 'Department added', newDepartment });
  } catch (error) {
      res.status(500).json({ message: 'Server Error', error });
  }
};


// Add a doctor to a specific department
export const addDoctor = async (req, res) => {
  try {
      const hospital = await HospitalSchema.findById(req.params.id);
      if (!hospital) {
          return res.status(404).json({ message: 'Hospital not found' });
      }

      const department = hospital.departments.find(dept => dept.name === req.params.department);
      if (!department) {
          return res.status(404).json({ message: 'Department not found' });
      }

      const { name, specialization, availability } = req.body;

      const newDoctor = { name, specialization, availability };

      department.doctors.push(newDoctor);
      await hospital.save();

      res.status(201).json({ message: "Doctor added", doctor: newDoctor });
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error });
  }
};


export const updateEquipment = async (req, res) => {
    try {
      const { id, department } = req.params;
      const { name } = req.body; // Equipment name from request body
  
      const hospital = await HospitalSchema.findById(id);
      if (!hospital) {
        return res.status(404).json({ message: 'Hospital not found' });
      }
  
      const departmentObj = hospital.departments.find(dept => dept.name === department);
      if (!departmentObj) {
        return res.status(404).json({ message: 'Department not found' });
      }
  
      departmentObj.equipment.push(name); // Add equipment to the department
      await hospital.save();
  
      res.status(200).json({ message: 'Equipment added', updatedEquipment: departmentObj.equipment });
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error });
    }
  };

export const updateFacilities = async (req, res) => {
  try {
      const hospital = await HospitalSchema.findById(req.params.id);
      if (!hospital) {
          return res.status(404).json({ message: 'Hospital not found' });
      }

      const departmentObj = hospital.departments.find(dept => dept.name === req.params.department);
      console.log(departmentObj)
      if (!departmentObj) {
          return res.status(404).json({ message: 'Department not found' });
      }

      const { facilities } = req.body;console.log(facilities)
    
      if (!facilities ) {
          return res.status(400).json({ message: 'Enter Facilities' });
      }

      departmentObj.facilities.push(facilities);
            await hospital.save();

      res.status(200).json({ message: 'Facilities updated successfully'});
  } catch (error) {
      res.status(500).json({ message: 'Server Error', error });
  }
};



export const deleteDepartment = async (req, res) => {
  try {
      const hospital = await HospitalSchema.findById(req.params.id);
      if (!hospital) {
          return res.status(404).json({ message: 'Hospital not found' });
      }

      const departmentIndex = hospital.departments.findIndex(
        (dept) => dept.name === req.params.department
      );

      if (departmentIndex === -1) {
          return res.status(404).json({ message: 'Department not found' });
      }

      hospital.departments.splice(departmentIndex, 1);
      await hospital.save();

      res.status(200).json({ message: 'Department deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Server Error', error });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const hospital = await HospitalSchema.findById(req.params.hospitalId);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }
    // Find the department that contains the doctor
    const department = hospital.departments.find(dept =>
      dept.doctors.some(doc => doc.name === req.params.doctorName)
    );

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    // Remove the doctor from the department
    department.doctors = department.doctors.filter(
      (doc) => doc.name !== req.params.doctorName
    );

    await hospital.save();

    res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};


export const getDoctorsByHospitalId = async (req, res) => {
  try {
      const hospital = await HospitalSchema.findById(req.params.id);

      if (!hospital) {
          return res.status(404).json({ message: 'Hospital not found' });
      }

      // Extract all doctors from all departments
      let doctors = [];
      hospital.departments.forEach(dept => {
          dept.doctors.forEach(doc => {
              doctors.push({
                  _id: doc._id,
                  name: doc.name,
                  specialization: doc.specialization,
                  availability: doc.availability,
                  department: {
                      _id: dept._id,
                      name: dept.name
                  }
              });
          });
      });

      res.status(200).json(doctors);
  } catch (error) {
      res.status(500).json({ message: 'Server Error', error });
  }
};


export const getDepartmentsByHospitalId = async (req, res) => {
  try {
      const hospital = await HospitalSchema.findById(req.params.id);

      if (!hospital) {
          return res.status(404).json({ message: 'Hospital not found' });
      }

      res.status(200).json(hospital.departments); // Return all departments
  } catch (error) {
      res.status(500).json({ message: 'Server Error', error });
  }
};

export const updateBedCount = async (req, res) => {
    try {
        const { department, id } = req.params; // Get department name & hospital ID
        const { totalBeds, availableBeds } = req.body;

        const hospital = await HospitalSchema.findById(id);
        if (!hospital) return res.status(404).json({ message: "Hospital not found" });

        // Find department
        const departmentObj = hospital.departments.find(dept => dept.name === department);
        if (!departmentObj) return res.status(404).json({ message: "Department not found" });

        // Update fields dynamically
        if (totalBeds !== undefined) departmentObj.totalBeds = totalBeds;
        if (availableBeds !== undefined) departmentObj.availableBeds = availableBeds;

        await hospital.save();

        res.status(200).json({ message: "Bed count updated", department: departmentObj });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

//Delete Equipment

export const deleteEquipment = async (req, res) => {
  const { hospitalId, departmentName, equipmentName } = req.params;
  try {
      const hospital = await HospitalSchema.findById(hospitalId);
      if (!hospital) {
          return res.status(404).json({ message: "Hospital not found" });
      }

      const department = hospital.departments.find(dep => dep.name === departmentName);
      if (!department) {
          return res.status(404).json({ message: "Department not found" });
      }

      department.equipment = department.equipment.filter(eq => eq !== equipmentName);
      await hospital.save();

      res.status(200).json({ message: "Equipment removed successfully" });
  } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete Facility

export const deleteFacility = async (req, res) => {
  const { hospitalId, departmentName, facility } = req.params;
  try {
      const hospital = await HospitalSchema.findById(hospitalId);
      if (!hospital) {
          return res.status(404).json({ message: "Hospital not found" });
      }

      const department = hospital.departments.find(dep => dep.name === departmentName);
      if (!department) {
          return res.status(404).json({ message: "Department not found" });
      }

      department.facilities = department.facilities.filter(eq => eq !== facility);
      await hospital.save();

      res.status(200).json({ message: "Facility removed successfully" });
  } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
  }
};

