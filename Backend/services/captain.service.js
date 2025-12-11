const Captain = require('../models/captain.model');

const createCaptain = async ({
  firstname,
  lastname,
  email,
  password,
  phone,
  vehicle 
}) => {

  if(!firstname || !lastname || !email || !password || !phone){
    throw new Error('Missing required personal information');
  }


  if(!vehicle || !vehicle.color || !vehicle.plate || !vehicle.capacity || !vehicle.vehicleType){
    throw new Error('Missing required vehicle information');
  }

 
  const captain = await Captain.create({
    fullname: {
      firstname,
      lastname
    },
    email,
    password,
    phone,
    vehicle: {
      color: vehicle.color,
      plate: vehicle.plate,
      capacity: vehicle.capacity,
      vehicleType: vehicle.vehicleType
    }
  });

  return captain;
};

module.exports = {
  createCaptain
};