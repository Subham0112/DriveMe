const Captain = require('../models/captain.model');

const createCaptain = async ({firstname,lastname,email,password,phone,color,plate,capacity,vehicleType}) => {
  if(!firstname || !lastname || !email || !password || !phone || !color || !plate || !capacity || !vehicleType){
    throw new Error('Missing required fields');
  }
  const createCaptain=Captain.create({
    fullname:{
      firstname,
      lastname
    },
    email,
    password,
    phone,
    vehicle:{
      color,
      plate,
      capacity,
      vehicleType
    }
  })

  return createCaptain;

}

module.exports = {
  createCaptain
};