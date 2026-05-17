const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Goal = require('./src/models/Goal');
const Department = require('./src/models/Department');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Goal.deleteMany();
    await Department.deleteMany();

    // 1. Create Departments
    const depts = await Department.insertMany([
      { name: 'Engineering', description: 'Core product development' },
      { name: 'Design', description: 'UI/UX and Brand' },
      { name: 'Sales', description: 'Revenue generation' }
    ]);

    // 2. Create Users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@trackzen.com',
      password: 'password123',
      role: 'Admin',
      department: 'HR'
    });

    const manager = await User.create({
      name: 'Sarah Manager',
      email: 'manager@trackzen.com',
      password: 'password123',
      role: 'Manager',
      department: 'Engineering'
    });

    const employee = await User.create({
      name: 'John Employee',
      email: 'employee@trackzen.com',
      password: 'password123',
      role: 'Employee',
      department: 'Engineering',
      managerId: manager._id
    });

    // 3. Create Goals for John
    await Goal.insertMany([
      {
        title: 'Improve API Performance',
        description: 'Reduce average response time by 30%',
        thrustArea: 'Operational Excellence',
        uom: 'Percentage',
        target: 30,
        progress: 10,
        weightage: 40,
        status: 'Approved',
        employeeId: employee._id,
        quarter: 'Q2-2024',
        year: 2024
      },
      {
        title: 'Learn Framer Motion',
        description: 'Implement 3 major UI animations in the dashboard',
        thrustArea: 'People Development',
        uom: 'Numeric',
        target: 3,
        progress: 1,
        weightage: 30,
        status: 'Approved',
        employeeId: employee._id,
        quarter: 'Q2-2024',
        year: 2024
      },
      {
        title: 'Departmental KPI Support',
        description: 'Assist in 5 cross-functional projects',
        thrustArea: 'Innovation',
        uom: 'Numeric',
        target: 5,
        progress: 4,
        weightage: 30,
        status: 'Approved',
        employeeId: employee._id,
        quarter: 'Q2-2024',
        year: 2024
      }
    ]);

    console.log('Database Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
