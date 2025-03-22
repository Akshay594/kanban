// ./backend/prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting to seed database...');
  
  // Create a default board
  const board = await prisma.board.create({
    data: {
      name: 'Platform Launch',
    },
  });
  
  console.log('Created board:', board);
  
  // Create columns
  const todoColumn = await prisma.column.create({
    data: {
      name: 'TODO',
      boardId: board.id,
    },
  });
  
  const doingColumn = await prisma.column.create({
    data: {
      name: 'DOING',
      boardId: board.id,
    },
  });
  
  const doneColumn = await prisma.column.create({
    data: {
      name: 'DONE',
      boardId: board.id,
    },
  });
  
  console.log('Created columns');
  
  // Create tasks for Todo column
  await prisma.task.createMany({
    data: [
      {
        title: 'Build UI for onboarding flow',
        description: 'Create screens for onboarding process',
        columnId: todoColumn.id,
        position: 0,
      },
      {
        title: 'Build UI for search',
        description: 'Create search component and results page',
        columnId: todoColumn.id,
        position: 1,
      },
      {
        title: 'Build settings UI',
        description: 'Create UI for user settings page',
        columnId: todoColumn.id,
        position: 2,
      },
      {
        title: 'QA and test all major user journeys',
        description: 'Ensure all critical paths work correctly',
        columnId: todoColumn.id,
        position: 3,
      },
    ],
  });
  
  // Create tasks for Doing column
  await prisma.task.createMany({
    data: [
      {
        title: 'Design settings and search pages',
        description: 'Create wireframes and mockups',
        columnId: doingColumn.id,
        position: 0,
      },
      {
        title: 'Add account management endpoints',
        description: 'Create API endpoints for account operations',
        columnId: doingColumn.id,
        position: 1,
      },
      {
        title: 'Design onboarding flow',
        description: 'Create user onboarding journey',
        columnId: doingColumn.id,
        position: 2,
      },
      {
        title: 'Add search endpoints',
        description: 'Create search API endpoints',
        columnId: doingColumn.id,
        position: 3,
      },
      {
        title: 'Add authentication endpoints',
        description: 'Create login and signup endpoints',
        columnId: doingColumn.id,
        position: 4,
      },
      {
        title: 'Research pricing points',
        description: 'Compare competitor pricing models',
        columnId: doingColumn.id,
        position: 5,
      },
    ],
  });
  
  // Create tasks for Done column
  await prisma.task.createMany({
    data: [
      {
        title: 'Conduct 5 wireframe tests',
        description: 'Get user feedback on wireframes',
        columnId: doneColumn.id,
        position: 0,
      },
      {
        title: 'Create wireframe prototype',
        description: 'Build interactive wireframe',
        columnId: doneColumn.id,
        position: 1,
      },
      {
        title: 'Review results of usability tests',
        description: 'Analyze test results and iterate',
        columnId: doneColumn.id,
        position: 2,
      },
      {
        title: 'Create paper prototypes',
        description: 'Build paper mockups for testing',
        columnId: doneColumn.id,
        position: 3,
      },
      {
        title: 'Market discovery',
        description: 'Research market needs and opportunities',
        columnId: doneColumn.id,
        position: 4,
      },
      {
        title: 'Competitor analysis',
        description: 'Analyze key competitors in the market',
        columnId: doneColumn.id,
        position: 5,
      },
      {
        title: 'Research the market',
        description: 'Gather market data and trends',
        columnId: doneColumn.id,
        position: 6,
      },
    ],
  });
  
  console.log('Created tasks');
  console.log('Seeding completed successfully');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });