import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const samplePatients = [
    {
      patientId: 'P-1001',
      name: 'Aarav Sharma',
      dob: new Date('1998-04-15'),
      gender: 'Male',
      phone: '+91 98765 11111',
      email: 'aarav@example.com',
      address: 'Bengaluru, Karnataka',
      emergencyContact: '+91 99877 22334',
      bloodGroup: 'O+',
      allergies: 'Penicillin',
      medicalHistory: 'Asthma',
      status: 'active',
    },
    {
      patientId: 'P-1002',
      name: 'Maya Iyer',
      dob: new Date('1994-09-03'),
      gender: 'Female',
      phone: '+91 98765 22222',
      email: 'maya@example.com',
      address: 'Hyderabad, Telangana',
      emergencyContact: '+91 99877 44331',
      bloodGroup: 'AB-',
      allergies: 'None',
      medicalHistory: 'None',
      status: 'admitted',
    },
  ];

  await prisma.patient.createMany({
    data: samplePatients,
    skipDuplicates: true,
  });

  const doctors = [
    {
      name: 'Dr. Aisha Kapoor',
      specialty: 'Cardiology',
      department: 'Cardiology',
      available: true,
    },
    {
      name: 'Dr. Rahul Mehta',
      specialty: 'Neurology',
      department: 'Neurology',
      available: true,
    },
  ];

  await prisma.doctor.createMany({
    data: doctors,
    skipDuplicates: true,
  });

  console.log('Seed data inserted successfully.');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
